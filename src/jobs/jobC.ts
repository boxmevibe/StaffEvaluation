// Job C: Compute ORS Monthly Summary
// Aggregates confirmed ORS events into monthly summaries with milestone calculation

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, OrsEventDetail, MilestoneLevel } from '../types/database'
import { getPayrollPeriod, getMilestoneLevel } from '../lib/utils'

interface JobCResult {
  success: boolean
  processed: number
  errors: string[]
  payrollPeriod: string
  warehouseCode?: string
}

interface OrsEvent {
  id: number
  warehouse_code: string
  staff_id: string
  staff_name: string | null
  event_date: string
  ors_code: string
  ors_points: number
  description: string | null
  status: string
}

interface MilestoneConfig {
  ors_points_from: number
  ors_points_to: number
  milestone_level: MilestoneLevel
  penalty_rate: number
  warehouse_code: string | null
}

export async function runJobC(
  supabase: SupabaseClient<Database>,
  options: {
    payrollPeriod?: string
    warehouseCode?: string
  } = {}
): Promise<JobCResult> {
  // Default to current month
  const payrollPeriod = options.payrollPeriod || getPayrollPeriod(new Date())
  
  // Calculate date range for the period
  const [year, month] = payrollPeriod.split('-').map(Number)
  const startDate = `${payrollPeriod}-01`
  const endDate = new Date(year, month, 0).toISOString().split('T')[0] // Last day of month

  const errors: string[] = []
  let processed = 0

  console.log(`[Job C] Starting ORS summary for period ${payrollPeriod} (${startDate} - ${endDate})`)

  try {
    // Step 1: Fetch confirmed ORS events for the period
    let query = supabase
      .from('ors_event')
      .select('id, warehouse_code, staff_id, staff_name, event_date, ors_code, ors_points, description, status')
      .eq('status', 'CONFIRMED')
      .gte('event_date', startDate)
      .lte('event_date', endDate)

    if (options.warehouseCode) {
      query = query.eq('warehouse_code', options.warehouseCode)
    }

    const { data: orsEvents, error: eventsError } = await query

    if (eventsError) {
      throw new Error(`Failed to fetch ORS events: ${eventsError.message}`)
    }

    console.log(`[Job C] Found ${orsEvents?.length || 0} confirmed ORS events`)

    // Step 2: Fetch milestone configurations
    const warehouseCodes = [...new Set(orsEvents?.map(e => e.warehouse_code) || [])]

    const { data: milestoneConfigs, error: configError } = await supabase
      .from('ors_milestone_config')
      .select('ors_points_from, ors_points_to, milestone_level, penalty_rate, warehouse_code')
      .eq('is_active', true)

    if (configError) {
      console.warn(`[Job C] Warning: Failed to fetch milestone configs: ${configError.message}`)
    }

    // Organize configs
    const configsByWarehouse = new Map<string, MilestoneConfig[]>()
    const globalConfigs: MilestoneConfig[] = []

    milestoneConfigs?.forEach(config => {
      if (config.warehouse_code) {
        if (!configsByWarehouse.has(config.warehouse_code)) {
          configsByWarehouse.set(config.warehouse_code, [])
        }
        configsByWarehouse.get(config.warehouse_code)!.push(config as MilestoneConfig)
      } else {
        globalConfigs.push(config as MilestoneConfig)
      }
    })

    // Step 3: Aggregate by staff
    const staffOrsData = new Map<string, {
      warehouse_code: string
      staff_id: string
      staff_name: string | null
      events: OrsEventDetail[]
      totalPoints: number
    }>()

    for (const event of (orsEvents || []) as OrsEvent[]) {
      const key = `${event.warehouse_code}:${event.staff_id}`

      if (!staffOrsData.has(key)) {
        staffOrsData.set(key, {
          warehouse_code: event.warehouse_code,
          staff_id: event.staff_id,
          staff_name: event.staff_name,
          events: [],
          totalPoints: 0,
        })
      }

      const data = staffOrsData.get(key)!
      data.totalPoints += event.ors_points
      data.events.push({
        event_id: event.id,
        event_date: event.event_date,
        ors_code: event.ors_code,
        ors_points: event.ors_points,
        description: event.description,
      })
    }

    console.log(`[Job C] Aggregated ORS for ${staffOrsData.size} staff members`)

    // Step 4: Calculate milestone and penalty for each staff
    const summariesToUpsert = []

    for (const [_, data] of staffOrsData) {
      // Find applicable milestone config
      const warehouseConfigs = configsByWarehouse.get(data.warehouse_code) || []
      const applicableConfigs = [...warehouseConfigs, ...globalConfigs]

      let milestoneLevel: MilestoneLevel = 'GREEN'
      let penaltyRate = 0

      const matchedConfig = applicableConfigs.find(config => 
        data.totalPoints >= config.ors_points_from && data.totalPoints <= config.ors_points_to
      )

      if (matchedConfig) {
        milestoneLevel = matchedConfig.milestone_level
        penaltyRate = matchedConfig.penalty_rate
      } else {
        // Use default milestone calculation
        const defaultMilestone = getMilestoneLevel(data.totalPoints)
        milestoneLevel = defaultMilestone.level as MilestoneLevel
        penaltyRate = defaultMilestone.penaltyRate
      }

      summariesToUpsert.push({
        warehouse_code: data.warehouse_code,
        staff_id: data.staff_id,
        staff_name: data.staff_name,
        payroll_period: payrollPeriod,
        ors_points_total: data.totalPoints,
        event_count: data.events.length,
        events_detail: data.events,
        milestone_level: milestoneLevel,
        penalty_rate: penaltyRate,
      })
    }

    // Also create zero-ORS summaries for staff who worked but have no ORS events
    // This ensures everyone has an ORS summary record
    if (orsEvents && orsEvents.length > 0) {
      // Fetch all staff who worked in this period
      let staffQuery = supabase
        .from('kpi_weekly_summary')
        .select('warehouse_code, staff_id, staff_name')
        .eq('payroll_period', payrollPeriod)

      if (options.warehouseCode) {
        staffQuery = staffQuery.eq('warehouse_code', options.warehouseCode)
      }

      const { data: allStaff } = await staffQuery

      if (allStaff) {
        const existingKeys = new Set(summariesToUpsert.map(s => `${s.warehouse_code}:${s.staff_id}`))

        for (const staff of allStaff) {
          const key = `${staff.warehouse_code}:${staff.staff_id}`
          if (!existingKeys.has(key)) {
            summariesToUpsert.push({
              warehouse_code: staff.warehouse_code,
              staff_id: staff.staff_id,
              staff_name: staff.staff_name,
              payroll_period: payrollPeriod,
              ors_points_total: 0,
              event_count: 0,
              events_detail: [],
              milestone_level: 'GREEN' as MilestoneLevel,
              penalty_rate: 0,
            })
          }
        }
      }
    }

    // Step 5: Upsert summaries
    if (summariesToUpsert.length > 0) {
      console.log(`[Job C] Upserting ${summariesToUpsert.length} ORS summaries`)

      const batchSize = 100
      for (let i = 0; i < summariesToUpsert.length; i += batchSize) {
        const batch = summariesToUpsert.slice(i, i + batchSize)

        const { error: upsertError } = await supabase
          .from('ors_monthly_summary')
          .upsert(batch, {
            onConflict: 'warehouse_code,staff_id,payroll_period',
            ignoreDuplicates: false,
          })

        if (upsertError) {
          errors.push(`Batch ${Math.floor(i / batchSize) + 1} failed: ${upsertError.message}`)
          console.error(`[Job C] Batch error:`, upsertError)
        } else {
          processed += batch.length
        }
      }
    }

    console.log(`[Job C] Completed. Processed: ${processed}, Errors: ${errors.length}`)

    return {
      success: errors.length === 0,
      processed,
      errors,
      payrollPeriod,
      warehouseCode: options.warehouseCode,
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[Job C] Fatal error:`, error)
    return {
      success: false,
      processed,
      errors: [errorMessage],
      payrollPeriod,
      warehouseCode: options.warehouseCode,
    }
  }
}
