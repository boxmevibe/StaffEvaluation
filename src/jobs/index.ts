// KPI Jobs Index
// Export all job functions for easy import

export { runJobA } from './jobA'
export { runJobB } from './jobB'
export { runJobC } from './jobC'
export { runJobD } from './jobD'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'
import { runJobA } from './jobA'
import { runJobB } from './jobB'
import { runJobC } from './jobC'
import { runJobD } from './jobD'

export interface PipelineResult {
  success: boolean
  jobResults: {
    jobA: Awaited<ReturnType<typeof runJobA>> | null
    jobB: Awaited<ReturnType<typeof runJobB>> | null
    jobC: Awaited<ReturnType<typeof runJobC>> | null
    jobD: Awaited<ReturnType<typeof runJobD>> | null
  }
  totalProcessed: number
  errors: string[]
  duration: number
}

/**
 * Run the complete KPI calculation pipeline
 * Job A -> Job B -> Job C -> Job D
 */
export async function runPipeline(
  supabase: SupabaseClient<Database>,
  options: {
    yearWeek?: string
    payrollPeriod?: string
    warehouseCode?: string
    skipJobA?: boolean
    skipJobB?: boolean
    skipJobC?: boolean
    skipJobD?: boolean
  } = {}
): Promise<PipelineResult> {
  const startTime = Date.now()
  const allErrors: string[] = []
  let totalProcessed = 0

  const result: PipelineResult = {
    success: true,
    jobResults: {
      jobA: null,
      jobB: null,
      jobC: null,
      jobD: null,
    },
    totalProcessed: 0,
    errors: [],
    duration: 0,
  }

  console.log('[Pipeline] Starting KPI calculation pipeline')

  try {
    // Job A: Build KPI Weekly Summary
    if (!options.skipJobA) {
      console.log('[Pipeline] Running Job A...')
      result.jobResults.jobA = await runJobA(supabase, {
        yearWeek: options.yearWeek,
        warehouseCode: options.warehouseCode,
      })
      totalProcessed += result.jobResults.jobA.processed
      allErrors.push(...result.jobResults.jobA.errors)
    }

    // Job B: Compute Ranking Weekly Result
    if (!options.skipJobB) {
      console.log('[Pipeline] Running Job B...')
      result.jobResults.jobB = await runJobB(supabase, {
        yearWeek: options.yearWeek,
        warehouseCode: options.warehouseCode,
      })
      totalProcessed += result.jobResults.jobB.processed
      allErrors.push(...result.jobResults.jobB.errors)
    }

    // Job C: Compute ORS Monthly Summary
    if (!options.skipJobC) {
      console.log('[Pipeline] Running Job C...')
      result.jobResults.jobC = await runJobC(supabase, {
        payrollPeriod: options.payrollPeriod,
        warehouseCode: options.warehouseCode,
      })
      totalProcessed += result.jobResults.jobC.processed
      allErrors.push(...result.jobResults.jobC.errors)
    }

    // Job D: Build KPI Monthly Summary
    if (!options.skipJobD) {
      console.log('[Pipeline] Running Job D...')
      result.jobResults.jobD = await runJobD(supabase, {
        payrollPeriod: options.payrollPeriod,
        warehouseCode: options.warehouseCode,
      })
      totalProcessed += result.jobResults.jobD.processed
      allErrors.push(...result.jobResults.jobD.errors)
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    allErrors.push(`Pipeline error: ${errorMessage}`)
    console.error('[Pipeline] Fatal error:', error)
  }

  result.duration = Date.now() - startTime
  result.totalProcessed = totalProcessed
  result.errors = allErrors
  result.success = allErrors.length === 0

  console.log(`[Pipeline] Completed in ${result.duration}ms. Processed: ${totalProcessed}, Errors: ${allErrors.length}`)

  return result
}

/**
 * Run the pipeline for an entire month
 * Iterates through all weeks in the payroll period
 */
import { getWeeksInPeriod } from '../lib/utils'

export async function runMonthlyPipeline(
  supabase: SupabaseClient<Database>,
  options: {
    payrollPeriod: string
    warehouseCode?: string
  }
): Promise<PipelineResult> {
  const startTime = Date.now()
  const allErrors: string[] = []
  let totalProcessed = 0

  const weeks = getWeeksInPeriod(options.payrollPeriod)
  console.log(`[Monthly Pipeline] Starting for period ${options.payrollPeriod} (Weeks: ${weeks.join(', ')})`)

  const result: PipelineResult = {
    success: true,
    jobResults: { jobA: null, jobB: null, jobC: null, jobD: null }, // Only stores last run or aggregate
    totalProcessed: 0,
    errors: [],
    duration: 0
  }

  try {
    // 1. Run Job A & B for each week
    for (const week of weeks) {
      console.log(`[Monthly Pipeline] Processing Week ${week}...`)

      const resA = await runJobA(supabase, {
        yearWeek: week,
        warehouseCode: options.warehouseCode
      })
      totalProcessed += resA.processed
      allErrors.push(...resA.errors)

      const resB = await runJobB(supabase, {
        yearWeek: week,
        warehouseCode: options.warehouseCode
      })
      totalProcessed += resB.processed
      allErrors.push(...resB.errors)
    }

    // 2. Run Job C (ORS Summary) - Monthly
    console.log(`[Monthly Pipeline] Processing Job C (Monthly)...`)
    const resC = await runJobC(supabase, {
      payrollPeriod: options.payrollPeriod,
      warehouseCode: options.warehouseCode
    })
    totalProcessed += resC.processed
    allErrors.push(...resC.errors)
    result.jobResults.jobC = resC

    // 3. Run Job D (Payroll Bridge) - Monthly
    console.log(`[Monthly Pipeline] Processing Job D (Monthly)...`)
    const resD = await runJobD(supabase, {
      payrollPeriod: options.payrollPeriod,
      warehouseCode: options.warehouseCode
    })
    totalProcessed += resD.processed
    allErrors.push(...resD.errors)
    result.jobResults.jobD = resD

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    allErrors.push(`Monthly Pipeline error: ${errorMessage}`)
    console.error('[Monthly Pipeline] Fatal error:', error)
  }

  result.duration = Date.now() - startTime
  result.totalProcessed = totalProcessed
  result.errors = allErrors
  result.success = allErrors.length === 0

  return result
}
