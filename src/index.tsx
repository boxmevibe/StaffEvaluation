import { Hono } from 'hono'
import { renderer } from './renderer'
import api from './routes/api'
import demo from './routes/demo'
import seed from './routes/seed'
import { HomePage } from './pages/home'
import { EmployeePage } from './pages/employee'
import { ManagerPage } from './pages/manager' // Acts as Report Page
import { LeaderboardPage } from './pages/leaderboard'
import { RecoveryPage } from './pages/recovery'
import { FaultsPage } from './pages/faults'
import { AdminPage } from './pages/admin'
import { PayrollPage } from './pages/payroll'
import { OnboardingPage } from './pages/onboarding'

const app = new Hono()

// Use renderer middleware
app.use(renderer)

// Mount API routes (Production with Supabase)
app.route('/api', api)

// Mount Demo API routes (No database required)
app.route('/demo', demo)

// Mount Seed API routes (Generate sample data)
app.route('/seed', seed)

// Page routes
app.get('/', (c) => {
  return c.render(<HomePage />, { title: 'Perfomance Management System' })
})

app.get('/employee', (c) => {
  const staffId = c.req.query('staffId')
  const warehouseCode = c.req.query('warehouseCode')
  return c.render(
    <EmployeePage staffId={staffId} warehouseCode={warehouseCode} />,
    { title: 'Dashboard Nhân viên - Performance' }
  )
})

app.get('/manager', (c) => {
  return c.redirect('/report')
})

app.get('/report', (c) => {
  return c.render(<ManagerPage />, { title: 'Báo cáo kho - Performance' })
})

app.get('/leaderboard', (c) => {
  return c.render(<LeaderboardPage />, { title: 'Bảng xếp hạng - Performance' })
})

app.get('/recovery', (c) => {
  return c.render(<RecoveryPage />, { title: 'Phục hồi điểm - Performance' })
})

app.get('/faults', (c) => {
  return c.render(<FaultsPage />, { title: 'Biên bản phạt - Performance' })
})

app.get('/admin', (c) => {
  return c.render(<AdminPage />, { title: 'Admin Configuration - Performance' })
})

app.get('/payroll', (c) => {
  return c.render(<PayrollPage />, { title: 'Payroll KPI Data - Performance' })
})

app.get('/onboarding', (c) => {
  return c.render(<OnboardingPage />, { title: 'Hướng dẫn sử dụng - Performance' })
})

// Static files
app.get('/static/*', async (c) => {
  return c.notFound()
})

export default app
