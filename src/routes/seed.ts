// Seed Data Generator for KPI Warehouse System
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createSupabaseClient } from '../lib/supabase'

const seed = new Hono()
seed.use('*', cors())

// Sample warehouses
const WAREHOUSES = [
  { code: 'BMVN_HCM_TP', name: 'Boxme Tân Tạo', country: 'VN', currency: 'VND' },
  { code: 'BMVN_HCM_TT', name: 'Boxme Lê Minh Xuân', country: 'VN', currency: 'VND' },
  { code: 'BMVN_HN_LB', name: 'Boxme Long Biên', country: 'VN', currency: 'VND' },
]

// Sample employees per warehouse
const EMPLOYEES_PER_WAREHOUSE = [
  // BMVN_HCM_TP - 15 employees
  { staff_id: 'NV001', staff_name: 'Nguyễn Văn An', role: 'Packer', warehouse: 'BMVN_HCM_TP' },
  { staff_id: 'NV002', staff_name: 'Trần Thị Bình', role: 'Picker', warehouse: 'BMVN_HCM_TP' },
  { staff_id: 'NV003', staff_name: 'Lê Văn Cường', role: 'Packer', warehouse: 'BMVN_HCM_TP' },
  { staff_id: 'NV004', staff_name: 'Phạm Thị Dung', role: 'Inspector', warehouse: 'BMVN_HCM_TP' },
  { staff_id: 'NV005', staff_name: 'Hoàng Văn Em', role: 'Handover Staff', warehouse: 'BMVN_HCM_TP' },
  { staff_id: 'NV006', staff_name: 'Võ Thị Phụng', role: 'Packer', warehouse: 'BMVN_HCM_TP' },
  { staff_id: 'NV007', staff_name: 'Đỗ Văn Giang', role: 'Picker', warehouse: 'BMVN_HCM_TP' },
  { staff_id: 'NV008', staff_name: 'Ngô Thị Hoa', role: 'Data Entry', warehouse: 'BMVN_HCM_TP' },
  { staff_id: 'NV009', staff_name: 'Bùi Văn Inh', role: 'Putaway Staff', warehouse: 'BMVN_HCM_TP' },
  { staff_id: 'NV010', staff_name: 'Đặng Thị Kim', role: 'Packer', warehouse: 'BMVN_HCM_TP' },
  { staff_id: 'NV011', staff_name: 'Lý Văn Long', role: 'Picker', warehouse: 'BMVN_HCM_TP' },
  { staff_id: 'NV012', staff_name: 'Mai Thị Ngọc', role: 'Inspector', warehouse: 'BMVN_HCM_TP' },
  { staff_id: 'NV013', staff_name: 'Phan Văn Oanh', role: 'Packer', warehouse: 'BMVN_HCM_TP' },
  { staff_id: 'NV014', staff_name: 'Trịnh Thị Phương', role: 'Handover Staff', warehouse: 'BMVN_HCM_TP' },
  { staff_id: 'NV015', staff_name: 'Vũ Văn Quang', role: 'Picker', warehouse: 'BMVN_HCM_TP' },
  
  // BMVN_HCM_TT - 10 employees
  { staff_id: 'NV101', staff_name: 'Nguyễn Văn Rồng', role: 'Packer', warehouse: 'BMVN_HCM_TT' },
  { staff_id: 'NV102', staff_name: 'Trần Thị Sen', role: 'Picker', warehouse: 'BMVN_HCM_TT' },
  { staff_id: 'NV103', staff_name: 'Lê Văn Tùng', role: 'Packer', warehouse: 'BMVN_HCM_TT' },
  { staff_id: 'NV104', staff_name: 'Phạm Thị Uyên', role: 'Inspector', warehouse: 'BMVN_HCM_TT' },
  { staff_id: 'NV105', staff_name: 'Hoàng Văn Vinh', role: 'Packer', warehouse: 'BMVN_HCM_TT' },
  { staff_id: 'NV106', staff_name: 'Võ Thị Xuân', role: 'Picker', warehouse: 'BMVN_HCM_TT' },
  { staff_id: 'NV107', staff_name: 'Đỗ Văn Yên', role: 'Data Entry', warehouse: 'BMVN_HCM_TT' },
  { staff_id: 'NV108', staff_name: 'Ngô Thị Zara', role: 'Packer', warehouse: 'BMVN_HCM_TT' },
  { staff_id: 'NV109', staff_name: 'Bùi Văn Anh', role: 'Handover Staff', warehouse: 'BMVN_HCM_TT' },
  { staff_id: 'NV110', staff_name: 'Đặng Thị Bảo', role: 'Picker', warehouse: 'BMVN_HCM_TT' },
  
  // BMVN_HN_LB - 8 employees
  { staff_id: 'NV201', staff_name: 'Lý Văn Cao', role: 'Packer', warehouse: 'BMVN_HN_LB' },
  { staff_id: 'NV202', staff_name: 'Mai Thị Diệu', role: 'Picker', warehouse: 'BMVN_HN_LB' },
  { staff_id: 'NV203', staff_name: 'Phan Văn Gia', role: 'Packer', warehouse: 'BMVN_HN_LB' },
  { staff_id: 'NV204', staff_name: 'Trịnh Thị Hằng', role: 'Inspector', warehouse: 'BMVN_HN_LB' },
  { staff_id: 'NV205', staff_name: 'Vũ Văn Khoa', role: 'Packer', warehouse: 'BMVN_HN_LB' },
  { staff_id: 'NV206', staff_name: 'Nguyễn Thị Lan', role: 'Picker', warehouse: 'BMVN_HN_LB' },
  { staff_id: 'NV207', staff_name: 'Trần Văn Minh', role: 'Data Entry', warehouse: 'BMVN_HN_LB' },
  { staff_id: 'NV208', staff_name: 'Lê Thị Nhung', role: 'Handover Staff', warehouse: 'BMVN_HN_LB' },
]

// ORS codes for generating events
const ORS_CODES = [
  { code: 'PACK-001', points: 3 },
  { code: 'PACK-002', points: 6 },
  { code: 'PACK-003', points: 2 },
  { code: 'PACK-004', points: 8 },
  { code: 'PICK-001', points: 5 },
  { code: 'PICK-002', points: 7 },
  { code: 'HAND-001', points: 6 },
  { code: 'INSP-001', points: 6 },
  { code: 'DATA-001', points: 6 },
]

// Helper functions
function randomFloat(min: number, max: number, decimals: number = 2): number {
  return Math.round((Math.random() * (max - min) + min) * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getRankingScore(pph: number): number {
  if (pph >= 50) return 5
  if (pph >= 40) return 4
  if (pph >= 30) return 3
  if (pph >= 20) return 2
  return 1
}

function getRatingFactor(score: number): number {
  const factors: Record<number, number> = { 5: 1.00, 4: 0.95, 3: 0.85, 2: 0.70, 1: 0.50 }
  return factors[score] || 0.85
}

function getMilestoneLevel(points: number): string {
  if (points >= 40) return 'CRITICAL'
  if (points >= 30) return 'RED'
  if (points >= 20) return 'ORANGE'
  if (points >= 10) return 'YELLOW'
  return 'GREEN'
}

function getPenaltyRate(milestone: string): number {
  const rates: Record<string, number> = { GREEN: 0, YELLOW: 0, ORANGE: 0.10, RED: 0.30, CRITICAL: 1.0 }
  return rates[milestone] || 0
}

function getMainTaskFromRole(role: string): string {
  const mapping: Record<string, string> = {
    'Packer': 'packing',
    'Picker': 'picking',
    'Inspector': 'inspection',
    'Data Entry': 'data_entry',
    'Handover Staff': 'handover',
    'Putaway Staff': 'putaway',
  }
  return mapping[role] || 'packing'
}

function getWeekDates(yearWeek: string): { start: string, end: string } {
  const [year, week] = yearWeek.replace('W', '').split('-').map(Number)
  const jan4 = new Date(year, 0, 4)
  const dayOfWeek = jan4.getDay() || 7
  const weekStart = new Date(jan4)
  weekStart.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  
  return {
    start: weekStart.toISOString().split('T')[0],
    end: weekEnd.toISOString().split('T')[0]
  }
}

// Generate seed data
seed.post('/generate', async (c) => {
  const supabase = createSupabaseClient()
  const results: Record<string, any> = {}
  
  try {
    // Get parameters
    const body = await c.req.json().catch(() => ({}))
    const payrollPeriod = body.payrollPeriod || '2026-01'
    const weeksToGenerate = body.weeks || 4 // Generate 4 weeks of data
    
    // Calculate year weeks for the month
    const [year, month] = payrollPeriod.split('-').map(Number)
    const yearWeeks: string[] = []
    
    // Get ISO weeks that fall in this month
    for (let day = 1; day <= 28; day += 7) {
      const date = new Date(year, month - 1, day)
      const weekNum = getISOWeek(date)
      const yw = `${year}-W${String(weekNum).padStart(2, '0')}`
      if (!yearWeeks.includes(yw)) {
        yearWeeks.push(yw)
      }
    }
    
    // Ensure we have exactly weeksToGenerate weeks
    while (yearWeeks.length < weeksToGenerate) {
      const lastWeek = yearWeeks[yearWeeks.length - 1]
      const [y, w] = lastWeek.replace('W', '').split('-').map(Number)
      yearWeeks.push(`${y}-W${String(w + 1).padStart(2, '0')}`)
    }
    yearWeeks.splice(weeksToGenerate)
    
    console.log('Generating data for weeks:', yearWeeks)
    results.yearWeeks = yearWeeks
    
    // 1. Generate KPI Weekly Summary for each employee, each week
    const kpiWeeklySummaries: any[] = []
    const rankingWeeklyResults: any[] = []
    
    for (const employee of EMPLOYEES_PER_WAREHOUSE) {
      const mainTask = getMainTaskFromRole(employee.role)
      const warehouse = WAREHOUSES.find(w => w.code === employee.warehouse)!
      
      for (const yearWeek of yearWeeks) {
        const weekDates = getWeekDates(yearWeek)
        
        // Generate realistic data with some variation
        const workHours = randomFloat(32, 48, 1)
        const workDays = randomInt(5, 6)
        
        // Performance varies by "skill level" - use staff_id to create consistent performance
        const basePerformance = (parseInt(employee.staff_id.replace(/\D/g, '')) % 30) + 30 // 30-60 range
        const mainTaskPoints = Math.round(workHours * basePerformance * randomFloat(0.85, 1.15, 2))
        const pph = Math.round((mainTaskPoints / workHours) * 100) / 100
        
        // Task breakdown
        const taskPointsDetail: Record<string, { points: number, quantity: number }> = {
          [mainTask]: { points: mainTaskPoints, quantity: randomInt(150, 400) }
        }
        
        // Add some secondary tasks randomly
        if (Math.random() > 0.5) {
          const secondaryTasks = ['packing', 'picking', 'handover'].filter(t => t !== mainTask)
          const secondary = secondaryTasks[randomInt(0, secondaryTasks.length - 1)]
          taskPointsDetail[secondary] = { points: randomInt(50, 200), quantity: randomInt(20, 60) }
        }
        
        const totalPoints = Object.values(taskPointsDetail).reduce((sum, t) => sum + t.points, 0)
        
        kpiWeeklySummaries.push({
          warehouse_code: employee.warehouse,
          warehouse_name: warehouse.name,
          staff_id: employee.staff_id,
          staff_name: employee.staff_name,
          role: employee.role,
          year_week: yearWeek,
          week_start: weekDates.start,
          week_end: weekDates.end,
          payroll_period: payrollPeriod,
          main_task: mainTask,
          main_task_points: mainTaskPoints,
          main_task_quantity: taskPointsDetail[mainTask].quantity,
          task_points_detail: taskPointsDetail,
          total_points: totalPoints,
          total_quantity: Object.values(taskPointsDetail).reduce((sum, t) => sum + t.quantity, 0),
          estimated_work_hours: workHours,
          working_days: workDays,
          pph: pph,
          data_status: workHours >= 20 ? 'OK' : 'INSUFFICIENT_HOURS',
        })
        
        // Generate ranking result
        const rankingScore = getRankingScore(pph)
        rankingWeeklyResults.push({
          warehouse_code: employee.warehouse,
          staff_id: employee.staff_id,
          staff_name: employee.staff_name,
          year_week: yearWeek,
          week_start: weekDates.start,
          week_end: weekDates.end,
          pph: pph,
          main_task_points: mainTaskPoints,
          estimated_work_hours: workHours,
          ranking_score: rankingScore,
          status: 'FINAL',
        })
      }
    }
    
    // Insert KPI Weekly Summaries
    console.log('Inserting', kpiWeeklySummaries.length, 'KPI weekly summaries...')
    const { data: weeklyData, error: weeklyError } = await supabase
      .from('kpi_weekly_summary')
      .upsert(kpiWeeklySummaries, { onConflict: 'warehouse_code,staff_id,year_week' })
      .select('id')
    
    if (weeklyError) {
      console.error('Weekly summary error:', weeklyError)
      results.kpi_weekly_summary = { error: weeklyError.message }
    } else {
      results.kpi_weekly_summary = { inserted: kpiWeeklySummaries.length }
    }
    
    // Insert Ranking Weekly Results
    console.log('Inserting', rankingWeeklyResults.length, 'ranking results...')
    const { data: rankingData, error: rankingError } = await supabase
      .from('ranking_weekly_result')
      .upsert(rankingWeeklyResults, { onConflict: 'warehouse_code,staff_id,year_week' })
      .select('id')
    
    if (rankingError) {
      console.error('Ranking error:', rankingError)
      results.ranking_weekly_result = { error: rankingError.message }
    } else {
      results.ranking_weekly_result = { inserted: rankingWeeklyResults.length }
    }
    
    // 2. Generate ORS Events (some employees have violations)
    const orsEvents: any[] = []
    const violatingEmployees = EMPLOYEES_PER_WAREHOUSE.filter(() => Math.random() > 0.6) // 40% have ORS
    
    for (const employee of violatingEmployees) {
      const numEvents = randomInt(1, 4) // 1-4 events per employee
      
      for (let i = 0; i < numEvents; i++) {
        const ors = ORS_CODES[randomInt(0, ORS_CODES.length - 1)]
        const eventDay = randomInt(1, 28)
        
        orsEvents.push({
          warehouse_code: employee.warehouse,
          staff_id: employee.staff_id,
          staff_name: employee.staff_name,
          event_date: `${payrollPeriod}-${String(eventDay).padStart(2, '0')}`,
          event_time: `${randomInt(8, 17)}:${String(randomInt(0, 59)).padStart(2, '0')}:00`,
          ors_code: ors.code,
          ors_points: ors.points,
          description: `Vi phạm ${ors.code} - phát hiện qua QC`,
          evidence_urls: [],
          reported_by: 'QC Manager',
          reviewed_by: Math.random() > 0.3 ? 'Supervisor' : null,
          reviewed_at: Math.random() > 0.3 ? new Date().toISOString() : null,
          status: Math.random() > 0.3 ? 'CONFIRMED' : 'OPEN',
        })
      }
    }
    
    console.log('Inserting', orsEvents.length, 'ORS events...')
    const { error: orsError } = await supabase
      .from('ors_event')
      .insert(orsEvents)
    
    if (orsError) {
      console.error('ORS error:', orsError)
      results.ors_event = { error: orsError.message }
    } else {
      results.ors_event = { inserted: orsEvents.length }
    }
    
    // 3. Generate ORS Monthly Summary
    const orsMonthlySummaries: any[] = []
    
    // Group ORS events by employee
    const orsGrouped: Record<string, any[]> = {}
    for (const event of orsEvents.filter(e => e.status === 'CONFIRMED')) {
      const key = `${event.warehouse_code}-${event.staff_id}`
      if (!orsGrouped[key]) orsGrouped[key] = []
      orsGrouped[key].push(event)
    }
    
    for (const employee of EMPLOYEES_PER_WAREHOUSE) {
      const key = `${employee.warehouse}-${employee.staff_id}`
      const events = orsGrouped[key] || []
      const totalPoints = events.reduce((sum, e) => sum + e.ors_points, 0)
      const milestone = getMilestoneLevel(totalPoints)
      
      orsMonthlySummaries.push({
        warehouse_code: employee.warehouse,
        staff_id: employee.staff_id,
        staff_name: employee.staff_name,
        payroll_period: payrollPeriod,
        ors_points_total: totalPoints,
        event_count: events.length,
        events_detail: events.map(e => ({ code: e.ors_code, points: e.ors_points, date: e.event_date })),
        milestone_level: milestone,
        penalty_rate: getPenaltyRate(milestone),
      })
    }
    
    console.log('Inserting', orsMonthlySummaries.length, 'ORS monthly summaries...')
    const { error: orsMonthlyError } = await supabase
      .from('ors_monthly_summary')
      .upsert(orsMonthlySummaries, { onConflict: 'warehouse_code,staff_id,payroll_period' })
    
    if (orsMonthlyError) {
      console.error('ORS monthly error:', orsMonthlyError)
      results.ors_monthly_summary = { error: orsMonthlyError.message }
    } else {
      results.ors_monthly_summary = { inserted: orsMonthlySummaries.length }
    }
    
    // 4. Generate KPI Monthly Summary
    const kpiMonthlySummaries: any[] = []
    const payrollBridgeData: any[] = []
    
    // Group weekly data by employee
    const weeklyGrouped: Record<string, any[]> = {}
    for (const weekly of kpiWeeklySummaries) {
      const key = `${weekly.warehouse_code}-${weekly.staff_id}`
      if (!weeklyGrouped[key]) weeklyGrouped[key] = []
      weeklyGrouped[key].push(weekly)
    }
    
    for (const employee of EMPLOYEES_PER_WAREHOUSE) {
      const key = `${employee.warehouse}-${employee.staff_id}`
      const weeklies = weeklyGrouped[key] || []
      const orsSummary = orsMonthlySummaries.find(o => o.warehouse_code === employee.warehouse && o.staff_id === employee.staff_id)
      const warehouse = WAREHOUSES.find(w => w.code === employee.warehouse)!
      
      if (weeklies.length === 0) continue
      
      // Calculate monthly aggregates
      const majorKpi = weeklies.reduce((sum, w) => sum + w.main_task_points, 0)
      const totalKpiPoints = weeklies.reduce((sum, w) => sum + w.total_points, 0)
      const totalWorkHours = weeklies.reduce((sum, w) => sum + w.estimated_work_hours, 0)
      const workDays = weeklies.reduce((sum, w) => sum + w.working_days, 0)
      
      // Weekly rankings
      const weeklyRankings = weeklies.map(w => ({
        week: w.year_week,
        points: w.main_task_points,
        pph: w.pph,
        score: getRankingScore(w.pph)
      }))
      
      const avgRankingScore = weeklyRankings.reduce((sum, r) => sum + r.score, 0) / weeklyRankings.length
      const finalRankingScore = Math.round(avgRankingScore)
      const ratingFactor = getRatingFactor(finalRankingScore)
      
      // Task points monthly
      const taskPointsMonthly: Record<string, number> = {}
      for (const w of weeklies) {
        for (const [task, detail] of Object.entries(w.task_points_detail as Record<string, { points: number }>)) {
          taskPointsMonthly[task] = (taskPointsMonthly[task] || 0) + detail.points
        }
      }
      
      // ORS data
      const orsPointsTotal = orsSummary?.ors_points_total || 0
      const orsPenaltyRate = orsSummary?.penalty_rate || 0
      
      // Calculate bonus (1000 VND per point for VN)
      const amountPerPoint = 1000
      const kpiBonusCalculated = Math.round(majorKpi * amountPerPoint * ratingFactor)
      const kpiBonusFinal = Math.round(kpiBonusCalculated * (1 - orsPenaltyRate))
      
      kpiMonthlySummaries.push({
        warehouse_code: employee.warehouse,
        warehouse_name: warehouse.name,
        staff_id: employee.staff_id,
        staff_name: employee.staff_name,
        role: employee.role,
        payroll_period: payrollPeriod,
        major_kpi: majorKpi,
        total_kpi_points: totalKpiPoints,
        task_points_monthly: taskPointsMonthly,
        weekly_rankings: weeklyRankings,
        avg_ranking_score: Math.round(avgRankingScore * 100) / 100,
        final_ranking_score: finalRankingScore,
        rating_factor: ratingFactor,
        kpi_bonus_calculated: kpiBonusCalculated,
        ors_points_total: orsPointsTotal,
        ors_penalty_rate: orsPenaltyRate,
        kpi_bonus_final: kpiBonusFinal,
        actual_workdays: workDays,
        work_hours: totalWorkHours,
        status: 'CALCULATED',
      })
      
      // Payroll bridge
      payrollBridgeData.push({
        warehouse_code: employee.warehouse,
        payroll_period: payrollPeriod,
        staff_id: employee.staff_id,
        major_kpi: majorKpi,
        rating_factor: ratingFactor,
        kpi_bonus: kpiBonusFinal,
        penalty: kpiBonusCalculated - kpiBonusFinal,
        calculation_version: 'v2.0',
        calculated_at: new Date().toISOString(),
        applied_to_payroll: false,
      })
    }
    
    console.log('Inserting', kpiMonthlySummaries.length, 'KPI monthly summaries...')
    const { error: monthlyError } = await supabase
      .from('kpi_monthly_summary')
      .upsert(kpiMonthlySummaries, { onConflict: 'warehouse_code,staff_id,payroll_period' })
    
    if (monthlyError) {
      console.error('Monthly error:', monthlyError)
      results.kpi_monthly_summary = { error: monthlyError.message }
    } else {
      results.kpi_monthly_summary = { inserted: kpiMonthlySummaries.length }
    }
    
    console.log('Inserting', payrollBridgeData.length, 'payroll bridge records...')
    const { error: bridgeError } = await supabase
      .from('payroll_kpi_bridge')
      .upsert(payrollBridgeData, { onConflict: 'warehouse_code,payroll_period,staff_id' })
    
    if (bridgeError) {
      console.error('Bridge error:', bridgeError)
      results.payroll_kpi_bridge = { error: bridgeError.message }
    } else {
      results.payroll_kpi_bridge = { inserted: payrollBridgeData.length }
    }
    
    return c.json({
      success: true,
      message: 'Sample data generated successfully',
      payrollPeriod,
      employees: EMPLOYEES_PER_WAREHOUSE.length,
      warehouses: WAREHOUSES.length,
      results,
    })
    
  } catch (error: any) {
    console.error('Seed error:', error)
    return c.json({
      success: false,
      error: error.message,
      results,
    }, 500)
  }
})

// Clear all generated data
seed.post('/clear', async (c) => {
  const supabase = createSupabaseClient()
  const results: Record<string, any> = {}
  
  try {
    // Clear in reverse dependency order
    const tables = [
      'payroll_kpi_bridge',
      'kpi_monthly_summary',
      'ors_monthly_summary',
      'ors_event',
      'ranking_weekly_result',
      'kpi_weekly_summary',
    ]
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', 0) // Delete all
      
      if (error) {
        results[table] = { error: error.message }
      } else {
        results[table] = { cleared: true }
      }
    }
    
    return c.json({
      success: true,
      message: 'All generated data cleared',
      results,
    })
    
  } catch (error: any) {
    return c.json({
      success: false,
      error: error.message,
      results,
    }, 500)
  }
})

// Get current data stats
seed.get('/stats', async (c) => {
  const supabase = createSupabaseClient()
  const stats: Record<string, any> = {}
  
  const tables = [
    'kpi_weekly_summary',
    'ranking_weekly_result',
    'ors_event',
    'ors_monthly_summary',
    'kpi_monthly_summary',
    'payroll_kpi_bridge',
  ]
  
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
    
    stats[table] = error ? { error: error.message } : { count }
  }
  
  return c.json({ success: true, stats })
})

// Preview data from a table
seed.get('/preview', async (c) => {
  const supabase = createSupabaseClient()
  const table = c.req.query('table') || 'kpi_weekly_summary'
  const limit = parseInt(c.req.query('limit') || '10')
  
  const validTables = [
    'kpi_weekly_summary',
    'ranking_weekly_result',
    'ors_event',
    'ors_monthly_summary',
    'kpi_monthly_summary',
    'payroll_kpi_bridge',
  ]
  
  if (!validTables.includes(table)) {
    return c.json({ success: false, error: 'Invalid table name' }, 400)
  }
  
  try {
    // Get count
    const { count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
    
    // Get data (limited columns for readability)
    let query = supabase.from(table).select('*').limit(limit).order('id', { ascending: false })
    
    const { data, error } = await query
    
    if (error) {
      return c.json({ success: false, error: error.message }, 400)
    }
    
    return c.json({ success: true, table, total: count, data })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Reset all sample data (alias for clear)
seed.post('/reset', async (c) => {
  const supabase = createSupabaseClient()
  const results: Record<string, any> = {}
  
  try {
    // Clear in reverse dependency order
    const tables = [
      'payroll_kpi_bridge',
      'kpi_monthly_summary',
      'ors_monthly_summary',
      'ors_event',
      'ranking_weekly_result',
      'kpi_weekly_summary',
    ]
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', 0) // Delete all
      
      if (error) {
        results[table] = { error: error.message }
      } else {
        results[table] = { cleared: true }
      }
    }
    
    return c.json({
      success: true,
      message: 'All sample data has been reset',
      results,
    })
    
  } catch (error: any) {
    return c.json({
      success: false,
      error: error.message,
      results,
    }, 500)
  }
})

// Helper function to get ISO week number
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

export default seed
