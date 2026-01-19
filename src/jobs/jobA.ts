// Job A: Build KPI Weekly Summary
// Aggregates daily productivity data into weekly summaries with PPH calculation

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, TaskPointsDetail, MainTaskType } from '../types/database'
import {
  getISOWeekString,
  getWeekStartDate,
  getWeekEndDate,
  getPayrollPeriod,
  formatDate,
  calculatePPH,
  TASK_COLUMNS,
  type TaskType,
} from '../lib/utils'

interface JobAResult {
  success: boolean
  processed: number
  errors: string[]
  yearWeek: string
  warehouseCode?: string
}

interface DailyProductivity {
  warehouse_code: string
  warehouse_name: string | null
  staff_id: string
  staff_name: string | null
  date: string
  packing_point: number | null
  packing_quantity: number | null
  picking_point: number | null
  picking_quantity: number | null
  handover_point: number | null
  handover_quantity: number | null
  putaway_point: number | null
  putaway_quantity: number | null
  inspection_point: number | null
  inspection_quantity: number | null
  co_inspection_point: number | null
  co_inspection_quantity: number | null
  data_entry_point: number | null
  data_entry_quantity: number | null
  unloading_point: number | null
  unloading_cbm: number | null
  move_point: number | null
  move_quantity: number | null
  cycle_count_point: number | null
  cycle_count_quantity: number | null
  relabel_point: number | null
  relabel_quantity: number | null
  total_point: number | null
}

interface PayrollData {
  staff_id: string
  role: number | null
  role_name: string | null
  work_hour: number | null
  actual_workdays: number | null
}

interface RoleTaskConfig {
  role: string
  role_id: number | null
  main_task: MainTaskType
  warehouse_code: string | null
}

export async function runJobA(
  supabase: SupabaseClient<Database>,
  options: {
    yearWeek?: string
    warehouseCode?: string
    forceRecalculate?: boolean
  } = {}
): Promise<JobAResult> {
  const yearWeek = options.yearWeek || getISOWeekString(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // Default: previous week
  const weekStart = getWeekStartDate(yearWeek)
  const weekEnd = getWeekEndDate(yearWeek)
  const payrollPeriod = getPayrollPeriod(weekStart)
  
  const errors: string[] = []
  let processed = 0

  console.log(`[Job A] Starting for week ${yearWeek} (${formatDate(weekStart)} - ${formatDate(weekEnd)})`)

  try {
    // Step 1: Fetch productivity data for the week
    let query = supabase
      .from('warehouse_productivity_daily')
      .select('*')
      .gte('date', formatDate(weekStart))
      .lte('date', formatDate(weekEnd))
    
    if (options.warehouseCode) {
      query = query.eq('warehouse_code', options.warehouseCode)
    }

    const { data: productivityData, error: productivityError } = await query

    if (productivityError) {
      throw new Error(`Failed to fetch productivity data: ${productivityError.message}`)
    }

    if (!productivityData || productivityData.length === 0) {
      console.log('[Job A] No productivity data found for the period')
      return { success: true, processed: 0, errors: [], yearWeek }
    }

    console.log(`[Job A] Found ${productivityData.length} daily records`)

    // Step 2: Fetch payroll data for work hours estimation
    const staffIds = [...new Set(productivityData.map(p => p.staff_id))]
    const warehouseCodes = [...new Set(productivityData.map(p => p.warehouse_code))]

    const { data: payrollData, error: payrollError } = await supabase
      .from('payroll_monthly')
      .select('staff_id, role, role_name, work_hour, actual_workdays')
      .in('staff_id', staffIds)
      .eq('payroll_period', payrollPeriod)

    if (payrollError) {
      console.warn(`[Job A] Warning: Failed to fetch payroll data: ${payrollError.message}`)
    }

    const payrollMap = new Map<string, PayrollData>()
    payrollData?.forEach(p => payrollMap.set(p.staff_id, p))

    // Step 3: Fetch role-task configuration
    const { data: roleTaskConfig, error: configError } = await supabase
      .from('role_main_task_config')
      .select('role, role_id, main_task, warehouse_code')
      .eq('is_active', true)
      .or(`warehouse_code.is.null,warehouse_code.in.(${warehouseCodes.join(',')})`)

    if (configError) {
      console.warn(`[Job A] Warning: Failed to fetch role config: ${configError.message}`)
    }

    const roleConfigMap = new Map<string, RoleTaskConfig>()
    roleTaskConfig?.forEach(c => {
      const key = c.warehouse_code ? `${c.warehouse_code}:${c.role}` : c.role
      roleConfigMap.set(key, c)
    })

    // Step 4: Aggregate by staff and warehouse
    const staffWeeklyData = new Map<string, {
      warehouse_code: string
      warehouse_name: string | null
      staff_id: string
      staff_name: string | null
      dates: Set<string>
      taskPoints: Record<TaskType, { points: number; quantity: number }>
      totalPoints: number
      totalQuantity: number
    }>()

    for (const record of productivityData as DailyProductivity[]) {
      const key = `${record.warehouse_code}:${record.staff_id}`
      
      if (!staffWeeklyData.has(key)) {
        staffWeeklyData.set(key, {
          warehouse_code: record.warehouse_code,
          warehouse_name: record.warehouse_name,
          staff_id: record.staff_id,
          staff_name: record.staff_name,
          dates: new Set(),
          taskPoints: {
            packing: { points: 0, quantity: 0 },
            picking: { points: 0, quantity: 0 },
            handover: { points: 0, quantity: 0 },
            putaway: { points: 0, quantity: 0 },
            inspection: { points: 0, quantity: 0 },
            co_inspection: { points: 0, quantity: 0 },
            data_entry: { points: 0, quantity: 0 },
            unloading: { points: 0, quantity: 0 },
            move: { points: 0, quantity: 0 },
            cycle_count: { points: 0, quantity: 0 },
            relabel: { points: 0, quantity: 0 },
          },
          totalPoints: 0,
          totalQuantity: 0,
        })
      }

      const staffData = staffWeeklyData.get(key)!
      staffData.dates.add(record.date)

      // Aggregate each task type
      for (const [task, cols] of Object.entries(TASK_COLUMNS) as [TaskType, { point: string; quantity: string }][]) {
        const pointKey = cols.point as keyof DailyProductivity
        const qtyKey = cols.quantity as keyof DailyProductivity
        
        const points = (record[pointKey] as number) || 0
        const quantity = (record[qtyKey] as number) || 0

        staffData.taskPoints[task].points += points
        staffData.taskPoints[task].quantity += quantity
        staffData.totalPoints += points
        staffData.totalQuantity += quantity
      }
    }

    console.log(`[Job A] Aggregated data for ${staffWeeklyData.size} staff members`)

    // Step 5: Calculate PPH and determine main task for each staff
    const summariesToUpsert = []

    for (const [_, data] of staffWeeklyData) {
      const payroll = payrollMap.get(data.staff_id)
      const workingDays = data.dates.size

      // Estimate work hours
      let estimatedHours = 0
      if (payroll?.work_hour && payroll?.actual_workdays && payroll.actual_workdays > 0) {
        // Monthly hours * (weekly working days / monthly workdays)
        estimatedHours = payroll.work_hour * (workingDays / payroll.actual_workdays)
      } else {
        // Fallback: 8 hours per working day
        estimatedHours = workingDays * 8
      }

      // Determine main task
      let mainTask: MainTaskType | null = null
      let mainTaskPoints = 0
      let mainTaskQuantity = 0

      // First, try to get from role config
      const roleName = payroll?.role_name || String(payroll?.role || '')
      const roleConfig = roleConfigMap.get(`${data.warehouse_code}:${roleName}`) 
        || roleConfigMap.get(roleName)
      
      if (roleConfig) {
        mainTask = roleConfig.main_task
        mainTaskPoints = data.taskPoints[mainTask].points
        mainTaskQuantity = data.taskPoints[mainTask].quantity
      }

      // Fallback: task with highest points
      if (!mainTask || mainTaskPoints === 0) {
        for (const [task, values] of Object.entries(data.taskPoints) as [TaskType, { points: number; quantity: number }][]) {
          if (values.points > mainTaskPoints) {
            mainTask = task as MainTaskType
            mainTaskPoints = values.points
            mainTaskQuantity = values.quantity
          }
        }
      }

      // Calculate PPH
      const pph = calculatePPH(mainTaskPoints, estimatedHours)

      // Determine data status
      let dataStatus = 'OK'
      if (data.totalPoints === 0) {
        dataStatus = 'NO_DATA'
      } else if (estimatedHours < 20) {
        dataStatus = 'INSUFFICIENT_HOURS'
      }

      // Build task points detail
      const taskPointsDetail: TaskPointsDetail = {}
      for (const [task, values] of Object.entries(data.taskPoints) as [TaskType, { points: number; quantity: number }][]) {
        if (values.points > 0) {
          taskPointsDetail[task] = {
            points: values.points,
            quantity: values.quantity,
          }
        }
      }

      summariesToUpsert.push({
        warehouse_code: data.warehouse_code,
        warehouse_name: data.warehouse_name,
        staff_id: data.staff_id,
        staff_name: data.staff_name,
        role: payroll?.role_name || null,
        year_week: yearWeek,
        week_start: formatDate(weekStart),
        week_end: formatDate(weekEnd),
        payroll_period: payrollPeriod,
        main_task: mainTask,
        main_task_points: mainTaskPoints,
        main_task_quantity: mainTaskQuantity,
        task_points_detail: taskPointsDetail,
        total_points: data.totalPoints,
        total_quantity: data.totalQuantity,
        estimated_work_hours: Math.round(estimatedHours * 100) / 100,
        working_days: workingDays,
        pph: pph,
        data_status: dataStatus,
      })
    }

    // Step 6: Upsert to kpi_weekly_summary
    console.log(`[Job A] Upserting ${summariesToUpsert.length} weekly summaries`)

    // Process in batches
    const batchSize = 100
    for (let i = 0; i < summariesToUpsert.length; i += batchSize) {
      const batch = summariesToUpsert.slice(i, i + batchSize)
      
      const { error: upsertError } = await supabase
        .from('kpi_weekly_summary')
        .upsert(batch, {
          onConflict: 'warehouse_code,staff_id,year_week',
          ignoreDuplicates: false,
        })

      if (upsertError) {
        errors.push(`Batch ${Math.floor(i / batchSize) + 1} failed: ${upsertError.message}`)
        console.error(`[Job A] Batch error:`, upsertError)
      } else {
        processed += batch.length
      }
    }

    console.log(`[Job A] Completed. Processed: ${processed}, Errors: ${errors.length}`)

    return {
      success: errors.length === 0,
      processed,
      errors,
      yearWeek,
      warehouseCode: options.warehouseCode,
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[Job A] Fatal error:`, error)
    return {
      success: false,
      processed,
      errors: [errorMessage],
      yearWeek,
      warehouseCode: options.warehouseCode,
    }
  }
}
