// API Routes for Perfomance Management System
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createSupabaseClient } from '../lib/supabase'
import { runJobA, runJobB, runJobC, runJobD, runPipeline } from '../jobs'
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

export default api
