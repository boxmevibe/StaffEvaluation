// Job B: Compute Ranking Weekly Result
// Calculates ranking scores based on PPH from weekly summaries

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'
import {
  getISOWeekString,
  getWeekStartDate,
  getWeekEndDate,
  formatDate,
  getDefaultRankingScore,
} from '../lib/utils'

interface JobBResult {
  success: boolean
  processed: number
  errors: string[]
  yearWeek: string
  warehouseCode?: string
}

interface RankingConfig {
  id: number
  warehouse_code: string | null
  role: string | null
  main_task: string | null
  pph_min: number
  pph_max: number
  ranking_score: number
  min_weekly_hours: number | null
}

interface WeeklySummary {
  warehouse_code: string
  staff_id: string
  staff_name: string | null
  role: string | null
  main_task: string | null
  main_task_points: number
  estimated_work_hours: number
  pph: number
}

export async function runJobB(
  supabase: SupabaseClient<Database>,
  options: {
    yearWeek?: string
    warehouseCode?: string
  } = {}
): Promise<JobBResult> {
  const yearWeek = options.yearWeek || getISOWeekString(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  const weekStart = getWeekStartDate(yearWeek)
  const weekEnd = getWeekEndDate(yearWeek)

  const errors: string[] = []
  let processed = 0

  console.log(`[Job B] Starting ranking computation for week ${yearWeek}`)

  try {
    // Step 1: Fetch weekly summaries
    let query = supabase
      .from('kpi_weekly_summary')
      .select('warehouse_code, staff_id, staff_name, role, main_task, main_task_points, estimated_work_hours, pph')
      .eq('year_week', yearWeek)

    if (options.warehouseCode) {
      query = query.eq('warehouse_code', options.warehouseCode)
    }

    const { data: weeklySummaries, error: summaryError } = await query

    if (summaryError) {
      throw new Error(`Failed to fetch weekly summaries: ${summaryError.message}`)
    }

    if (!weeklySummaries || weeklySummaries.length === 0) {
      console.log('[Job B] No weekly summaries found')
      return { success: true, processed: 0, errors: [], yearWeek }
    }

    console.log(`[Job B] Found ${weeklySummaries.length} weekly summaries`)

    // Step 2: Fetch ranking configurations
    const warehouseCodes = [...new Set(weeklySummaries.map(s => s.warehouse_code))]

    const { data: rankingConfigs, error: configError } = await supabase
      .from('ranking_range_config')
      .select('*')
      .eq('is_active', true)
      .or(`warehouse_code.is.null,warehouse_code.in.(${warehouseCodes.join(',')})`)
      .lte('effective_from', formatDate(weekStart))
      .or(`effective_to.is.null,effective_to.gte.${formatDate(weekEnd)}`)

    if (configError) {
      console.warn(`[Job B] Warning: Failed to fetch ranking configs: ${configError.message}`)
    }

    // Organize configs by warehouse
    const configsByWarehouse = new Map<string, RankingConfig[]>()
    const globalConfigs: RankingConfig[] = []

    rankingConfigs?.forEach(config => {
      if (config.warehouse_code) {
        if (!configsByWarehouse.has(config.warehouse_code)) {
          configsByWarehouse.set(config.warehouse_code, [])
        }
        configsByWarehouse.get(config.warehouse_code)!.push(config)
      } else {
        globalConfigs.push(config)
      }
    })

    // Step 3: Calculate ranking for each staff
    const rankingResults = []

    for (const summary of weeklySummaries as WeeklySummary[]) {
      // Find applicable config
      const warehouseConfigs = configsByWarehouse.get(summary.warehouse_code) || []
      const applicableConfigs = [...warehouseConfigs, ...globalConfigs]

      let rankingScore = 3 // Default
      let rankingConfigId: number | null = null
      let status = 'FINAL'

      // Match PPH to ranking
      const matchedConfig = applicableConfigs.find(config => {
        // Check if role and main_task match (if specified in config)
        if (config.role && config.role !== summary.role) return false
        if (config.main_task && config.main_task !== summary.main_task) return false
        
        // Check PPH range
        return summary.pph >= config.pph_min && summary.pph <= config.pph_max
      })

      if (matchedConfig) {
        rankingScore = matchedConfig.ranking_score
        rankingConfigId = matchedConfig.id

        // Check minimum hours requirement
        if (matchedConfig.min_weekly_hours && summary.estimated_work_hours < matchedConfig.min_weekly_hours) {
          status = 'INSUFFICIENT_DATA'
        }
      } else {
        // Use default PPH thresholds
        rankingScore = getDefaultRankingScore(summary.pph)
      }

      // Check data sufficiency
      if (summary.estimated_work_hours < 20) {
        status = 'INSUFFICIENT_DATA'
      }

      rankingResults.push({
        warehouse_code: summary.warehouse_code,
        staff_id: summary.staff_id,
        staff_name: summary.staff_name,
        year_week: yearWeek,
        week_start: formatDate(weekStart),
        week_end: formatDate(weekEnd),
        pph: summary.pph,
        main_task_points: summary.main_task_points,
        estimated_work_hours: summary.estimated_work_hours,
        ranking_score: rankingScore,
        ranking_config_id: rankingConfigId,
        status,
        notes: null,
      })
    }

    // Step 4: Upsert ranking results
    console.log(`[Job B] Upserting ${rankingResults.length} ranking results`)

    const batchSize = 100
    for (let i = 0; i < rankingResults.length; i += batchSize) {
      const batch = rankingResults.slice(i, i + batchSize)

      const { error: upsertError } = await supabase
        .from('ranking_weekly_result')
        .upsert(batch, {
          onConflict: 'warehouse_code,staff_id,year_week',
          ignoreDuplicates: false,
        })

      if (upsertError) {
        errors.push(`Batch ${Math.floor(i / batchSize) + 1} failed: ${upsertError.message}`)
        console.error(`[Job B] Batch error:`, upsertError)
      } else {
        processed += batch.length
      }
    }

    console.log(`[Job B] Completed. Processed: ${processed}, Errors: ${errors.length}`)

    return {
      success: errors.length === 0,
      processed,
      errors,
      yearWeek,
      warehouseCode: options.warehouseCode,
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[Job B] Fatal error:`, error)
    return {
      success: false,
      processed,
      errors: [errorMessage],
      yearWeek,
      warehouseCode: options.warehouseCode,
    }
  }
}
