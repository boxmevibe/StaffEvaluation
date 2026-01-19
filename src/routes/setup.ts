// Database Setup API - Creates tables and seed data
import { Hono } from 'hono'
import { createSupabaseClient } from '../lib/supabase'

const setup = new Hono()

// SQL statements split for execution
const CREATE_TABLES_SQL = `
-- Role Main Task Config
CREATE TABLE IF NOT EXISTS role_main_task_config (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50),
    role VARCHAR(100) NOT NULL,
    role_id INTEGER,
    main_task VARCHAR(50) NOT NULL,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ranking Range Config
CREATE TABLE IF NOT EXISTS ranking_range_config (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50),
    role VARCHAR(100),
    main_task VARCHAR(50),
    pph_min DECIMAL(10, 2) NOT NULL,
    pph_max DECIMAL(10, 2) NOT NULL,
    ranking_score INTEGER NOT NULL,
    min_weekly_hours DECIMAL(6, 2) DEFAULT 20,
    min_weekly_points DECIMAL(10, 2),
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- KPI Bonus Config
CREATE TABLE IF NOT EXISTS kpi_bonus_config (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50),
    country VARCHAR(10),
    ranking_score_min INTEGER NOT NULL,
    ranking_score_max INTEGER NOT NULL,
    calculation_type VARCHAR(20) NOT NULL,
    amount_per_point DECIMAL(15, 2),
    fixed_amount DECIMAL(15, 2),
    cap_amount DECIMAL(15, 2),
    currency VARCHAR(10) NOT NULL DEFAULT 'VND',
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORS Catalog
CREATE TABLE IF NOT EXISTS ors_catalog (
    id BIGSERIAL PRIMARY KEY,
    ors_code VARCHAR(20) UNIQUE NOT NULL,
    job_group VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    severity_level VARCHAR(5) NOT NULL,
    ors_points INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORS Milestone Config
CREATE TABLE IF NOT EXISTS ors_milestone_config (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50),
    ors_points_from INTEGER NOT NULL,
    ors_points_to INTEGER NOT NULL,
    milestone_level VARCHAR(20) NOT NULL,
    action_type VARCHAR(200),
    penalty_rate DECIMAL(5, 4) NOT NULL DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- KPI Weekly Summary
CREATE TABLE IF NOT EXISTS kpi_weekly_summary (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50) NOT NULL,
    warehouse_name VARCHAR(200),
    staff_id VARCHAR(50) NOT NULL,
    staff_name VARCHAR(200),
    role VARCHAR(100),
    year_week VARCHAR(10) NOT NULL,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    payroll_period VARCHAR(7) NOT NULL,
    main_task VARCHAR(50),
    main_task_points DECIMAL(12, 2) NOT NULL DEFAULT 0,
    main_task_quantity DECIMAL(12, 2),
    task_points_detail JSONB DEFAULT '{}',
    total_points DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total_quantity DECIMAL(12, 2),
    estimated_work_hours DECIMAL(8, 2) NOT NULL DEFAULT 0,
    working_days INTEGER DEFAULT 0,
    pph DECIMAL(10, 4) NOT NULL DEFAULT 0,
    data_status VARCHAR(30) DEFAULT 'OK',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_kpi_weekly_staff UNIQUE (warehouse_code, staff_id, year_week)
);

-- Ranking Weekly Result
CREATE TABLE IF NOT EXISTS ranking_weekly_result (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50) NOT NULL,
    staff_id VARCHAR(50) NOT NULL,
    staff_name VARCHAR(200),
    year_week VARCHAR(10) NOT NULL,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    pph DECIMAL(10, 4) NOT NULL DEFAULT 0,
    main_task_points DECIMAL(12, 2) NOT NULL DEFAULT 0,
    estimated_work_hours DECIMAL(8, 2) NOT NULL DEFAULT 0,
    ranking_score INTEGER NOT NULL,
    ranking_config_id BIGINT,
    status VARCHAR(30) DEFAULT 'FINAL',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_ranking_weekly_staff UNIQUE (warehouse_code, staff_id, year_week)
);

-- ORS Event
CREATE TABLE IF NOT EXISTS ors_event (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50) NOT NULL,
    staff_id VARCHAR(50) NOT NULL,
    staff_name VARCHAR(200),
    event_date DATE NOT NULL,
    event_time TIME,
    ors_code VARCHAR(20) NOT NULL,
    ors_points INTEGER NOT NULL,
    description TEXT,
    evidence_urls JSONB DEFAULT '[]',
    reported_by VARCHAR(100) NOT NULL,
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'OPEN',
    rejection_reason TEXT,
    original_ors_code VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORS Monthly Summary
CREATE TABLE IF NOT EXISTS ors_monthly_summary (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50) NOT NULL,
    staff_id VARCHAR(50) NOT NULL,
    staff_name VARCHAR(200),
    payroll_period VARCHAR(7) NOT NULL,
    ors_points_total INTEGER NOT NULL DEFAULT 0,
    event_count INTEGER NOT NULL DEFAULT 0,
    events_detail JSONB DEFAULT '[]',
    milestone_level VARCHAR(20) DEFAULT 'GREEN',
    penalty_rate DECIMAL(5, 4) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_ors_monthly_staff UNIQUE (warehouse_code, staff_id, payroll_period)
);

-- KPI Monthly Summary
CREATE TABLE IF NOT EXISTS kpi_monthly_summary (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50) NOT NULL,
    warehouse_name VARCHAR(200),
    staff_id VARCHAR(50) NOT NULL,
    staff_name VARCHAR(200),
    role VARCHAR(100),
    payroll_period VARCHAR(7) NOT NULL,
    major_kpi DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total_kpi_points DECIMAL(12, 2) NOT NULL DEFAULT 0,
    task_points_monthly JSONB DEFAULT '{}',
    weekly_rankings JSONB DEFAULT '[]',
    avg_ranking_score DECIMAL(4, 2) NOT NULL DEFAULT 0,
    final_ranking_score INTEGER NOT NULL DEFAULT 3,
    rating_factor DECIMAL(4, 2) NOT NULL DEFAULT 0.85,
    kpi_bonus_calculated DECIMAL(15, 2) NOT NULL DEFAULT 0,
    ors_points_total INTEGER NOT NULL DEFAULT 0,
    ors_penalty_rate DECIMAL(5, 4) NOT NULL DEFAULT 0,
    kpi_bonus_final DECIMAL(15, 2) NOT NULL DEFAULT 0,
    actual_workdays INTEGER,
    work_hours DECIMAL(8, 2),
    status VARCHAR(20) DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_kpi_monthly_staff UNIQUE (warehouse_code, staff_id, payroll_period)
);

-- Payroll KPI Bridge
CREATE TABLE IF NOT EXISTS payroll_kpi_bridge (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50) NOT NULL,
    payroll_period VARCHAR(7) NOT NULL,
    staff_id VARCHAR(50) NOT NULL,
    major_kpi DECIMAL(12, 2) NOT NULL DEFAULT 0,
    rating_factor DECIMAL(4, 2) NOT NULL DEFAULT 0.85,
    kpi_bonus DECIMAL(15, 2) NOT NULL DEFAULT 0,
    work_hour_kpi_bonus DECIMAL(15, 2),
    vas_kpi_bonus DECIMAL(15, 2),
    kpi_allowance DECIMAL(15, 2),
    penalty DECIMAL(15, 2) DEFAULT 0,
    calculation_version VARCHAR(20) DEFAULT 'v2.0',
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    applied_to_payroll BOOLEAN DEFAULT FALSE,
    applied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_payroll_bridge_staff UNIQUE (warehouse_code, payroll_period, staff_id)
);

-- Warehouse Productivity Daily (if not exists)
CREATE TABLE IF NOT EXISTS warehouse_productivity_daily (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50) NOT NULL,
    warehouse_name VARCHAR(200),
    staff_id VARCHAR(50) NOT NULL,
    staff_name VARCHAR(200),
    date DATE NOT NULL,
    packing_point DECIMAL(12, 2) DEFAULT 0,
    packing_quantity INTEGER DEFAULT 0,
    picking_point DECIMAL(12, 2) DEFAULT 0,
    picking_quantity INTEGER DEFAULT 0,
    handover_point DECIMAL(12, 2) DEFAULT 0,
    handover_quantity INTEGER DEFAULT 0,
    putaway_point DECIMAL(12, 2) DEFAULT 0,
    putaway_quantity INTEGER DEFAULT 0,
    inspection_point DECIMAL(12, 2) DEFAULT 0,
    inspection_quantity INTEGER DEFAULT 0,
    co_inspection_point DECIMAL(12, 2) DEFAULT 0,
    co_inspection_quantity INTEGER DEFAULT 0,
    data_entry_point DECIMAL(12, 2) DEFAULT 0,
    data_entry_quantity INTEGER DEFAULT 0,
    unloading_point DECIMAL(12, 2) DEFAULT 0,
    unloading_cbm DECIMAL(10, 2) DEFAULT 0,
    move_point DECIMAL(12, 2) DEFAULT 0,
    move_quantity INTEGER DEFAULT 0,
    cycle_count_point DECIMAL(12, 2) DEFAULT 0,
    cycle_count_quantity INTEGER DEFAULT 0,
    relabel_point DECIMAL(12, 2) DEFAULT 0,
    relabel_quantity INTEGER DEFAULT 0,
    total_point DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_productivity_daily UNIQUE (warehouse_code, staff_id, date)
);

-- Payroll Monthly (if not exists)
CREATE TABLE IF NOT EXISTS payroll_monthly (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50) NOT NULL,
    staff_id VARCHAR(50) NOT NULL,
    staff_name VARCHAR(200),
    payroll_period VARCHAR(7) NOT NULL,
    role INTEGER,
    role_name VARCHAR(100),
    work_hour DECIMAL(8, 2),
    actual_workdays INTEGER,
    status VARCHAR(50),
    major_kpi DECIMAL(12, 2),
    rating_factor DECIMAL(4, 2),
    kpi_bonus DECIMAL(15, 2),
    penalty DECIMAL(15, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_payroll_monthly UNIQUE (warehouse_code, staff_id, payroll_period)
);
`

// ORS Catalog seed data
const ORS_CATALOG_DATA = [
  // Packing
  { ors_code: 'PACK-001', job_group: 'packing', name: 'Đóng gói thiếu/sai vật liệu chèn lót', description: 'Không sử dụng đủ giấy chèn/xốp nổ cho hàng dễ vỡ hoặc hàng điện tử', severity_level: 'S2', ors_points: 3 },
  { ors_code: 'PACK-002', job_group: 'packing', name: 'Không seal chất lỏng/mỹ phẩm', description: 'Không chèn/quấn vòi, nắp chai lọ mỹ phẩm, chất lỏng dẫn đến rò rỉ', severity_level: 'S3', ors_points: 6 },
  { ors_code: 'PACK-003', job_group: 'packing', name: 'Sử dụng hộp cũ/hư hỏng', description: 'Sử dụng hộp đã qua sử dụng, móp méo, không có logo theo quy định', severity_level: 'S1', ors_points: 2 },
  { ors_code: 'PACK-004', job_group: 'packing', name: 'Đóng gói sai hàng/thiếu hàng', description: 'Đóng gói không đúng sản phẩm hoặc số lượng so với đơn hàng', severity_level: 'S3', ors_points: 8 },
  { ors_code: 'PACK-005', job_group: 'packing', name: 'Trễ cam kết đóng gói (SLA)', description: 'Không hoàn thành đóng gói trong thời gian quy định', severity_level: 'S2', ors_points: 4 },
  // Picking
  { ors_code: 'PICK-001', job_group: 'picking', name: 'Lấy sai sản phẩm (Sai SKU)', description: 'Lấy nhầm sản phẩm do không kiểm tra kỹ Barcode/SKU', severity_level: 'S2', ors_points: 5 },
  { ors_code: 'PICK-002', job_group: 'picking', name: 'Báo cáo thiếu hàng sai (Hàng ảo)', description: 'Xác nhận thiếu hàng nhưng thực tế hàng vẫn còn', severity_level: 'S3', ors_points: 7 },
  { ors_code: 'PICK-003', job_group: 'picking', name: 'Lấy hàng cận date sai chiến lược', description: 'Không tuân thủ FEFO', severity_level: 'S3', ors_points: 6 },
  // Handover
  { ors_code: 'HAND-001', job_group: 'handover', name: 'Bàn giao sai hãng vận chuyển', description: 'Phân loại sai hãng vận chuyển', severity_level: 'S3', ors_points: 6 },
  { ors_code: 'HAND-002', job_group: 'handover', name: 'Thiếu biên bản/chữ ký (POD)', description: 'Bàn giao hàng không có biên bản hoặc chữ ký', severity_level: 'S3', ors_points: 8 },
  { ors_code: 'HAND-003', job_group: 'handover', name: 'Bàn giao trễ (Miss cutoff)', description: 'Không kịp bàn giao trong khung giờ quy định', severity_level: 'S2', ors_points: 5 },
  // Putaway
  { ors_code: 'PUT-001', job_group: 'putaway', name: 'Để hàng trực tiếp dưới sàn', description: 'Vi phạm quy chuẩn lưu kho', severity_level: 'S3', ors_points: 7 },
  { ors_code: 'PUT-002', job_group: 'putaway', name: 'Lưu kho chung lô hạn khác nhau', description: 'Để lẫn hàng có Date khác nhau', severity_level: 'S2', ors_points: 4 },
  { ors_code: 'PUT-003', job_group: 'putaway', name: 'Sắp xếp sai chiều quy định', description: 'Đặt hàng sai chiều gây hư hỏng', severity_level: 'S2', ors_points: 3 },
  { ors_code: 'PUT-004', job_group: 'putaway', name: 'Không tháo bao bì bảo quản tạm', description: 'Không tuân thủ quy chuẩn bọc plastic', severity_level: 'S1', ors_points: 2 },
  // Inspection
  { ors_code: 'INSP-001', job_group: 'inspection', name: 'Bỏ sót lỗi ngoại quan (QC sai)', description: 'Nhập kho hàng hư hỏng không phát hiện', severity_level: 'S3', ors_points: 6 },
  { ors_code: 'INSP-002', job_group: 'inspection', name: 'Nhập hàng cận date không cảnh báo', description: 'Nhập hàng HSD dưới 6 tháng không xác nhận', severity_level: 'S3', ors_points: 7 },
  { ors_code: 'INSP-003', job_group: 'inspection', name: 'Không kiểm tra niêm phong/Seal', description: 'Hàng giá trị cao không kiểm tra seal', severity_level: 'S4', ors_points: 12 },
  // Co-inspection
  { ors_code: 'COIN-001', job_group: 'co_inspection', name: 'Thiếu bằng chứng đồng kiểm', description: 'Không chụp ảnh/quay video đồng kiểm', severity_level: 'S3', ors_points: 8 },
  { ors_code: 'COIN-002', job_group: 'co_inspection', name: 'Ký nhận sai số lượng thực tế', description: 'Xác nhận sai số lượng trên biên bản', severity_level: 'S3', ors_points: 9 },
  // Data Entry
  { ors_code: 'DATA-001', job_group: 'data_entry', name: 'Nhập sai kích thước/trọng lượng', description: 'Nhập sai DIM gây tính sai phí', severity_level: 'S3', ors_points: 6 },
  { ors_code: 'DATA-002', job_group: 'data_entry', name: 'Nhập sai hạn sử dụng', description: 'Cập nhật sai Expiry Date', severity_level: 'S3', ors_points: 7 },
  { ors_code: 'DATA-003', job_group: 'data_entry', name: 'Sai thông tin kiện hàng', description: 'Nhập sai số lượng hoặc mã kiện', severity_level: 'S2', ors_points: 4 },
  // Unloading
  { ors_code: 'UNLD-001', job_group: 'unloading', name: 'Làm hư hỏng hàng khi hạ tải', description: 'Thao tác ẩu làm rơi vỡ hàng', severity_level: 'S3', ors_points: 8 },
  { ors_code: 'UNLD-002', job_group: 'unloading', name: 'Không sử dụng thiết bị chuyên dụng', description: 'Bê vác tay hàng nặng thay vì dùng xe nâng', severity_level: 'S4', ors_points: 15 },
  // Move
  { ors_code: 'MOVE-001', job_group: 'move', name: 'Vận chuyển không che chắn/cố định', description: 'Không quấn PE hoặc cố định hàng', severity_level: 'S2', ors_points: 5 },
  { ors_code: 'MOVE-002', job_group: 'move', name: 'Làm rơi/móp méo hàng nội bộ', description: 'Gây hư hỏng khi di chuyển trong kho', severity_level: 'S3', ors_points: 6 },
  // Cycle Count
  { ors_code: 'CYCL-001', job_group: 'cycle_count', name: 'Sai lệch số lượng kiểm kê', description: 'Báo cáo số lượng tồn kho sai', severity_level: 'S3', ors_points: 7 },
  { ors_code: 'CYCL-002', job_group: 'cycle_count', name: 'Bỏ sót vị trí/SKU', description: 'Không kiểm đếm hết các sản phẩm', severity_level: 'S2', ors_points: 4 },
  // Relabel
  { ors_code: 'RLAB-001', job_group: 'relabel', name: 'Dán đè thông tin gốc', description: 'Dán tem che khuất nhãn gốc', severity_level: 'S3', ors_points: 8 },
  { ors_code: 'RLAB-002', job_group: 'relabel', name: 'Dán sai vị trí quy định', description: 'Dán tem không đúng vị trí', severity_level: 'S1', ors_points: 2 },
  { ors_code: 'RLAB-003', job_group: 'relabel', name: 'Không dán nhãn Combo/Set', description: 'Không dán "Không tách lẻ" cho hàng combo', severity_level: 'S3', ors_points: 7 },
  { ors_code: 'RLAB-004', job_group: 'relabel', name: 'Tem nhãn mờ/nhăn/rách', description: 'Tem in mờ không đọc được', severity_level: 'S1', ors_points: 2 },
]

// Config seed data
const RANKING_CONFIG_DATA = [
  { pph_min: 50, pph_max: 999999, ranking_score: 5, min_weekly_hours: 20 },
  { pph_min: 40, pph_max: 49.99, ranking_score: 4, min_weekly_hours: 20 },
  { pph_min: 30, pph_max: 39.99, ranking_score: 3, min_weekly_hours: 20 },
  { pph_min: 20, pph_max: 29.99, ranking_score: 2, min_weekly_hours: 20 },
  { pph_min: 0, pph_max: 19.99, ranking_score: 1, min_weekly_hours: 20 },
]

const ROLE_TASK_CONFIG_DATA = [
  { role: 'Packer', main_task: 'packing' },
  { role: 'Picker', main_task: 'picking' },
  { role: 'Putaway Staff', main_task: 'putaway' },
  { role: 'Inspector', main_task: 'inspection' },
  { role: 'Data Entry', main_task: 'data_entry' },
  { role: 'Handover Staff', main_task: 'handover' },
  { role: 'Unloader', main_task: 'unloading' },
  { role: 'Mover', main_task: 'move' },
  { role: 'Cycle Counter', main_task: 'cycle_count' },
  { role: 'Relabeler', main_task: 'relabel' },
  { role: 'Co-Inspector', main_task: 'co_inspection' },
]

const BONUS_CONFIG_DATA = [
  { country: 'VN', calculation_type: 'PER_POINT', amount_per_point: 1000, currency: 'VND', ranking_score_min: 1, ranking_score_max: 5 },
  { country: 'TH', calculation_type: 'PER_POINT', amount_per_point: 5, currency: 'THB', ranking_score_min: 1, ranking_score_max: 5 },
  { country: 'PH', calculation_type: 'PER_POINT', amount_per_point: 10, currency: 'PHP', ranking_score_min: 1, ranking_score_max: 5 },
  { country: 'ID', calculation_type: 'PER_POINT', amount_per_point: 500, currency: 'IDR', ranking_score_min: 1, ranking_score_max: 5 },
  { country: 'MY', calculation_type: 'PER_POINT', amount_per_point: 0.5, currency: 'MYR', ranking_score_min: 1, ranking_score_max: 5 },
]

const MILESTONE_CONFIG_DATA = [
  { ors_points_from: 0, ors_points_to: 9, milestone_level: 'GREEN', action_type: 'NO_ACTION', penalty_rate: 0, description: 'Bình thường' },
  { ors_points_from: 10, ors_points_to: 19, milestone_level: 'YELLOW', action_type: 'WARNING', penalty_rate: 0, description: 'Cảnh báo' },
  { ors_points_from: 20, ors_points_to: 29, milestone_level: 'ORANGE', action_type: 'TRAINING_REQUIRED', penalty_rate: 0.10, description: 'Cần cải thiện - Giảm 10% bonus' },
  { ors_points_from: 30, ors_points_to: 39, milestone_level: 'RED', action_type: 'HR_REVIEW', penalty_rate: 0.30, description: 'Nghiêm trọng - Giảm 30% bonus' },
  { ors_points_from: 40, ors_points_to: 999999, milestone_level: 'CRITICAL', action_type: 'DISCIPLINARY', penalty_rate: 1.00, description: 'Mất toàn bộ bonus' },
]

// Setup endpoint
setup.post('/init', async (c) => {
  const supabase = createSupabaseClient()
  const results: any = { tables: [], seed: [] }
  const errors: string[] = []

  try {
    // Check if tables exist by trying to select from ors_catalog
    const { error: checkError } = await supabase.from('ors_catalog').select('id').limit(1)
    
    if (checkError && checkError.code === '42P01') {
      // Tables don't exist - need to create via SQL Editor
      return c.json({
        success: false,
        message: 'Tables do not exist. Please run database/schema.sql in Supabase SQL Editor first.',
        instructions: [
          '1. Open https://supabase.com/dashboard/project/jubwnkwqkqsmexcyrark',
          '2. Go to SQL Editor',
          '3. Copy contents of database/schema.sql',
          '4. Click Run',
          '5. Come back and call /api/setup/seed'
        ]
      })
    }

    // Tables exist, check if already seeded
    const { data: existingOrs } = await supabase.from('ors_catalog').select('id').limit(1)
    
    if (existingOrs && existingOrs.length > 0) {
      return c.json({
        success: true,
        message: 'Database already initialized with seed data',
        tables_exist: true,
        seed_exists: true
      })
    }

    // Tables exist but no seed data - seed them
    return c.redirect('/api/setup/seed')

  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Seed data endpoint
setup.post('/seed', async (c) => {
  const supabase = createSupabaseClient()
  const results: any = {}
  const errors: string[] = []

  try {
    // Seed ORS Catalog
    const { error: orsCatalogError } = await supabase
      .from('ors_catalog')
      .upsert(ORS_CATALOG_DATA.map(d => ({ ...d, is_active: true })), { onConflict: 'ors_code' })
    
    if (orsCatalogError) {
      errors.push(`ors_catalog: ${orsCatalogError.message}`)
    } else {
      results.ors_catalog = ORS_CATALOG_DATA.length
    }

    // Seed Ranking Config
    const { error: rankingError } = await supabase
      .from('ranking_range_config')
      .upsert(RANKING_CONFIG_DATA.map(d => ({ ...d, is_active: true })))
    
    if (rankingError) {
      errors.push(`ranking_range_config: ${rankingError.message}`)
    } else {
      results.ranking_range_config = RANKING_CONFIG_DATA.length
    }

    // Seed Role Task Config
    const { error: roleError } = await supabase
      .from('role_main_task_config')
      .upsert(ROLE_TASK_CONFIG_DATA.map(d => ({ ...d, is_active: true })))
    
    if (roleError) {
      errors.push(`role_main_task_config: ${roleError.message}`)
    } else {
      results.role_main_task_config = ROLE_TASK_CONFIG_DATA.length
    }

    // Seed Bonus Config
    const { error: bonusError } = await supabase
      .from('kpi_bonus_config')
      .upsert(BONUS_CONFIG_DATA.map(d => ({ ...d, is_active: true })))
    
    if (bonusError) {
      errors.push(`kpi_bonus_config: ${bonusError.message}`)
    } else {
      results.kpi_bonus_config = BONUS_CONFIG_DATA.length
    }

    // Seed Milestone Config
    const { error: milestoneError } = await supabase
      .from('ors_milestone_config')
      .upsert(MILESTONE_CONFIG_DATA.map(d => ({ ...d, is_active: true })))
    
    if (milestoneError) {
      errors.push(`ors_milestone_config: ${milestoneError.message}`)
    } else {
      results.ors_milestone_config = MILESTONE_CONFIG_DATA.length
    }

    return c.json({
      success: errors.length === 0,
      message: errors.length === 0 ? 'Seed data inserted successfully' : 'Some errors occurred',
      results,
      errors
    })

  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Generate sample data for testing
setup.post('/sample-data', async (c) => {
  const supabase = createSupabaseClient()
  const warehouseCode = 'BMVN_HCM_TP'
  const warehouseName = 'Boxme T.Tạo'
  const payrollPeriod = new Date().toISOString().slice(0, 7) // Current month

  // Generate dates for current month
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Sample staff
  const staff = [
    { id: 'NV001', name: 'Nguyễn Văn A', role: 'Packer', role_id: 5 },
    { id: 'NV002', name: 'Trần Thị B', role: 'Picker', role_id: 4 },
    { id: 'NV003', name: 'Lê Văn C', role: 'Packer', role_id: 5 },
    { id: 'NV004', name: 'Phạm Thị D', role: 'Inspector', role_id: 3 },
    { id: 'NV005', name: 'Hoàng Văn E', role: 'Putaway Staff', role_id: 6 },
    { id: 'NV006', name: 'Vũ Thị F', role: 'Packer', role_id: 5 },
    { id: 'NV007', name: 'Đặng Văn G', role: 'Picker', role_id: 4 },
    { id: 'NV008', name: 'Bùi Thị H', role: 'Data Entry', role_id: 7 },
    { id: 'NV009', name: 'Ngô Văn I', role: 'Handover Staff', role_id: 8 },
    { id: 'NV010', name: 'Dương Thị K', role: 'Packer', role_id: 5 },
  ]

  const errors: string[] = []
  const results: any = {}

  try {
    // 1. Generate daily productivity data
    const productivityData: any[] = []
    
    for (const s of staff) {
      // Work 20-26 days per month
      const workDays = Math.floor(Math.random() * 7) + 20
      const workedDates = new Set<number>()
      
      while (workedDates.size < Math.min(workDays, daysInMonth)) {
        const day = Math.floor(Math.random() * daysInMonth) + 1
        workedDates.add(day)
      }

      for (const day of workedDates) {
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        
        // Generate points based on role
        let packingPoint = 0, packingQty = 0
        let pickingPoint = 0, pickingQty = 0
        let inspectionPoint = 0, inspectionQty = 0
        let putawayPoint = 0, putawayQty = 0
        let dataEntryPoint = 0, dataEntryQty = 0
        let handoverPoint = 0, handoverQty = 0

        if (s.role === 'Packer') {
          packingQty = Math.floor(Math.random() * 100) + 80
          packingPoint = packingQty * (Math.random() * 0.5 + 1.2) // 1.2-1.7 points per item
        } else if (s.role === 'Picker') {
          pickingQty = Math.floor(Math.random() * 150) + 100
          pickingPoint = pickingQty * (Math.random() * 0.3 + 0.8) // 0.8-1.1 points per item
        } else if (s.role === 'Inspector') {
          inspectionQty = Math.floor(Math.random() * 80) + 50
          inspectionPoint = inspectionQty * (Math.random() * 0.4 + 1.0)
        } else if (s.role === 'Putaway Staff') {
          putawayQty = Math.floor(Math.random() * 120) + 80
          putawayPoint = putawayQty * (Math.random() * 0.3 + 0.7)
        } else if (s.role === 'Data Entry') {
          dataEntryQty = Math.floor(Math.random() * 200) + 150
          dataEntryPoint = dataEntryQty * (Math.random() * 0.2 + 0.5)
        } else if (s.role === 'Handover Staff') {
          handoverQty = Math.floor(Math.random() * 100) + 60
          handoverPoint = handoverQty * (Math.random() * 0.4 + 0.8)
        }

        const totalPoint = packingPoint + pickingPoint + inspectionPoint + putawayPoint + dataEntryPoint + handoverPoint

        productivityData.push({
          warehouse_code: warehouseCode,
          warehouse_name: warehouseName,
          staff_id: s.id,
          staff_name: s.name,
          date,
          packing_point: Math.round(packingPoint * 100) / 100,
          packing_quantity: packingQty,
          picking_point: Math.round(pickingPoint * 100) / 100,
          picking_quantity: pickingQty,
          inspection_point: Math.round(inspectionPoint * 100) / 100,
          inspection_quantity: inspectionQty,
          putaway_point: Math.round(putawayPoint * 100) / 100,
          putaway_quantity: putawayQty,
          data_entry_point: Math.round(dataEntryPoint * 100) / 100,
          data_entry_quantity: dataEntryQty,
          handover_point: Math.round(handoverPoint * 100) / 100,
          handover_quantity: handoverQty,
          total_point: Math.round(totalPoint * 100) / 100,
        })
      }
    }

    // Insert productivity data
    const { error: prodError } = await supabase
      .from('warehouse_productivity_daily')
      .upsert(productivityData, { onConflict: 'warehouse_code,staff_id,date' })

    if (prodError) {
      errors.push(`productivity: ${prodError.message}`)
    } else {
      results.warehouse_productivity_daily = productivityData.length
    }

    // 2. Generate payroll data
    const payrollData = staff.map(s => {
      const workDays = productivityData.filter(p => p.staff_id === s.id).length
      return {
        warehouse_code: warehouseCode,
        staff_id: s.id,
        staff_name: s.name,
        payroll_period: payrollPeriod,
        role: s.role_id,
        role_name: s.role,
        work_hour: workDays * 8,
        actual_workdays: workDays,
        status: 'ACTIVE',
      }
    })

    const { error: payrollError } = await supabase
      .from('payroll_monthly')
      .upsert(payrollData, { onConflict: 'warehouse_code,staff_id,payroll_period' })

    if (payrollError) {
      errors.push(`payroll: ${payrollError.message}`)
    } else {
      results.payroll_monthly = payrollData.length
    }

    // 3. Generate some ORS events
    const orsEvents = [
      { staff_id: 'NV003', ors_code: 'PACK-001', event_date: `${payrollPeriod}-05`, description: 'Thiếu xốp chèn cho hàng điện tử' },
      { staff_id: 'NV003', ors_code: 'PACK-005', event_date: `${payrollPeriod}-12`, description: 'Đóng gói trễ 2 tiếng' },
      { staff_id: 'NV002', ors_code: 'PICK-001', event_date: `${payrollPeriod}-08`, description: 'Lấy sai SKU cho đơn #12345' },
      { staff_id: 'NV005', ors_code: 'PUT-002', event_date: `${payrollPeriod}-15`, description: 'Để lẫn hàng có date khác nhau' },
    ]

    // Get ORS points from catalog
    const { data: catalog } = await supabase.from('ors_catalog').select('ors_code, ors_points')
    const catalogMap = new Map(catalog?.map(c => [c.ors_code, c.ors_points]) || [])

    const orsData = orsEvents.map(e => ({
      warehouse_code: warehouseCode,
      staff_id: e.staff_id,
      staff_name: staff.find(s => s.id === e.staff_id)?.name,
      event_date: e.event_date,
      ors_code: e.ors_code,
      ors_points: catalogMap.get(e.ors_code) || 0,
      description: e.description,
      reported_by: 'System',
      status: 'CONFIRMED',
    }))

    const { error: orsError } = await supabase.from('ors_event').insert(orsData)

    if (orsError) {
      errors.push(`ors_event: ${orsError.message}`)
    } else {
      results.ors_event = orsData.length
    }

    return c.json({
      success: errors.length === 0,
      message: 'Sample data generated for ' + warehouseCode,
      payroll_period: payrollPeriod,
      results,
      errors,
      next_step: 'Call POST /api/jobs/run-pipeline to calculate KPI'
    })

  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Check database status
setup.get('/status', async (c) => {
  const supabase = createSupabaseClient()
  const tables = [
    'ors_catalog',
    'ranking_range_config', 
    'role_main_task_config',
    'kpi_bonus_config',
    'ors_milestone_config',
    'warehouse_productivity_daily',
    'payroll_monthly',
    'kpi_weekly_summary',
    'ranking_weekly_result',
    'ors_event',
    'ors_monthly_summary',
    'kpi_monthly_summary',
    'payroll_kpi_bridge',
  ]

  const status: any = {}

  for (const table of tables) {
    try {
      const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
      status[table] = error ? { error: error.message } : { count: count || 0 }
    } catch (e) {
      status[table] = { error: 'Table does not exist' }
    }
  }

  const allExist = Object.values(status).every((s: any) => !s.error)
  const hasData = Object.values(status).some((s: any) => s.count > 0)

  return c.json({
    success: true,
    database_ready: allExist,
    has_data: hasData,
    tables: status,
    setup_steps: !allExist ? [
      '1. Run database/schema.sql in Supabase SQL Editor',
      '2. Call POST /api/setup/seed to insert config data',
      '3. Call POST /api/setup/sample-data to generate test data',
      '4. Call POST /api/jobs/run-pipeline to calculate KPI',
    ] : hasData ? ['Database is ready!'] : [
      '1. Call POST /api/setup/seed to insert config data',
      '2. Call POST /api/setup/sample-data to generate test data', 
      '3. Call POST /api/jobs/run-pipeline to calculate KPI',
    ]
  })
})

export default setup
