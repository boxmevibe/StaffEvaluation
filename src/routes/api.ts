// API Routes for Perfomance Management System
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createSupabaseClient } from '../lib/supabase'
import { runJobA, runJobB, runJobC, runJobD, runPipeline, runMonthlyPipeline } from '../jobs'
import {
  getCurrentWeek,
  getPreviousWeek,
  getPayrollPeriod,
  formatDate,
} from '../lib/utils'

const api = new Hono()

// Enable CORS
api.use('*', cors())

// Health check
api.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ==================== COMMON APIs ====================

// Search staff (for autocomplete)
// Search staff (for autocomplete)
api.get('/staff/search', async (c) => {
  const warehouseCode = c.req.query('warehouseCode')
  const query = (c.req.query('q') || '').trim()

  if (!query) return c.json({ success: true, data: [] })

  const supabase = createSupabaseClient()

  // Run two parallel queries to robustly search both fields without complex OR syntax
  let nameQuery = supabase
    .from('payroll_monthly')
    .select('staff_id, staff_name, role_name, warehouse_code')
    .ilike('staff_name', `%${query}%`)
    .limit(20)

  let idQuery = supabase
    .from('payroll_monthly')
    .select('staff_id, staff_name, role_name, warehouse_code')
    .ilike('staff_id', `%${query}%`)
    .limit(20)

  if (warehouseCode) {
    nameQuery = nameQuery.eq('warehouse_code', warehouseCode)
    idQuery = idQuery.eq('warehouse_code', warehouseCode)
  }

  const [nameRes, idRes] = await Promise.all([nameQuery, idQuery])

  if (nameRes.error) {
    return c.json({ success: false, error: nameRes.error.message }, 500)
  }
  if (idRes.error) {
    return c.json({ success: false, error: idRes.error.message }, 500)
  }

  const allData = [...(nameRes.data || []), ...(idRes.data || [])]

  // Deduplicate by staff_id
  const uniqueStaff = Array.from(new Map(allData.map(item => [item.staff_id, item])).values())

  return c.json({ success: true, data: uniqueStaff })
})

// ==================== EMPLOYEE APIs ====================

// Get employee's weekly KPI
api.get('/employee/:staffId/kpi/weekly', async (c) => {
  const staffId = c.req.param('staffId')
  const yearWeek = c.req.query('yearWeek') || getCurrentWeek()
  const warehouseCode = c.req.query('warehouseCode')

  const supabase = createSupabaseClient()

  let query = supabase
    .from('kpi_weekly_summary')
    .select('*')
    .eq('staff_id', staffId)
    .eq('year_week', yearWeek)

  if (warehouseCode) {
    query = query.eq('warehouse_code', warehouseCode)
  }

  const { data, error } = await query.single()

  if (error && error.code !== 'PGRST116') {
    return c.json({ success: false, error: error.message }, 500)
  }

  // Get ranking for the week
  let rankingQuery = supabase
    .from('ranking_weekly_result')
    .select('*')
    .eq('staff_id', staffId)
    .eq('year_week', yearWeek)

  if (warehouseCode) {
    rankingQuery = rankingQuery.eq('warehouse_code', warehouseCode)
  }

  const { data: ranking } = await rankingQuery.single()

  // Get previous week for comparison
  const prevWeek = getPreviousWeek(yearWeek)
  let prevQuery = supabase
    .from('kpi_weekly_summary')
    .select('pph, main_task_points, total_points')
    .eq('staff_id', staffId)
    .eq('year_week', prevWeek)

  if (warehouseCode) {
    prevQuery = prevQuery.eq('warehouse_code', warehouseCode)
  }

  const { data: prevData } = await prevQuery.single()

  return c.json({
    success: true,
    data: {
      current: data,
      ranking,
      previousWeek: prevData,
      comparison: prevData && data ? {
        pphChange: data.pph - prevData.pph,
        pointsChange: data.main_task_points - prevData.main_task_points,
      } : null,
    },
  })
})

// Get employee's monthly KPI
api.get('/employee/:staffId/kpi/monthly', async (c) => {
  const staffId = c.req.param('staffId')
  const payrollPeriod = c.req.query('payrollPeriod') || getPayrollPeriod(new Date())
  const warehouseCode = c.req.query('warehouseCode')

  const supabase = createSupabaseClient()

  let query = supabase
    .from('kpi_monthly_summary')
    .select('*')
    .eq('staff_id', staffId)
    .eq('payroll_period', payrollPeriod)

  if (warehouseCode) {
    query = query.eq('warehouse_code', warehouseCode)
  }

  const { data, error } = await query.single()

  if (error && error.code !== 'PGRST116') {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Get employee's daily breakdown
api.get('/employee/:staffId/kpi/daily', async (c) => {
  const staffId = c.req.param('staffId')
  const startDate = c.req.query('startDate')
  const endDate = c.req.query('endDate')
  const warehouseCode = c.req.query('warehouseCode')

  if (!startDate || !endDate) {
    return c.json({ success: false, error: 'startDate and endDate are required' }, 400)
  }

  const supabase = createSupabaseClient()

  let query = supabase
    .from('warehouse_productivity_daily')
    .select('*')
    .eq('staff_id', staffId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })

  if (warehouseCode) {
    query = query.eq('warehouse_code', warehouseCode)
  }

  const { data, error } = await query

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Get employee's ORS
api.get('/employee/:staffId/ors', async (c) => {
  const staffId = c.req.param('staffId')
  const payrollPeriod = c.req.query('payrollPeriod') || getPayrollPeriod(new Date())
  const warehouseCode = c.req.query('warehouseCode')

  const supabase = createSupabaseClient()

  // Get monthly summary
  let summaryQuery = supabase
    .from('ors_monthly_summary')
    .select('*')
    .eq('staff_id', staffId)
    .eq('payroll_period', payrollPeriod)

  if (warehouseCode) {
    summaryQuery = summaryQuery.eq('warehouse_code', warehouseCode)
  }

  const { data: summary } = await summaryQuery.single()

  // Get detailed events
  const [year, month] = payrollPeriod.split('-').map(Number)
  const startDate = `${payrollPeriod}-01`
  const endDate = new Date(year, month, 0).toISOString().split('T')[0]

  let eventsQuery = supabase
    .from('ors_event')
    .select('*, ors_catalog(name, job_group, severity_level)')
    .eq('staff_id', staffId)
    .gte('event_date', startDate)
    .lte('event_date', endDate)
    .order('event_date', { ascending: false })

  if (warehouseCode) {
    eventsQuery = eventsQuery.eq('warehouse_code', warehouseCode)
  }

  const { data: events } = await eventsQuery

  return c.json({
    success: true,
    data: {
      summary,
      events,
    },
  })
})

// Get employee's ranking history
api.get('/employee/:staffId/ranking/history', async (c) => {
  const staffId = c.req.param('staffId')
  const limit = parseInt(c.req.query('limit') || '12')
  const warehouseCode = c.req.query('warehouseCode')

  const supabase = createSupabaseClient()

  let query = supabase
    .from('ranking_weekly_result')
    .select('*')
    .eq('staff_id', staffId)
    .order('year_week', { ascending: false })
    .limit(limit)

  if (warehouseCode) {
    query = query.eq('warehouse_code', warehouseCode)
  }

  const { data, error } = await query

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// ==================== MANAGER APIs ====================

// Get warehouse dashboard stats
api.get('/manager/dashboard', async (c) => {
  const warehouseCode = c.req.query('warehouseCode')
  const yearWeek = c.req.query('yearWeek') || getCurrentWeek()

  if (!warehouseCode) {
    return c.json({ success: false, error: 'warehouseCode is required' }, 400)
  }

  const supabase = createSupabaseClient()

  // Get weekly summaries for the warehouse
  const { data: weeklySummaries, error } = await supabase
    .from('kpi_weekly_summary')
    .select('staff_id, pph, main_task_points, total_points, estimated_work_hours, data_status')
    .eq('warehouse_code', warehouseCode)
    .eq('year_week', yearWeek)

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  // Get rankings distribution
  const { data: rankings } = await supabase
    .from('ranking_weekly_result')
    .select('ranking_score')
    .eq('warehouse_code', warehouseCode)
    .eq('year_week', yearWeek)

  // Calculate stats
  const totalStaff = weeklySummaries?.length || 0
  const avgPPH = weeklySummaries?.reduce((sum, s) => sum + s.pph, 0) / (totalStaff || 1)
  const totalPoints = weeklySummaries?.reduce((sum, s) => sum + s.total_points, 0) || 0

  // Ranking distribution
  const rankingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  rankings?.forEach(r => {
    rankingDistribution[r.ranking_score as keyof typeof rankingDistribution]++
  })

  return c.json({
    success: true,
    data: {
      yearWeek,
      warehouseCode,
      totalStaff,
      avgPPH: Math.round(avgPPH * 100) / 100,
      totalPoints: Math.round(totalPoints * 100) / 100,
      rankingDistribution,
    },
  })
})

// Get team ranking
api.get('/manager/ranking', async (c) => {
  const warehouseCode = c.req.query('warehouseCode')
  const yearWeek = c.req.query('yearWeek') || getCurrentWeek()
  const role = c.req.query('role')
  const limit = parseInt(c.req.query('limit') || '100')
  const offset = parseInt(c.req.query('offset') || '0')

  if (!warehouseCode) {
    return c.json({ success: false, error: 'warehouseCode is required' }, 400)
  }

  const supabase = createSupabaseClient()

  // Get ranking data
  const { data: rankings, error: rankingError } = await supabase
    .from('ranking_weekly_result')
    .select('*')
    .eq('warehouse_code', warehouseCode)
    .eq('year_week', yearWeek)
    .order('ranking_score', { ascending: false })
    .order('pph', { ascending: false })
    .range(offset, offset + limit - 1)

  if (rankingError) {
    return c.json({ success: false, error: rankingError.message }, 500)
  }

  // Get weekly summaries for additional info
  const staffIds = rankings?.map(r => r.staff_id) || []
  const { data: weeklySummaries } = await supabase
    .from('kpi_weekly_summary')
    .select('staff_id, main_task, total_points, task_points_detail')
    .eq('warehouse_code', warehouseCode)
    .eq('year_week', yearWeek)
    .in('staff_id', staffIds)

  // Merge data
  const summaryMap = new Map(weeklySummaries?.map(s => [s.staff_id, s]) || [])
  const data = rankings?.map(r => ({
    ...r,
    kpi_weekly_summary: summaryMap.get(r.staff_id) || null
  }))

  return c.json({
    success: true,
    data,
    pagination: {
      limit,
      offset,
      total: data?.length || 0,
    },
  })
})

// Get ORS alerts
api.get('/manager/ors/alerts', async (c) => {
  const warehouseCode = c.req.query('warehouseCode')
  const payrollPeriod = c.req.query('payrollPeriod') || getPayrollPeriod(new Date())

  if (!warehouseCode) {
    return c.json({ success: false, error: 'warehouseCode is required' }, 400)
  }

  const supabase = createSupabaseClient()

  // Get staff with ORS above warning threshold
  const { data, error } = await supabase
    .from('ors_monthly_summary')
    .select('*')
    .eq('warehouse_code', warehouseCode)
    .eq('payroll_period', payrollPeriod)
    .gte('ors_points_total', 10)
    .order('ors_points_total', { ascending: false })

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Get pending ORS events for review
api.get('/manager/ors/pending', async (c) => {
  const warehouseCode = c.req.query('warehouseCode')

  if (!warehouseCode) {
    return c.json({ success: false, error: 'warehouseCode is required' }, 400)
  }

  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('ors_event')
    .select('*, ors_catalog(name, job_group, severity_level)')
    .eq('warehouse_code', warehouseCode)
    .eq('status', 'OPEN')
    .order('event_date', { ascending: false })

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Create ORS event
api.post('/manager/ors/create', async (c) => {
  const body = await c.req.json()
  const {
    warehouse_code,
    staff_id,
    staff_name,
    event_date,
    event_time,
    ors_code,
    description,
    evidence_urls,
    reported_by,
  } = body

  if (!warehouse_code || !staff_id || !event_date || !ors_code || !reported_by) {
    return c.json({ success: false, error: 'Missing required fields' }, 400)
  }

  const supabase = createSupabaseClient()

  // Get ORS points from catalog
  const { data: catalog } = await supabase
    .from('ors_catalog')
    .select('ors_points')
    .eq('ors_code', ors_code)
    .single()

  if (!catalog) {
    return c.json({ success: false, error: 'Invalid ORS code' }, 400)
  }

  const { data, error } = await supabase
    .from('ors_event')
    .insert({
      warehouse_code,
      staff_id,
      staff_name,
      event_date,
      event_time,
      ors_code,
      ors_points: catalog.ors_points,
      description,
      evidence_urls: evidence_urls || [],
      reported_by,
      status: 'OPEN',
    })
    .select()
    .single()

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Review ORS event
api.post('/manager/ors/:eventId/review', async (c) => {
  const eventId = c.req.param('eventId')
  const body = await c.req.json()
  const { status, reviewed_by, rejection_reason, notes } = body

  if (!status || !reviewed_by) {
    return c.json({ success: false, error: 'status and reviewed_by are required' }, 400)
  }

  if (!['CONFIRMED', 'REJECTED', 'ADJUSTED'].includes(status)) {
    return c.json({ success: false, error: 'Invalid status' }, 400)
  }

  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('ors_event')
    .update({
      status,
      reviewed_by,
      reviewed_at: new Date().toISOString(),
      rejection_reason,
      notes,
    })
    .eq('id', eventId)
    .select()
    .single()

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// ==================== ADMIN APIs ====================

// Get ORS catalog
api.get('/admin/ors-catalog', async (c) => {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('ors_catalog')
    .select('*')
    .order('job_group')
    .order('ors_code')

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Get ranking configs
api.get('/admin/ranking-config', async (c) => {
  const warehouseCode = c.req.query('warehouseCode')

  const supabase = createSupabaseClient()

  let query = supabase
    .from('ranking_range_config')
    .select('*')
    .eq('is_active', true)
    .order('ranking_score', { ascending: false })

  if (warehouseCode) {
    query = query.or(`warehouse_code.is.null,warehouse_code.eq.${warehouseCode}`)
  }

  const { data, error } = await query

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Update ranking config
api.post('/admin/ranking-config', async (c) => {
  const body = await c.req.json()
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('ranking_range_config')
    .upsert(body)
    .select()

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Get role-task configs
api.get('/admin/role-task-config', async (c) => {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('role_main_task_config')
    .select('*')
    .eq('is_active', true)
    .order('role')

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Get bonus configs
api.get('/admin/bonus-config', async (c) => {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('kpi_bonus_config')
    .select('*')
    .eq('is_active', true)
    .order('country')

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Get recovery catalog (active only by default) - Used by admin page initially
api.get('/admin/recovery-catalog', async (c) => {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('ors_recovery_catalog')
    .select('*')
    .eq('is_active', true)
    .order('difficulty')
    .order('ors_reward', { ascending: false })

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// ==================== ADMIN CRUD APIs ====================

// Create/Update ranking config
api.post('/admin/ranking-config/upsert', async (c) => {
  const body = await c.req.json()
  const supabase = createSupabaseClient()

  const { id, warehouse_code, role, main_task, pph_min, pph_max, ranking_score, min_weekly_hours, description, is_active } = body

  const record = {
    warehouse_code: warehouse_code || null,
    role: role || null,
    main_task: main_task || null,
    pph_min: parseFloat(pph_min) || 0,
    pph_max: parseFloat(pph_max) || 999999.99,
    ranking_score: parseInt(ranking_score),
    min_weekly_hours: parseFloat(min_weekly_hours) || 20,
    description,
    is_active: is_active !== false,
    effective_from: new Date().toISOString().split('T')[0],
  }

  let query
  if (id) {
    query = supabase.from('ranking_range_config').update(record).eq('id', id)
  } else {
    query = supabase.from('ranking_range_config').insert(record)
  }

  const { data, error } = await query.select().single()

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Toggle ranking config active status
api.post('/admin/ranking-config/:id/toggle', async (c) => {
  const id = c.req.param('id')
  const supabase = createSupabaseClient()

  // Get current status
  const { data: current } = await supabase
    .from('ranking_range_config')
    .select('is_active')
    .eq('id', id)
    .single()

  const { data, error } = await supabase
    .from('ranking_range_config')
    .update({ is_active: !current?.is_active })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Delete ranking config
api.delete('/admin/ranking-config/:id', async (c) => {
  const id = c.req.param('id')
  const supabase = createSupabaseClient()

  const { error } = await supabase
    .from('ranking_range_config')
    .delete()
    .eq('id', id)

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, message: 'Deleted successfully' })
})

// Create/Update role-task config
api.post('/admin/role-task-config/upsert', async (c) => {
  const body = await c.req.json()
  const supabase = createSupabaseClient()

  const { id, warehouse_code, role, role_id, main_task, is_active } = body

  if (!role || !main_task) {
    return c.json({ success: false, error: 'role and main_task are required' }, 400)
  }

  const record = {
    warehouse_code: warehouse_code || null,
    role,
    role_id: role_id || null,
    main_task,
    is_active: is_active !== false,
    effective_from: new Date().toISOString().split('T')[0],
  }

  let query
  if (id) {
    query = supabase.from('role_main_task_config').update(record).eq('id', id)
  } else {
    query = supabase.from('role_main_task_config').insert(record)
  }

  const { data, error } = await query.select().single()

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Toggle role-task config active status
api.post('/admin/role-task-config/:id/toggle', async (c) => {
  const id = c.req.param('id')
  const supabase = createSupabaseClient()

  const { data: current } = await supabase
    .from('role_main_task_config')
    .select('is_active')
    .eq('id', id)
    .single()

  const { data, error } = await supabase
    .from('role_main_task_config')
    .update({ is_active: !current?.is_active })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Delete role-task config
api.delete('/admin/role-task-config/:id', async (c) => {
  const id = c.req.param('id')
  const supabase = createSupabaseClient()

  const { error } = await supabase
    .from('role_main_task_config')
    .delete()
    .eq('id', id)

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, message: 'Deleted successfully' })
})

// Create/Update ORS catalog
api.post('/admin/ors-catalog/upsert', async (c) => {
  const body = await c.req.json()
  const supabase = createSupabaseClient()

  const { id, ors_code, job_group, name, description, severity_level, ors_points, is_active } = body

  if (!ors_code || !job_group || !name || !severity_level || ors_points === undefined) {
    return c.json({ success: false, error: 'Missing required fields' }, 400)
  }

  const record = {
    ors_code,
    job_group,
    name,
    description: description || null,
    severity_level,
    ors_points: parseInt(ors_points),
    is_active: is_active !== false,
  }

  let query
  if (id) {
    query = supabase.from('ors_catalog').update(record).eq('id', id)
  } else {
    query = supabase.from('ors_catalog').insert(record)
  }

  const { data, error } = await query.select().single()

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Toggle ORS catalog active status
api.post('/admin/ors-catalog/:id/toggle', async (c) => {
  const id = c.req.param('id')
  const supabase = createSupabaseClient()

  const { data: current } = await supabase
    .from('ors_catalog')
    .select('is_active')
    .eq('id', id)
    .single()

  const { data, error } = await supabase
    .from('ors_catalog')
    .update({ is_active: !current?.is_active })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Delete ORS catalog item
api.delete('/admin/ors-catalog/:id', async (c) => {
  const id = c.req.param('id')
  const supabase = createSupabaseClient()

  const { error } = await supabase
    .from('ors_catalog')
    .delete()
    .eq('id', id)

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, message: 'Deleted successfully' })
})

// Create/Update bonus config
api.post('/admin/bonus-config/upsert', async (c) => {
  const body = await c.req.json()
  const supabase = createSupabaseClient()

  const { id, warehouse_code, country, ranking_score_min, ranking_score_max, calculation_type, amount_per_point, fixed_amount, cap_amount, currency, is_active } = body

  if (!country || !calculation_type || !currency) {
    return c.json({ success: false, error: 'country, calculation_type, and currency are required' }, 400)
  }

  const record = {
    warehouse_code: warehouse_code || null,
    country,
    ranking_score_min: parseInt(ranking_score_min) || 1,
    ranking_score_max: parseInt(ranking_score_max) || 5,
    calculation_type,
    amount_per_point: parseFloat(amount_per_point) || null,
    fixed_amount: parseFloat(fixed_amount) || null,
    cap_amount: parseFloat(cap_amount) || null,
    currency,
    is_active: is_active !== false,
    effective_from: new Date().toISOString().split('T')[0],
  }

  let query
  if (id) {
    query = supabase.from('kpi_bonus_config').update(record).eq('id', id)
  } else {
    query = supabase.from('kpi_bonus_config').insert(record)
  }

  const { data, error } = await query.select().single()

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Toggle bonus config active status
api.post('/admin/bonus-config/:id/toggle', async (c) => {
  const id = c.req.param('id')
  const supabase = createSupabaseClient()

  const { data: current } = await supabase
    .from('kpi_bonus_config')
    .select('is_active')
    .eq('id', id)
    .single()

  const { data, error } = await supabase
    .from('kpi_bonus_config')
    .update({ is_active: !current?.is_active })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Delete bonus config
api.delete('/admin/bonus-config/:id', async (c) => {
  const id = c.req.param('id')
  const supabase = createSupabaseClient()

  const { error } = await supabase
    .from('kpi_bonus_config')
    .delete()
    .eq('id', id)

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, message: 'Deleted successfully' })
})

// Create/Update recovery catalog
api.post('/admin/recovery-catalog/upsert', async (c) => {
  const body = await c.req.json()
  const supabase = createSupabaseClient()

  const { id, recovery_code, title, recovery_type, difficulty, ors_reward, target_roles, description, is_active } = body

  if (!recovery_code || !title || !recovery_type || !difficulty || ors_reward === undefined) {
    return c.json({ success: false, error: 'Missing required fields' }, 400)
  }

  const record = {
    recovery_code,
    title,
    recovery_type,
    difficulty,
    ors_reward: parseInt(ors_reward),
    target_roles: target_roles || [],
    description: description || null,
    is_active: is_active !== false,
  }

  let query
  if (id) {
    query = supabase.from('ors_recovery_catalog').update(record).eq('id', id)
  } else {
    query = supabase.from('ors_recovery_catalog').insert(record)
  }

  const { data, error } = await query.select().single()

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Toggle recovery catalog active status
api.post('/admin/recovery-catalog/:id/toggle', async (c) => {
  const id = c.req.param('id')
  const supabase = createSupabaseClient()

  const { data: current } = await supabase
    .from('ors_recovery_catalog')
    .select('is_active')
    .eq('id', id)
    .single()

  const { data, error } = await supabase
    .from('ors_recovery_catalog')
    .update({ is_active: !current?.is_active })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Delete recovery catalog item
api.delete('/admin/recovery-catalog/:id', async (c) => {
  const id = c.req.param('id')
  const supabase = createSupabaseClient()

  const { error } = await supabase
    .from('ors_recovery_catalog')
    .delete()
    .eq('id', id)

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, message: 'Deleted successfully' })
})

// Get all ranking configs (including inactive)
api.get('/admin/ranking-config/all', async (c) => {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('ranking_range_config')
    .select('*')
    .order('ranking_score', { ascending: false })

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Get all role-task configs (including inactive)
api.get('/admin/role-task-config/all', async (c) => {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('role_main_task_config')
    .select('*')
    .order('role')

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Get all ORS catalog (including inactive)
api.get('/admin/ors-catalog/all', async (c) => {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('ors_catalog')
    .select('*')
    .order('job_group')
    .order('ors_code')

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Get all bonus configs (including inactive)
api.get('/admin/bonus-config/all', async (c) => {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('kpi_bonus_config')
    .select('*')
    .order('country')

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Get all recovery catalog (including inactive)
api.get('/admin/recovery-catalog/all', async (c) => {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('ors_recovery_catalog')
    .select('*')
    .order('difficulty')
    .order('ors_reward', { ascending: false })

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// ==================== JOBS APIs ====================

// Run Job A manually
api.post('/jobs/run-a', async (c) => {
  const body = await c.req.json()
  const { yearWeek, warehouseCode } = body

  const supabase = createSupabaseClient()
  const result = await runJobA(supabase, { yearWeek, warehouseCode })

  return c.json(result)
})

// Run Job B manually
api.post('/jobs/run-b', async (c) => {
  const body = await c.req.json()
  const { yearWeek, warehouseCode } = body

  const supabase = createSupabaseClient()
  const result = await runJobB(supabase, { yearWeek, warehouseCode })

  return c.json(result)
})

// Run Job C manually
api.post('/jobs/run-c', async (c) => {
  const body = await c.req.json()
  const { payrollPeriod, warehouseCode } = body

  const supabase = createSupabaseClient()
  const result = await runJobC(supabase, { payrollPeriod, warehouseCode })

  return c.json(result)
})

// Run Job D manually
api.post('/jobs/run-d', async (c) => {
  const body = await c.req.json()
  const { payrollPeriod, warehouseCode } = body

  const supabase = createSupabaseClient()
  const result = await runJobD(supabase, { payrollPeriod, warehouseCode })

  return c.json(result)
})

// Run full pipeline
api.post('/jobs/run-pipeline', async (c) => {
  const body = await c.req.json()
  const { yearWeek, payrollPeriod, warehouseCode } = body

  const supabase = createSupabaseClient()
  const result = await runPipeline(supabase, { yearWeek, payrollPeriod, warehouseCode })

  return c.json(result)
})

// Run monthly pipeline (All weeks + monthly jobs)
api.post('/jobs/run-monthly', async (c) => {
  const body = await c.req.json()
  const { payrollPeriod, warehouseCode } = body

  const supabase = createSupabaseClient()
  const result = await runMonthlyPipeline(supabase, { payrollPeriod, warehouseCode })

  return c.json(result)
})

// ==================== PAYROLL APIs ====================

// Get payroll KPI bridge data
api.get('/payroll/bridge', async (c) => {
  const warehouseCode = c.req.query('warehouseCode')
  const payrollPeriod = c.req.query('payrollPeriod')

  if (!payrollPeriod) {
    return c.json({ success: false, error: 'payrollPeriod is required' }, 400)
  }

  const supabase = createSupabaseClient()

  let query = supabase
    .from('payroll_kpi_bridge')
    .select('*')
    .eq('payroll_period', payrollPeriod)
    .order('staff_id')

  if (warehouseCode) {
    query = query.eq('warehouse_code', warehouseCode)
  }

  const { data, error } = await query

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Mark payroll as applied
api.post('/payroll/apply', async (c) => {
  const body = await c.req.json()
  const { warehouseCode, payrollPeriod, staffIds } = body

  if (!payrollPeriod) {
    return c.json({ success: false, error: 'payrollPeriod is required' }, 400)
  }

  const supabase = createSupabaseClient()

  let query = supabase
    .from('payroll_kpi_bridge')
    .update({
      applied_to_payroll: true,
      applied_at: new Date().toISOString(),
    })
    .eq('payroll_period', payrollPeriod)

  if (warehouseCode) {
    query = query.eq('warehouse_code', warehouseCode)
  }

  if (staffIds && staffIds.length > 0) {
    query = query.in('staff_id', staffIds)
  }

  const { data, error } = await query.select()

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data, updated: data?.length || 0 })
})

// ==================== ORS RECOVERY APIs ====================

// Get Recovery Catalog
api.get('/recovery/catalog', async (c) => {
  const recoveryType = c.req.query('type')
  const difficulty = c.req.query('difficulty')
  const role = c.req.query('role')

  const supabase = createSupabaseClient()

  let query = supabase
    .from('ors_recovery_catalog')
    .select('*')
    .eq('is_active', true)
    .order('difficulty')
    .order('ors_reward', { ascending: false })

  if (recoveryType) {
    query = query.eq('recovery_type', recoveryType)
  }

  if (difficulty) {
    query = query.eq('difficulty', difficulty)
  }

  const { data, error } = await query

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  // Filter by role if specified
  let filteredData = data
  if (role && data) {
    filteredData = data.filter(item =>
      item.target_roles.includes(role) || item.target_roles.includes('All Roles')
    )
  }

  return c.json({ success: true, data: filteredData })
})

// Get Recovery Catalog by code
api.get('/recovery/catalog/:code', async (c) => {
  const code = c.req.param('code')

  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('ors_recovery_catalog')
    .select('*')
    .eq('recovery_code', code)
    .single()

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Get Recovery Tickets - Manager view
api.get('/recovery/tickets', async (c) => {
  const warehouseCode = c.req.query('warehouseCode')
  const staffId = c.req.query('staffId')
  const status = c.req.query('status')
  const payrollPeriod = c.req.query('payrollPeriod')
  const limit = parseInt(c.req.query('limit') || '50')
  const offset = parseInt(c.req.query('offset') || '0')

  const supabase = createSupabaseClient()

  let query = supabase
    .from('ors_recovery_ticket')
    .select('*, ors_recovery_catalog(title, recovery_type, difficulty, description)')
    .order('assigned_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (warehouseCode) {
    query = query.eq('warehouse_code', warehouseCode)
  }

  if (staffId) {
    query = query.eq('staff_id', staffId)
  }

  if (status) {
    query = query.eq('status', status)
  }

  if (payrollPeriod) {
    query = query.eq('ors_applied_to_period', payrollPeriod)
  }

  const { data, error, count } = await query

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({
    success: true,
    data,
    pagination: { limit, offset, total: count || data?.length || 0 }
  })
})

// Get Employee's Recovery Tickets
api.get('/recovery/tickets/my/:staffId', async (c) => {
  const staffId = c.req.param('staffId')
  const warehouseCode = c.req.query('warehouseCode')

  const supabase = createSupabaseClient()

  let query = supabase
    .from('ors_recovery_ticket')
    .select('*, ors_recovery_catalog(title, recovery_type, difficulty, description)')
    .eq('staff_id', staffId)
    .order('assigned_at', { ascending: false })

  if (warehouseCode) {
    query = query.eq('warehouse_code', warehouseCode)
  }

  const { data, error } = await query

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  // Separate by status
  const active = data?.filter(t => ['ASSIGNED', 'IN_PROGRESS'].includes(t.status)) || []
  const completed = data?.filter(t => t.status === 'COMPLETED') || []
  const failed = data?.filter(t => ['FAILED', 'EXPIRED', 'CANCELLED'].includes(t.status)) || []

  // Calculate totals
  const totalRecoveryApplied = completed
    .filter(t => t.ors_applied)
    .reduce((sum, t) => sum + t.ors_reward, 0)

  return c.json({
    success: true,
    data: {
      active,
      completed,
      failed,
      summary: {
        totalActive: active.length,
        totalCompleted: completed.length,
        totalRecoveryApplied,
      }
    }
  })
})

// Get single Recovery Ticket
api.get('/recovery/tickets/:id', async (c) => {
  const id = c.req.param('id')

  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('ors_recovery_ticket')
    .select('*, ors_recovery_catalog(*)')
    .eq('id', id)
    .single()

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Create Recovery Ticket - Manager
api.post('/recovery/tickets', async (c) => {
  const body = await c.req.json()
  const {
    warehouse_code,
    staff_id,
    staff_name,
    recovery_catalog_id,
    deadline_at,
    notes,
    assigned_by,
    assigned_at,
  } = body

  if (!warehouse_code || !staff_id || !recovery_catalog_id || !assigned_by) {
    return c.json({ success: false, error: 'Missing required fields' }, 400)
  }

  const supabase = createSupabaseClient()

  // Get catalog info
  const { data: catalog, error: catalogError } = await supabase
    .from('ors_recovery_catalog')
    .select('*')
    .eq('id', recovery_catalog_id)
    .single()

  if (catalogError || !catalog) {
    return c.json({ success: false, error: 'Invalid recovery catalog' }, 400)
  }

  // Check if one_time_use and already completed
  if (catalog.one_time_use) {
    const { data: existingCompleted } = await supabase
      .from('ors_recovery_ticket')
      .select('id')
      .eq('staff_id', staff_id)
      .eq('recovery_catalog_id', recovery_catalog_id)
      .eq('status', 'COMPLETED')
      .limit(1)

    if (existingCompleted && existingCompleted.length > 0) {
      return c.json({
        success: false,
        error: 'Nhân viên đã hoàn thành Recovery này trước đó (one-time use)'
      }, 400)
    }
  }

  // Generate ticket code
  const now = new Date()
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  // Count existing tickets this month
  const { count } = await supabase
    .from('ors_recovery_ticket')
    .select('*', { count: 'exact', head: true })
    .like('ticket_code', `REC-${yearMonth}-%`)

  const ticketNumber = String((count || 0) + 1).padStart(4, '0')
  const ticket_code = `REC-${yearMonth}-${ticketNumber}`

  const { data, error } = await supabase
    .from('ors_recovery_ticket')
    .insert({
      ticket_code,
      warehouse_code,
      staff_id,
      staff_name,
      recovery_catalog_id,
      recovery_code: catalog.recovery_code,
      recovery_type: catalog.recovery_type,
      ors_reward: catalog.ors_reward,
      status: 'ASSIGNED',
      deadline_at,
      assigned_at: assigned_at || new Date().toISOString(),
      notes,
      assigned_by,
    })
    .select('*, ors_recovery_catalog(title)')
    .single()

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Update Recovery Ticket Status
api.put('/recovery/tickets/:id/status', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const {
    status,
    completion_notes,
    evidence_description,
    confirmed_by
  } = body

  if (!status) {
    return c.json({ success: false, error: 'status is required' }, 400)
  }

  const validStatuses = ['IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED']
  if (!validStatuses.includes(status)) {
    return c.json({ success: false, error: 'Invalid status' }, 400)
  }

  const supabase = createSupabaseClient()

  const updateData: Record<string, unknown> = { status }

  if (status === 'IN_PROGRESS') {
    updateData.started_at = new Date().toISOString()
  }

  if (status === 'COMPLETED' || status === 'FAILED') {
    updateData.completed_at = new Date().toISOString()
    updateData.confirmed_by = confirmed_by
    updateData.confirmed_at = new Date().toISOString()
    if (completion_notes) updateData.completion_notes = completion_notes
    if (evidence_description) updateData.evidence_description = evidence_description
  }

  const { data, error } = await supabase
    .from('ors_recovery_ticket')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, data })
})

// Apply Recovery Points to ORS
api.post('/recovery/tickets/:id/apply', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const { payroll_period, applied_by } = body

  if (!payroll_period) {
    return c.json({ success: false, error: 'payroll_period is required' }, 400)
  }

  const supabase = createSupabaseClient()

  // Get ticket info
  const { data: ticket, error: ticketError } = await supabase
    .from('ors_recovery_ticket')
    .select('*')
    .eq('id', id)
    .single()

  if (ticketError || !ticket) {
    return c.json({ success: false, error: 'Ticket not found' }, 404)
  }

  if (ticket.status !== 'COMPLETED') {
    return c.json({ success: false, error: 'Ticket must be COMPLETED before applying' }, 400)
  }

  if (ticket.ors_applied) {
    return c.json({ success: false, error: 'Recovery points already applied' }, 400)
  }

  // Update ticket
  const { data: updatedTicket, error: updateError } = await supabase
    .from('ors_recovery_ticket')
    .update({
      ors_applied: true,
      ors_applied_at: new Date().toISOString(),
      ors_applied_to_period: payroll_period,
    })
    .eq('id', id)
    .select()
    .single()

  if (updateError) {
    return c.json({ success: false, error: updateError.message }, 500)
  }

  // Update ORS Monthly Summary - subtract recovery points
  const { data: orsSummary } = await supabase
    .from('ors_monthly_summary')
    .select('*')
    .eq('warehouse_code', ticket.warehouse_code)
    .eq('staff_id', ticket.staff_id)
    .eq('payroll_period', payroll_period)
    .single()

  if (orsSummary) {
    const newOrsPoints = Math.max(0, orsSummary.ors_points_total - ticket.ors_reward)

    // Recalculate milestone level based on new points
    let newMilestoneLevel = 'GREEN'
    let newPenaltyRate = 0

    if (newOrsPoints >= 40) {
      newMilestoneLevel = 'CRITICAL'
      newPenaltyRate = 1.0
    } else if (newOrsPoints >= 30) {
      newMilestoneLevel = 'RED'
      newPenaltyRate = 0.3
    } else if (newOrsPoints >= 20) {
      newMilestoneLevel = 'ORANGE'
      newPenaltyRate = 0.1
    } else if (newOrsPoints >= 10) {
      newMilestoneLevel = 'YELLOW'
      newPenaltyRate = 0
    }

    await supabase
      .from('ors_monthly_summary')
      .update({
        ors_points_total: newOrsPoints,
        milestone_level: newMilestoneLevel,
        penalty_rate: newPenaltyRate,
      })
      .eq('id', orsSummary.id)
  }

  return c.json({
    success: true,
    data: updatedTicket,
    message: `Applied ${ticket.ors_reward} recovery points to ${payroll_period}`
  })
})

// Get Recovery Stats
api.get('/recovery/stats', async (c) => {
  const warehouseCode = c.req.query('warehouseCode')
  const payrollPeriod = c.req.query('payrollPeriod') || getPayrollPeriod(new Date())

  const supabase = createSupabaseClient()

  let query = supabase
    .from('ors_recovery_ticket')
    .select('status, ors_reward, ors_applied')

  if (warehouseCode) {
    query = query.eq('warehouse_code', warehouseCode)
  }

  // Filter by tickets assigned in the payroll period
  const [year, month] = payrollPeriod.split('-').map(Number)
  const startDate = `${payrollPeriod}-01`
  const endDate = new Date(year, month, 0).toISOString().split('T')[0]

  query = query.gte('assigned_at', startDate).lte('assigned_at', `${endDate}T23:59:59`)

  const { data, error } = await query

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  // Calculate stats
  const stats = {
    total: data?.length || 0,
    byStatus: {
      ASSIGNED: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      FAILED: 0,
      EXPIRED: 0,
      CANCELLED: 0,
    },
    totalRecoveryPoints: 0,
    appliedRecoveryPoints: 0,
  }

  data?.forEach(ticket => {
    stats.byStatus[ticket.status as keyof typeof stats.byStatus]++
    if (ticket.status === 'COMPLETED') {
      stats.totalRecoveryPoints += ticket.ors_reward
      if (ticket.ors_applied) {
        stats.appliedRecoveryPoints += ticket.ors_reward
      }
    }
  })

  return c.json({ success: true, data: stats })
})

// Get Recovery Stats by Staff
api.get('/recovery/stats/staff/:staffId', async (c) => {
  const staffId = c.req.param('staffId')
  const warehouseCode = c.req.query('warehouseCode')

  const supabase = createSupabaseClient()

  let query = supabase
    .from('ors_recovery_ticket')
    .select('*')
    .eq('staff_id', staffId)

  if (warehouseCode) {
    query = query.eq('warehouse_code', warehouseCode)
  }

  const { data, error } = await query

  if (error) {
    return c.json({ success: false, error: error.message }, 500)
  }

  const stats = {
    totalTickets: data?.length || 0,
    completedTickets: data?.filter(t => t.status === 'COMPLETED').length || 0,
    totalRecoveryEarned: data
      ?.filter(t => t.status === 'COMPLETED')
      .reduce((sum, t) => sum + t.ors_reward, 0) || 0,
    totalRecoveryApplied: data
      ?.filter(t => t.ors_applied)
      .reduce((sum, t) => sum + t.ors_reward, 0) || 0,
    byType: {
      TRAINING_QUIZ: data?.filter(t => t.recovery_type === 'TRAINING_QUIZ').length || 0,
      SKILL_CHALLENGE: data?.filter(t => t.recovery_type === 'SKILL_CHALLENGE').length || 0,
      IMPROVEMENT_PROPOSAL: data?.filter(t => t.recovery_type === 'IMPROVEMENT_PROPOSAL').length || 0,
    }
  }

  return c.json({ success: true, data: stats })
})

export default api

