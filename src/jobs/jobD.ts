// Job D: Build KPI Monthly Summary
// Aggregates weekly data into monthly summaries and calculates final KPI bonus

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, TaskPointsDetail, WeeklyRankingDetail, KpiMonthlyStatus } from '../types/database'
import {
  getPayrollPeriod,
  getWeeksInPeriod,
  getRatingFactor,
  getCountryFromWarehouse,
} from '../lib/utils'

interface JobDResult {
  success: boolean
  processed: number
  errors: string[]
  payrollPeriod: string
  warehouseCode?: string
}

interface WeeklySummary {
  warehouse_code: string
  warehouse_name: string | null
  staff_id: string
  staff_name: string | null
  role: string | null
  year_week: string
  main_task_points: number
  total_points: number
  task_points_detail: TaskPointsDetail
  estimated_work_hours: number
  pph: number
}

interface WeeklyRanking {
  warehouse_code: string
  staff_id: string
  year_week: string
  ranking_score: number
  pph: number
  estimated_work_hours: number
}

interface OrsSummary {
  warehouse_code: string
  staff_id: string
  ors_points_total: number
  penalty_rate: number
}

interface BonusConfig {
  warehouse_code: string | null
  country: string | null
  calculation_type: string
  amount_per_point: number | null
  fixed_amount: number | null
  cap_amount: number | null
  currency: string
}

interface PayrollData {
  staff_id: string
  work_hour: number | null
  actual_workdays: number | null
}

export async function runJobD(
  supabase: SupabaseClient<Database>,
  options: {
    payrollPeriod?: string
    warehouseCode?: string
    status?: KpiMonthlyStatus
  } = {}
): Promise<JobDResult> {
  const payrollPeriod = options.payrollPeriod || getPayrollPeriod(new Date())
  const weeksInPeriod = getWeeksInPeriod(payrollPeriod)

  const errors: string[] = []
  let processed = 0

  console.log(`[Job D] Starting monthly summary for period ${payrollPeriod}`)
  console.log(`[Job D] Weeks in period: ${weeksInPeriod.join(', ')}`)

  try {
    // Step 1: Fetch weekly summaries for the period
    let summaryQuery = supabase
      .from('kpi_weekly_summary')
      .select('warehouse_code, warehouse_name, staff_id, staff_name, role, year_week, main_task_points, total_points, task_points_detail, estimated_work_hours, pph')
      .eq('payroll_period', payrollPeriod)

    if (options.warehouseCode) {
      summaryQuery = summaryQuery.eq('warehouse_code', options.warehouseCode)
    }

    const { data: weeklySummaries, error: summaryError } = await summaryQuery

    if (summaryError) {
      throw new Error(`Failed to fetch weekly summaries: ${summaryError.message}`)
    }

    if (!weeklySummaries || weeklySummaries.length === 0) {
      console.log('[Job D] No weekly summaries found')
      return { success: true, processed: 0, errors: [], payrollPeriod }
    }

    console.log(`[Job D] Found ${weeklySummaries.length} weekly summaries`)

    // Step 2: Fetch weekly rankings
    let rankingQuery = supabase
      .from('ranking_weekly_result')
      .select('warehouse_code, staff_id, year_week, ranking_score, pph, estimated_work_hours')
      .in('year_week', weeksInPeriod)

    if (options.warehouseCode) {
      rankingQuery = rankingQuery.eq('warehouse_code', options.warehouseCode)
    }

    const { data: weeklyRankings, error: rankingError } = await rankingQuery

    if (rankingError) {
      console.warn(`[Job D] Warning: Failed to fetch weekly rankings: ${rankingError.message}`)
    }

    // Create ranking map
    const rankingMap = new Map<string, WeeklyRanking[]>()
    weeklyRankings?.forEach(r => {
      const key = `${r.warehouse_code}:${r.staff_id}`
      if (!rankingMap.has(key)) {
        rankingMap.set(key, [])
      }
      rankingMap.get(key)!.push(r as WeeklyRanking)
    })

    // Step 3: Fetch ORS monthly summaries
    let orsQuery = supabase
      .from('ors_monthly_summary')
      .select('warehouse_code, staff_id, ors_points_total, penalty_rate')
      .eq('payroll_period', payrollPeriod)

    if (options.warehouseCode) {
      orsQuery = orsQuery.eq('warehouse_code', options.warehouseCode)
    }

    const { data: orsSummaries, error: orsError } = await orsQuery

    if (orsError) {
      console.warn(`[Job D] Warning: Failed to fetch ORS summaries: ${orsError.message}`)
    }

    // Create ORS map
    const orsMap = new Map<string, OrsSummary>()
    orsSummaries?.forEach(o => {
      orsMap.set(`${o.warehouse_code}:${o.staff_id}`, o as OrsSummary)
    })

    // Step 4: Fetch bonus configurations
    const warehouseCodes = [...new Set(weeklySummaries.map(s => s.warehouse_code))]

    const { data: bonusConfigs, error: configError } = await supabase
      .from('kpi_bonus_config')
      .select('warehouse_code, country, calculation_type, amount_per_point, fixed_amount, cap_amount, currency')
      .eq('is_active', true)

    if (configError) {
      console.warn(`[Job D] Warning: Failed to fetch bonus configs: ${configError.message}`)
    }

    // Create config map
    const configMap = new Map<string, BonusConfig>()
    bonusConfigs?.forEach(c => {
      if (c.warehouse_code) {
        configMap.set(`wh:${c.warehouse_code}`, c as BonusConfig)
      } else if (c.country) {
        configMap.set(`co:${c.country}`, c as BonusConfig)
      }
    })

    // Step 5: Fetch payroll data for work hours
    const staffIds = [...new Set(weeklySummaries.map(s => s.staff_id))]

    const { data: payrollData, error: payrollError } = await supabase
      .from('payroll_monthly')
      .select('staff_id, work_hour, actual_workdays')
      .in('staff_id', staffIds)
      .eq('payroll_period', payrollPeriod)

    if (payrollError) {
      console.warn(`[Job D] Warning: Failed to fetch payroll data: ${payrollError.message}`)
    }

    const payrollMap = new Map<string, PayrollData>()
    payrollData?.forEach(p => payrollMap.set(p.staff_id, p as PayrollData))

    // Step 6: Aggregate monthly data for each staff
    const staffMonthlyData = new Map<string, {
      warehouse_code: string
      warehouse_name: string | null
      staff_id: string
      staff_name: string | null
      role: string | null
      majorKpi: number
      totalPoints: number
      taskPointsMonthly: Record<string, { points: number; quantity: number }>
      weeklyData: Array<{ yearWeek: string; mainTaskPoints: number; hours: number; pph: number }>
    }>()

    for (const summary of weeklySummaries as WeeklySummary[]) {
      const key = `${summary.warehouse_code}:${summary.staff_id}`

      if (!staffMonthlyData.has(key)) {
        staffMonthlyData.set(key, {
          warehouse_code: summary.warehouse_code,
          warehouse_name: summary.warehouse_name,
          staff_id: summary.staff_id,
          staff_name: summary.staff_name,
          role: summary.role,
          majorKpi: 0,
          totalPoints: 0,
          taskPointsMonthly: {},
          weeklyData: [],
        })
      }

      const data = staffMonthlyData.get(key)!
      data.majorKpi += summary.main_task_points
      data.totalPoints += summary.total_points
      data.weeklyData.push({
        yearWeek: summary.year_week,
        mainTaskPoints: summary.main_task_points,
        hours: summary.estimated_work_hours,
        pph: summary.pph,
      })

      // Merge task points detail
      if (summary.task_points_detail) {
        for (const [task, values] of Object.entries(summary.task_points_detail)) {
          if (!data.taskPointsMonthly[task]) {
            data.taskPointsMonthly[task] = { points: 0, quantity: 0 }
          }
          data.taskPointsMonthly[task].points += (values as { points: number; quantity: number }).points || 0
          data.taskPointsMonthly[task].quantity += (values as { points: number; quantity: number }).quantity || 0
        }
      }
    }

    console.log(`[Job D] Aggregated data for ${staffMonthlyData.size} staff members`)

    // Step 7: Calculate final KPI and bonus for each staff
    const monthlySummaries = []
    const payrollBridgeRecords = []

    for (const [key, data] of staffMonthlyData) {
      // Get weekly rankings
      const rankings = rankingMap.get(key) || []
      const weeklyRankings: WeeklyRankingDetail[] = rankings.map(r => ({
        year_week: r.year_week,
        ranking_score: r.ranking_score,
        pph: r.pph,
        work_hours: r.estimated_work_hours,
      }))

      // Calculate weighted average ranking
      let totalWeightedScore = 0
      let totalHours = 0

      for (const r of rankings) {
        totalWeightedScore += r.ranking_score * r.estimated_work_hours
        totalHours += r.estimated_work_hours
      }

      const avgRankingScore = totalHours > 0 ? totalWeightedScore / totalHours : 3
      const finalRankingScore = Math.round(avgRankingScore)
      const ratingFactor = getRatingFactor(finalRankingScore)

      // Get ORS data
      const ors = orsMap.get(key)
      const orsPointsTotal = ors?.ors_points_total || 0
      const orsPenaltyRate = ors?.penalty_rate || 0

      // Get bonus config
      const country = getCountryFromWarehouse(data.warehouse_code)
      const bonusConfig = configMap.get(`wh:${data.warehouse_code}`) || configMap.get(`co:${country}`)

      // Calculate KPI bonus
      let kpiBonusCalculated = 0
      if (bonusConfig) {
        if (bonusConfig.calculation_type === 'PER_POINT' && bonusConfig.amount_per_point) {
          kpiBonusCalculated = data.majorKpi * bonusConfig.amount_per_point * ratingFactor
        } else if (bonusConfig.calculation_type === 'FIXED' && bonusConfig.fixed_amount) {
          kpiBonusCalculated = bonusConfig.fixed_amount * ratingFactor
        }

        // Apply cap
        if (bonusConfig.cap_amount && kpiBonusCalculated > bonusConfig.cap_amount) {
          kpiBonusCalculated = bonusConfig.cap_amount
        }
      } else {
        // Default: 1000 VND per point
        kpiBonusCalculated = data.majorKpi * 1000 * ratingFactor
      }

      // Apply ORS penalty
      const kpiBonusFinal = kpiBonusCalculated * (1 - orsPenaltyRate)

      // Get payroll data
      const payroll = payrollMap.get(data.staff_id)

      monthlySummaries.push({
        warehouse_code: data.warehouse_code,
        warehouse_name: data.warehouse_name,
        staff_id: data.staff_id,
        staff_name: data.staff_name,
        role: data.role,
        payroll_period: payrollPeriod,
        major_kpi: Math.round(data.majorKpi * 100) / 100,
        total_kpi_points: Math.round(data.totalPoints * 100) / 100,
        task_points_monthly: data.taskPointsMonthly,
        weekly_rankings: weeklyRankings,
        avg_ranking_score: Math.round(avgRankingScore * 100) / 100,
        final_ranking_score: finalRankingScore,
        rating_factor: ratingFactor,
        kpi_bonus_calculated: Math.round(kpiBonusCalculated),
        ors_points_total: orsPointsTotal,
        ors_penalty_rate: orsPenaltyRate,
        kpi_bonus_final: Math.round(kpiBonusFinal),
        actual_workdays: payroll?.actual_workdays || null,
        work_hours: payroll?.work_hour || null,
        status: options.status || 'CALCULATED',
      })

      payrollBridgeRecords.push({
        warehouse_code: data.warehouse_code,
        payroll_period: payrollPeriod,
        staff_id: data.staff_id,
        major_kpi: Math.round(data.majorKpi * 100) / 100,
        rating_factor: ratingFactor,
        kpi_bonus: Math.round(kpiBonusFinal),
        penalty: orsPointsTotal > 0 ? Math.round(kpiBonusCalculated - kpiBonusFinal) : 0,
        calculation_version: 'v2.0',
        calculated_at: new Date().toISOString(),
        applied_to_payroll: false,
      })
    }

    // Step 8: Upsert monthly summaries
    console.log(`[Job D] Upserting ${monthlySummaries.length} monthly summaries`)

    const batchSize = 100
    for (let i = 0; i < monthlySummaries.length; i += batchSize) {
      const batch = monthlySummaries.slice(i, i + batchSize)

      const { error: upsertError } = await supabase
        .from('kpi_monthly_summary')
        .upsert(batch, {
          onConflict: 'warehouse_code,staff_id,payroll_period',
          ignoreDuplicates: false,
        })

      if (upsertError) {
        errors.push(`Monthly summary batch ${Math.floor(i / batchSize) + 1} failed: ${upsertError.message}`)
        console.error(`[Job D] Monthly summary batch error:`, upsertError)
      } else {
        processed += batch.length
      }
    }

    // Step 9: Upsert payroll bridge records
    console.log(`[Job D] Upserting ${payrollBridgeRecords.length} payroll bridge records`)

    for (let i = 0; i < payrollBridgeRecords.length; i += batchSize) {
      const batch = payrollBridgeRecords.slice(i, i + batchSize)

      const { error: bridgeError } = await supabase
        .from('payroll_kpi_bridge')
        .upsert(batch, {
          onConflict: 'warehouse_code,payroll_period,staff_id',
          ignoreDuplicates: false,
        })

      if (bridgeError) {
        errors.push(`Payroll bridge batch ${Math.floor(i / batchSize) + 1} failed: ${bridgeError.message}`)
        console.error(`[Job D] Payroll bridge batch error:`, bridgeError)
      }
    }

    console.log(`[Job D] Completed. Processed: ${processed}, Errors: ${errors.length}`)

    return {
      success: errors.length === 0,
      processed,
      errors,
      payrollPeriod,
      warehouseCode: options.warehouseCode,
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[Job D] Fatal error:`, error)
    return {
      success: false,
      processed,
      errors: [errorMessage],
      payrollPeriod,
      warehouseCode: options.warehouseCode,
    }
  }
}
