// Demo Data Routes for testing UI without actual database
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCurrentWeek, getPreviousWeek, getPayrollPeriod } from '../lib/utils'

const demo = new Hono()

demo.use('*', cors())

// Sample warehouses data
const SAMPLE_WAREHOUSES = [
  { code: 'BMVN_HCM_TP', name: 'Boxme Tân Tạo', country: 'VN', currency: 'VND' },
  { code: 'BMVN_HCM_TT', name: 'Boxme Lê Minh Xuân', country: 'VN', currency: 'VND' },
  { code: 'BMVN_HN_LB', name: 'Boxme Long Biên', country: 'VN', currency: 'VND' },
]

// Sample employees data
const SAMPLE_EMPLOYEES = [
  { staff_id: 'NV001', staff_name: 'Nguyễn Văn An', role: 'Packer', warehouse: 'BMVN_HCM_TP' },
  { staff_id: 'NV002', staff_name: 'Trần Thị Bình', role: 'Picker', warehouse: 'BMVN_HCM_TP' },
  { staff_id: 'NV003', staff_name: 'Lê Văn Cường', role: 'Packer', warehouse: 'BMVN_HCM_TP' },
  { staff_id: 'NV004', staff_name: 'Phạm Thị Dung', role: 'Inspector', warehouse: 'BMVN_HCM_TP' },
  { staff_id: 'NV005', staff_name: 'Hoàng Văn Em', role: 'Handover Staff', warehouse: 'BMVN_HCM_TP' },
  { staff_id: 'NV006', staff_name: 'Võ Thị Phụng', role: 'Packer', warehouse: 'BMVN_HCM_TT' },
  { staff_id: 'NV007', staff_name: 'Đỗ Văn Giang', role: 'Picker', warehouse: 'BMVN_HCM_TT' },
  { staff_id: 'NV008', staff_name: 'Ngô Thị Hoa', role: 'Data Entry', warehouse: 'BMVN_HN_LB' },
]

// Helper functions to generate random data
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

// Generate weekly KPI data for an employee
function generateWeeklyKPI(staffId: string, yearWeek: string, warehouseCode: string) {
  const employee = SAMPLE_EMPLOYEES.find(e => e.staff_id === staffId) || {
    staff_id: staffId,
    staff_name: `Employee ${staffId}`,
    role: 'Packer',
    warehouse: warehouseCode
  }
  
  const mainTask = employee.role === 'Packer' ? 'packing' : 
                   employee.role === 'Picker' ? 'picking' : 
                   employee.role === 'Inspector' ? 'inspection' :
                   employee.role === 'Data Entry' ? 'data_entry' : 'packing'
  
  const workHours = randomFloat(32, 48, 1)
  const workDays = randomInt(5, 6)
  const mainTaskPoints = randomFloat(1200, 2200, 0)
  const pph = mainTaskPoints / workHours

  // Generate task breakdown
  const taskBreakdown: Record<string, { points: number, quantity: number }> = {
    [mainTask]: { points: mainTaskPoints, quantity: randomInt(200, 400) }
  }
  
  // Add some secondary tasks
  const secondaryTasks = ['packing', 'picking', 'handover', 'inspection'].filter(t => t !== mainTask)
  const numSecondary = randomInt(0, 2)
  for (let i = 0; i < numSecondary; i++) {
    const task = secondaryTasks[i]
    taskBreakdown[task] = { points: randomFloat(50, 300, 0), quantity: randomInt(20, 60) }
  }

  const totalPoints = Object.values(taskBreakdown).reduce((sum, t) => sum + t.points, 0)

  return {
    id: randomInt(1, 10000),
    warehouse_code: warehouseCode || employee.warehouse,
    warehouse_name: SAMPLE_WAREHOUSES.find(w => w.code === warehouseCode)?.name || 'Boxme Warehouse',
    staff_id: staffId,
    staff_name: employee.staff_name,
    role: employee.role,
    year_week: yearWeek,
    week_start: `2026-01-${13 + randomInt(0, 4)}`,
    week_end: `2026-01-${17 + randomInt(0, 2)}`,
    payroll_period: '2026-01',
    main_task: mainTask,
    main_task_points: mainTaskPoints,
    main_task_quantity: randomInt(200, 400),
    task_points_detail: taskBreakdown,
    total_points: totalPoints,
    total_quantity: randomInt(300, 500),
    estimated_work_hours: workHours,
    working_days: workDays,
    pph: Math.round(pph * 100) / 100,
    data_status: 'OK',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

// Generate ranking data
function generateRankingData(weeklyData: ReturnType<typeof generateWeeklyKPI>) {
  const score = getRankingScore(weeklyData.pph)
  
  return {
    id: randomInt(1, 10000),
    warehouse_code: weeklyData.warehouse_code,
    staff_id: weeklyData.staff_id,
    staff_name: weeklyData.staff_name,
    year_week: weeklyData.year_week,
    week_start: weeklyData.week_start,
    week_end: weeklyData.week_end,
    pph: weeklyData.pph,
    main_task_points: weeklyData.main_task_points,
    estimated_work_hours: weeklyData.estimated_work_hours,
    ranking_score: score,
    ranking_config_id: score,
    status: 'FINAL',
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

// Generate ORS events
function generateORSEvents(staffId: string, warehouseCode: string, count: number = 3) {
  const orsCodes = [
    { code: 'PACK-001', name: 'Đóng gói thiếu vật liệu', points: 3 },
    { code: 'PACK-002', name: 'Không seal chất lỏng', points: 6 },
    { code: 'PACK-003', name: 'Sử dụng hộp cũ', points: 2 },
    { code: 'PICK-001', name: 'Lấy sai sản phẩm', points: 5 },
    { code: 'PICK-002', name: 'Báo thiếu hàng sai', points: 7 },
    { code: 'HAND-001', name: 'Bàn giao sai hãng VC', points: 6 },
    { code: 'INSP-001', name: 'Bỏ sót lỗi ngoại quan', points: 6 },
    { code: 'DATA-001', name: 'Nhập sai kích thước', points: 6 },
  ]
  
  const events = []
  for (let i = 0; i < count; i++) {
    const ors = orsCodes[randomInt(0, orsCodes.length - 1)]
    events.push({
      id: randomInt(1, 10000),
      warehouse_code: warehouseCode,
      staff_id: staffId,
      staff_name: SAMPLE_EMPLOYEES.find(e => e.staff_id === staffId)?.staff_name || `Employee ${staffId}`,
      event_date: `2026-01-${randomInt(1, 19).toString().padStart(2, '0')}`,
      event_time: `${randomInt(8, 17)}:${randomInt(0, 59).toString().padStart(2, '0')}:00`,
      ors_code: ors.code,
      ors_points: ors.points,
      description: `Vi phạm ${ors.name} tại khu vực kho`,
      evidence_urls: [],
      reported_by: 'QC Manager',
      reviewed_by: randomInt(0, 1) ? 'Supervisor' : null,
      reviewed_at: randomInt(0, 1) ? new Date().toISOString() : null,
      status: ['OPEN', 'CONFIRMED', 'REJECTED'][randomInt(0, 2)] as 'OPEN' | 'CONFIRMED' | 'REJECTED',
      ors_catalog: {
        name: ors.name,
        job_group: ors.code.split('-')[0].toLowerCase(),
        severity_level: ors.points <= 2 ? 'S1' : ors.points <= 5 ? 'S2' : 'S3'
      }
    })
  }
  return events
}

// Generate ORS monthly summary
function generateORSMonthlySummary(staffId: string, warehouseCode: string, events: any[]) {
  const confirmedEvents = events.filter(e => e.status === 'CONFIRMED')
  const totalPoints = confirmedEvents.reduce((sum, e) => sum + e.ors_points, 0)
  const milestone = getMilestoneLevel(totalPoints)
  
  return {
    id: randomInt(1, 10000),
    warehouse_code: warehouseCode,
    staff_id: staffId,
    staff_name: SAMPLE_EMPLOYEES.find(e => e.staff_id === staffId)?.staff_name || `Employee ${staffId}`,
    payroll_period: '2026-01',
    ors_points_total: totalPoints,
    event_count: confirmedEvents.length,
    events_detail: confirmedEvents.map(e => ({ code: e.ors_code, points: e.ors_points, date: e.event_date })),
    milestone_level: milestone,
    penalty_rate: getPenaltyRate(milestone),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

// Generate monthly KPI summary
function generateMonthlyKPISummary(staffId: string, warehouseCode: string) {
  const employee = SAMPLE_EMPLOYEES.find(e => e.staff_id === staffId)
  
  // Generate 4 weekly rankings
  const weeklyRankings = []
  let totalMajorKPI = 0
  let totalRankingScore = 0
  
  for (let w = 1; w <= 4; w++) {
    const points = randomFloat(1200, 2200, 0)
    const hours = randomFloat(32, 48, 1)
    const pph = points / hours
    const score = getRankingScore(pph)
    
    totalMajorKPI += points
    totalRankingScore += score
    
    weeklyRankings.push({
      week: `2026-W${w.toString().padStart(2, '0')}`,
      points,
      pph: Math.round(pph * 100) / 100,
      score
    })
  }
  
  const avgRankingScore = totalRankingScore / 4
  const finalRankingScore = Math.round(avgRankingScore)
  const ratingFactor = getRatingFactor(finalRankingScore)
  
  // Generate ORS data
  const orsPoints = randomInt(0, 35)
  const orsMilestone = getMilestoneLevel(orsPoints)
  const orsPenalty = getPenaltyRate(orsMilestone)
  
  // Calculate bonus
  const amountPerPoint = 1000 // VND
  const kpiBonusCalculated = totalMajorKPI * amountPerPoint * ratingFactor
  const kpiBonusFinal = kpiBonusCalculated * (1 - orsPenalty)
  
  return {
    id: randomInt(1, 10000),
    warehouse_code: warehouseCode || employee?.warehouse || 'BMVN_HCM_TP',
    warehouse_name: SAMPLE_WAREHOUSES.find(w => w.code === warehouseCode)?.name || 'Boxme Warehouse',
    staff_id: staffId,
    staff_name: employee?.staff_name || `Employee ${staffId}`,
    role: employee?.role || 'Packer',
    payroll_period: '2026-01',
    major_kpi: Math.round(totalMajorKPI),
    total_kpi_points: Math.round(totalMajorKPI * 1.1), // 10% from secondary tasks
    task_points_monthly: {
      packing: Math.round(totalMajorKPI * 0.85),
      picking: Math.round(totalMajorKPI * 0.1),
      handover: Math.round(totalMajorKPI * 0.05)
    },
    weekly_rankings: weeklyRankings,
    avg_ranking_score: Math.round(avgRankingScore * 100) / 100,
    final_ranking_score: finalRankingScore,
    rating_factor: ratingFactor,
    kpi_bonus_calculated: Math.round(kpiBonusCalculated),
    ors_points_total: orsPoints,
    ors_penalty_rate: orsPenalty,
    kpi_bonus_final: Math.round(kpiBonusFinal),
    actual_workdays: randomInt(20, 24),
    work_hours: randomFloat(160, 200, 1),
    status: 'CALCULATED',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

// Generate ranking history (12 weeks)
function generateRankingHistory(staffId: string, warehouseCode: string, weeks: number = 12) {
  const history = []
  const baseYear = 2026
  let weekNum = 3 // Current week
  
  for (let i = 0; i < weeks; i++) {
    const w = weekNum - i
    if (w <= 0) continue
    
    const yearWeek = `${baseYear}-W${w.toString().padStart(2, '0')}`
    const points = randomFloat(1200, 2200, 0)
    const hours = randomFloat(32, 48, 1)
    const pph = points / hours
    const score = getRankingScore(pph)
    
    history.push({
      id: randomInt(1, 10000),
      warehouse_code: warehouseCode || 'BMVN_HCM_TP',
      staff_id: staffId,
      staff_name: SAMPLE_EMPLOYEES.find(e => e.staff_id === staffId)?.staff_name || `Employee ${staffId}`,
      year_week: yearWeek,
      week_start: `2026-01-${(i * 7 + 1).toString().padStart(2, '0')}`,
      week_end: `2026-01-${(i * 7 + 7).toString().padStart(2, '0')}`,
      pph: Math.round(pph * 100) / 100,
      main_task_points: points,
      estimated_work_hours: hours,
      ranking_score: score,
      status: 'FINAL'
    })
  }
  
  return history
}

// ==================== DEMO APIs ====================

// Health check
demo.get('/health', (c) => {
  return c.json({ status: 'ok', mode: 'demo', timestamp: new Date().toISOString() })
})

// Get employee's weekly KPI
demo.get('/employee/:staffId/kpi/weekly', (c) => {
  const staffId = c.req.param('staffId')
  const yearWeek = c.req.query('yearWeek') || getCurrentWeek()
  const warehouseCode = c.req.query('warehouseCode') || 'BMVN_HCM_TP'
  
  const current = generateWeeklyKPI(staffId, yearWeek, warehouseCode)
  const ranking = generateRankingData(current)
  const prevWeek = getPreviousWeek(yearWeek)
  const previousData = generateWeeklyKPI(staffId, prevWeek, warehouseCode)
  
  return c.json({
    success: true,
    mode: 'demo',
    data: {
      current,
      ranking,
      previousWeek: {
        pph: previousData.pph,
        main_task_points: previousData.main_task_points,
        total_points: previousData.total_points
      },
      comparison: {
        pphChange: Math.round((current.pph - previousData.pph) * 100) / 100,
        pointsChange: Math.round(current.main_task_points - previousData.main_task_points)
      }
    }
  })
})

// Get employee's monthly KPI
demo.get('/employee/:staffId/kpi/monthly', (c) => {
  const staffId = c.req.param('staffId')
  const warehouseCode = c.req.query('warehouseCode') || 'BMVN_HCM_TP'
  
  return c.json({
    success: true,
    mode: 'demo',
    data: generateMonthlyKPISummary(staffId, warehouseCode)
  })
})

// Get employee's ORS
demo.get('/employee/:staffId/ors', (c) => {
  const staffId = c.req.param('staffId')
  const warehouseCode = c.req.query('warehouseCode') || 'BMVN_HCM_TP'
  
  const events = generateORSEvents(staffId, warehouseCode, randomInt(0, 5))
  const summary = generateORSMonthlySummary(staffId, warehouseCode, events)
  
  return c.json({
    success: true,
    mode: 'demo',
    data: { summary, events }
  })
})

// Get employee's ranking history
demo.get('/employee/:staffId/ranking/history', (c) => {
  const staffId = c.req.param('staffId')
  const limit = parseInt(c.req.query('limit') || '12')
  const warehouseCode = c.req.query('warehouseCode') || 'BMVN_HCM_TP'
  
  return c.json({
    success: true,
    mode: 'demo',
    data: generateRankingHistory(staffId, warehouseCode, limit)
  })
})

// Manager dashboard
demo.get('/manager/dashboard', (c) => {
  const warehouseCode = c.req.query('warehouseCode') || 'BMVN_HCM_TP'
  const yearWeek = c.req.query('yearWeek') || getCurrentWeek()
  
  const totalStaff = randomInt(40, 60)
  const avgPPH = randomFloat(35, 48, 2)
  const totalPoints = randomInt(80000, 120000)
  
  // Generate realistic ranking distribution
  const rankingDistribution = {
    5: randomInt(5, 10),  // Xuất sắc
    4: randomInt(10, 18), // Tốt
    3: randomInt(15, 25), // Đạt
    2: randomInt(5, 10),  // Cần cải thiện
    1: randomInt(2, 5)    // Chưa đạt
  }
  
  return c.json({
    success: true,
    mode: 'demo',
    data: {
      yearWeek,
      warehouseCode,
      totalStaff,
      avgPPH,
      totalPoints,
      rankingDistribution
    }
  })
})

// Manager team ranking
demo.get('/manager/ranking', (c) => {
  const warehouseCode = c.req.query('warehouseCode') || 'BMVN_HCM_TP'
  const yearWeek = c.req.query('yearWeek') || getCurrentWeek()
  const limit = parseInt(c.req.query('limit') || '50')
  
  // Generate team ranking data
  const teamData = []
  const warehouseEmployees = SAMPLE_EMPLOYEES.filter(e => e.warehouse === warehouseCode || !warehouseCode)
  
  for (const emp of warehouseEmployees) {
    const weeklyKPI = generateWeeklyKPI(emp.staff_id, yearWeek, emp.warehouse)
    const ranking = generateRankingData(weeklyKPI)
    teamData.push({
      ...ranking,
      kpi_weekly_summary: {
        main_task: weeklyKPI.main_task,
        total_points: weeklyKPI.total_points,
        task_points_detail: weeklyKPI.task_points_detail
      }
    })
  }
  
  // Add more random employees to fill up
  for (let i = teamData.length; i < Math.min(limit, 30); i++) {
    const fakeId = `EMP${String(i + 1).padStart(3, '0')}`
    const weeklyKPI = generateWeeklyKPI(fakeId, yearWeek, warehouseCode)
    const ranking = generateRankingData(weeklyKPI)
    teamData.push({
      ...ranking,
      kpi_weekly_summary: {
        main_task: weeklyKPI.main_task,
        total_points: weeklyKPI.total_points,
        task_points_detail: weeklyKPI.task_points_detail
      }
    })
  }
  
  // Sort by ranking score (desc) then PPH (desc)
  teamData.sort((a, b) => {
    if (b.ranking_score !== a.ranking_score) return b.ranking_score - a.ranking_score
    return b.pph - a.pph
  })
  
  return c.json({
    success: true,
    mode: 'demo',
    data: teamData.slice(0, limit),
    pagination: { limit, offset: 0, total: teamData.length }
  })
})

// ORS alerts
demo.get('/manager/ors/alerts', (c) => {
  const warehouseCode = c.req.query('warehouseCode') || 'BMVN_HCM_TP'
  
  // Generate staff with ORS warnings
  const alerts = []
  for (let i = 0; i < randomInt(3, 8); i++) {
    const staffId = `EMP${String(randomInt(1, 50)).padStart(3, '0')}`
    const points = randomInt(10, 45)
    alerts.push({
      id: randomInt(1, 10000),
      warehouse_code: warehouseCode,
      staff_id: staffId,
      staff_name: `Nhân viên ${staffId}`,
      payroll_period: '2026-01',
      ors_points_total: points,
      event_count: randomInt(2, 8),
      milestone_level: getMilestoneLevel(points),
      penalty_rate: getPenaltyRate(getMilestoneLevel(points))
    })
  }
  
  // Sort by points desc
  alerts.sort((a, b) => b.ors_points_total - a.ors_points_total)
  
  return c.json({
    success: true,
    mode: 'demo',
    data: alerts
  })
})

// Pending ORS events
demo.get('/manager/ors/pending', (c) => {
  const warehouseCode = c.req.query('warehouseCode') || 'BMVN_HCM_TP'
  
  const events = []
  for (let i = 0; i < randomInt(5, 15); i++) {
    const staffId = `EMP${String(randomInt(1, 50)).padStart(3, '0')}`
    const newEvents = generateORSEvents(staffId, warehouseCode, 1).filter(e => e.status === 'OPEN')
    events.push(...newEvents)
  }
  
  return c.json({
    success: true,
    mode: 'demo',
    data: events
  })
})

// ORS Catalog
demo.get('/admin/ors-catalog', (c) => {
  const catalog = [
    { id: 1, ors_code: 'PACK-001', job_group: 'packing', name: 'Đóng gói thiếu/sai vật liệu chèn lót', description: 'Không sử dụng đủ giấy chèn/xốp nổ cho hàng dễ vỡ hoặc hàng điện tử', severity_level: 'S2', ors_points: 3, is_active: true },
    { id: 2, ors_code: 'PACK-002', job_group: 'packing', name: 'Không seal chất lỏng/mỹ phẩm', description: 'Không chèn/quấn vòi, nắp chai lọ mỹ phẩm, chất lỏng dẫn đến rò rỉ', severity_level: 'S3', ors_points: 6, is_active: true },
    { id: 3, ors_code: 'PACK-003', job_group: 'packing', name: 'Sử dụng hộp cũ/hư hỏng', description: 'Sử dụng hộp đã qua sử dụng, móp méo, không có logo theo quy định', severity_level: 'S1', ors_points: 2, is_active: true },
    { id: 4, ors_code: 'PACK-004', job_group: 'packing', name: 'Đóng gói sai hàng/thiếu hàng', description: 'Đóng gói không đúng sản phẩm hoặc số lượng so với đơn hàng', severity_level: 'S3', ors_points: 8, is_active: true },
    { id: 5, ors_code: 'PACK-005', job_group: 'packing', name: 'Trễ cam kết đóng gói (SLA)', description: 'Không hoàn thành đóng gói trong thời gian quy định', severity_level: 'S2', ors_points: 4, is_active: true },
    { id: 6, ors_code: 'PICK-001', job_group: 'picking', name: 'Lấy sai sản phẩm (Sai SKU)', description: 'Lấy nhầm sản phẩm do không kiểm tra kỹ Barcode/SKU', severity_level: 'S2', ors_points: 5, is_active: true },
    { id: 7, ors_code: 'PICK-002', job_group: 'picking', name: 'Báo cáo thiếu hàng sai (Hàng ảo)', description: 'Xác nhận thiếu hàng trên hệ thống nhưng thực tế hàng vẫn còn', severity_level: 'S3', ors_points: 7, is_active: true },
    { id: 8, ors_code: 'PICK-003', job_group: 'picking', name: 'Lấy hàng cận date/hết date sai chiến lược', description: 'Không tuân thủ FEFO (First Expired First Out)', severity_level: 'S3', ors_points: 6, is_active: true },
    { id: 9, ors_code: 'HAND-001', job_group: 'handover', name: 'Bàn giao sai hãng vận chuyển', description: 'Phân loại sai hãng vận chuyển, đưa nhầm hàng', severity_level: 'S3', ors_points: 6, is_active: true },
    { id: 10, ors_code: 'HAND-002', job_group: 'handover', name: 'Thiếu biên bản/chữ ký bàn giao (POD)', description: 'Bàn giao hàng nhưng không có biên bản hoặc chữ ký xác nhận', severity_level: 'S3', ors_points: 8, is_active: true },
    { id: 11, ors_code: 'HAND-003', job_group: 'handover', name: 'Bàn giao trễ (Miss cutoff time)', description: 'Không kịp bàn giao đơn hàng trong khung giờ quy định', severity_level: 'S2', ors_points: 5, is_active: true },
    { id: 12, ors_code: 'PUT-001', job_group: 'putaway', name: 'Để hàng trực tiếp dưới sàn', description: 'Vi phạm quy chuẩn lưu kho - đặt hàng hóa trực tiếp xuống sàn', severity_level: 'S3', ors_points: 7, is_active: true },
    { id: 13, ors_code: 'PUT-002', job_group: 'putaway', name: 'Lưu kho chung lô hạn sử dụng khác nhau', description: 'Để lẫn lộn các hàng hóa có Date khác nhau vào cùng vị trí', severity_level: 'S2', ors_points: 4, is_active: true },
    { id: 14, ors_code: 'INSP-001', job_group: 'inspection', name: 'Bỏ sót lỗi ngoại quan (QC sai)', description: 'Nhập kho hàng móp méo, hư hỏng, ẩm ướt nhưng không phát hiện', severity_level: 'S3', ors_points: 6, is_active: true },
    { id: 15, ors_code: 'DATA-001', job_group: 'data_entry', name: 'Nhập sai kích thước/trọng lượng', description: 'Nhập liệu sai cân nặng, kích thước (DIM)', severity_level: 'S3', ors_points: 6, is_active: true },
  ]
  
  return c.json({
    success: true,
    mode: 'demo',
    data: catalog
  })
})

// Ranking config
demo.get('/admin/ranking-config', (c) => {
  const config = [
    { id: 1, warehouse_code: null, role: null, main_task: null, pph_min: 50, pph_max: 999999.99, ranking_score: 5, min_weekly_hours: 20, is_active: true },
    { id: 2, warehouse_code: null, role: null, main_task: null, pph_min: 40, pph_max: 49.99, ranking_score: 4, min_weekly_hours: 20, is_active: true },
    { id: 3, warehouse_code: null, role: null, main_task: null, pph_min: 30, pph_max: 39.99, ranking_score: 3, min_weekly_hours: 20, is_active: true },
    { id: 4, warehouse_code: null, role: null, main_task: null, pph_min: 20, pph_max: 29.99, ranking_score: 2, min_weekly_hours: 20, is_active: true },
    { id: 5, warehouse_code: null, role: null, main_task: null, pph_min: 0, pph_max: 19.99, ranking_score: 1, min_weekly_hours: 20, is_active: true },
  ]
  
  return c.json({
    success: true,
    mode: 'demo',
    data: config
  })
})

// Role task config
demo.get('/admin/role-task-config', (c) => {
  const config = [
    { id: 1, warehouse_code: null, role: 'Packer', role_id: null, main_task: 'packing', is_active: true },
    { id: 2, warehouse_code: null, role: 'Picker', role_id: null, main_task: 'picking', is_active: true },
    { id: 3, warehouse_code: null, role: 'Inspector', role_id: null, main_task: 'inspection', is_active: true },
    { id: 4, warehouse_code: null, role: 'Data Entry', role_id: null, main_task: 'data_entry', is_active: true },
    { id: 5, warehouse_code: null, role: 'Handover Staff', role_id: null, main_task: 'handover', is_active: true },
    { id: 6, warehouse_code: null, role: 'Putaway Staff', role_id: null, main_task: 'putaway', is_active: true },
    { id: 7, warehouse_code: null, role: 'Unloader', role_id: null, main_task: 'unloading', is_active: true },
    { id: 8, warehouse_code: null, role: 'Mover', role_id: null, main_task: 'move', is_active: true },
  ]
  
  return c.json({
    success: true,
    mode: 'demo',
    data: config
  })
})

// Bonus config
demo.get('/admin/bonus-config', (c) => {
  const config = [
    { id: 1, warehouse_code: null, country: 'VN', ranking_score_min: 1, ranking_score_max: 5, calculation_type: 'PER_POINT', amount_per_point: 1000, currency: 'VND', is_active: true },
    { id: 2, warehouse_code: null, country: 'TH', ranking_score_min: 1, ranking_score_max: 5, calculation_type: 'PER_POINT', amount_per_point: 5, currency: 'THB', is_active: true },
    { id: 3, warehouse_code: null, country: 'PH', ranking_score_min: 1, ranking_score_max: 5, calculation_type: 'PER_POINT', amount_per_point: 10, currency: 'PHP', is_active: true },
    { id: 4, warehouse_code: null, country: 'ID', ranking_score_min: 1, ranking_score_max: 5, calculation_type: 'PER_POINT', amount_per_point: 500, currency: 'IDR', is_active: true },
    { id: 5, warehouse_code: null, country: 'MY', ranking_score_min: 1, ranking_score_max: 5, calculation_type: 'PER_POINT', amount_per_point: 0.5, currency: 'MYR', is_active: true },
  ]
  
  return c.json({
    success: true,
    mode: 'demo',
    data: config
  })
})

// Payroll bridge data
demo.get('/payroll/bridge', (c) => {
  const warehouseCode = c.req.query('warehouseCode') || 'BMVN_HCM_TP'
  const payrollPeriod = c.req.query('payrollPeriod') || '2026-01'
  
  const bridgeData = []
  for (let i = 0; i < 30; i++) {
    const staffId = i < SAMPLE_EMPLOYEES.length ? SAMPLE_EMPLOYEES[i].staff_id : `EMP${String(i + 1).padStart(3, '0')}`
    const monthly = generateMonthlyKPISummary(staffId, warehouseCode)
    
    bridgeData.push({
      id: randomInt(1, 10000),
      warehouse_code: warehouseCode,
      payroll_period: payrollPeriod,
      staff_id: staffId,
      major_kpi: monthly.major_kpi,
      rating_factor: monthly.rating_factor,
      kpi_bonus: monthly.kpi_bonus_final,
      work_hour_kpi_bonus: null,
      vas_kpi_bonus: null,
      kpi_allowance: null,
      penalty: monthly.ors_penalty_rate > 0 ? monthly.kpi_bonus_calculated - monthly.kpi_bonus_final : 0,
      calculation_version: 'v2.0',
      calculated_at: new Date().toISOString(),
      applied_to_payroll: randomInt(0, 1) === 1,
      applied_at: randomInt(0, 1) === 1 ? new Date().toISOString() : null
    })
  }
  
  return c.json({
    success: true,
    mode: 'demo',
    data: bridgeData
  })
})

// Dummy endpoints for job execution (just return success)
demo.post('/jobs/run-a', (c) => c.json({ success: true, mode: 'demo', message: 'Job A executed in demo mode', processed: randomInt(40, 60) }))
demo.post('/jobs/run-b', (c) => c.json({ success: true, mode: 'demo', message: 'Job B executed in demo mode', processed: randomInt(40, 60) }))
demo.post('/jobs/run-c', (c) => c.json({ success: true, mode: 'demo', message: 'Job C executed in demo mode', processed: randomInt(40, 60) }))
demo.post('/jobs/run-d', (c) => c.json({ success: true, mode: 'demo', message: 'Job D executed in demo mode', processed: randomInt(40, 60) }))
demo.post('/jobs/run-pipeline', (c) => c.json({ success: true, mode: 'demo', message: 'Full pipeline executed in demo mode' }))

// Dummy POST endpoints
demo.post('/manager/ors/create', async (c) => {
  const body = await c.req.json()
  return c.json({ success: true, mode: 'demo', data: { ...body, id: randomInt(1, 10000), status: 'OPEN' } })
})

demo.post('/manager/ors/:eventId/review', async (c) => {
  const body = await c.req.json()
  return c.json({ success: true, mode: 'demo', data: { id: c.req.param('eventId'), ...body } })
})

demo.post('/payroll/apply', async (c) => {
  return c.json({ success: true, mode: 'demo', message: 'Payroll applied in demo mode', updated: randomInt(20, 40) })
})

export default demo
