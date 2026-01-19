import { Hono } from 'hono'
import { renderer } from './renderer'
import api from './routes/api'
import demo from './routes/demo'
import seed from './routes/seed'
import { HomePage } from './pages/home'
import { EmployeePage } from './pages/employee'
import { ManagerPage } from './pages/manager'
import { AdminPage } from './pages/admin'
import { PayrollPage } from './pages/payroll'

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
  return c.render(<HomePage />, { title: 'KPI Warehouse Management System' })
})

app.get('/employee', (c) => {
  const staffId = c.req.query('staffId')
  const warehouseCode = c.req.query('warehouseCode')
  return c.render(
    <EmployeePage staffId={staffId} warehouseCode={warehouseCode} />, 
    { title: 'Dashboard Nhân viên - KPI Warehouse' }
  )
})

app.get('/manager', (c) => {
  return c.render(<ManagerPage />, { title: 'Dashboard Quản lý - KPI Warehouse' })
})

app.get('/admin', (c) => {
  return c.render(<AdminPage />, { title: 'Admin Configuration - KPI Warehouse' })
})

app.get('/payroll', (c) => {
  return c.render(<PayrollPage />, { title: 'Payroll KPI Data - KPI Warehouse' })
})

// Static files
app.get('/static/*', async (c) => {
  return c.notFound()
})

export default app
