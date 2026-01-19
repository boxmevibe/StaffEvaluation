-- ============================================================
-- KPI WAREHOUSE MANAGEMENT SYSTEM - DATABASE SCHEMA
-- Version: 1.0
-- Date: 2025-01-19
-- ============================================================

-- ============================================================
-- CONFIG TABLES
-- ============================================================

-- Role to Main Task Mapping
CREATE TABLE IF NOT EXISTS role_main_task_config (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50), -- NULL = apply to all warehouses
    role VARCHAR(100) NOT NULL,
    role_id INTEGER,
    main_task VARCHAR(50) NOT NULL CHECK (main_task IN (
        'packing', 'picking', 'handover', 'putaway', 'inspection',
        'co_inspection', 'data_entry', 'unloading', 'move', 'cycle_count', 'relabel'
    )),
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_role_main_task_warehouse ON role_main_task_config(warehouse_code);
CREATE INDEX idx_role_main_task_role ON role_main_task_config(role);
CREATE INDEX idx_role_main_task_active ON role_main_task_config(is_active, effective_from, effective_to);

-- Ranking Range Configuration
CREATE TABLE IF NOT EXISTS ranking_range_config (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50), -- NULL = global default
    role VARCHAR(100),
    main_task VARCHAR(50),
    pph_min DECIMAL(10, 2) NOT NULL,
    pph_max DECIMAL(10, 2) NOT NULL,
    ranking_score INTEGER NOT NULL CHECK (ranking_score BETWEEN 1 AND 5),
    min_weekly_hours DECIMAL(6, 2) DEFAULT 20,
    min_weekly_points DECIMAL(10, 2),
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_pph_range CHECK (pph_min <= pph_max)
);

CREATE INDEX idx_ranking_range_warehouse ON ranking_range_config(warehouse_code);
CREATE INDEX idx_ranking_range_active ON ranking_range_config(is_active, effective_from, effective_to);

-- KPI Bonus Configuration
CREATE TABLE IF NOT EXISTS kpi_bonus_config (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50),
    country VARCHAR(10),
    ranking_score_min INTEGER NOT NULL CHECK (ranking_score_min BETWEEN 1 AND 5),
    ranking_score_max INTEGER NOT NULL CHECK (ranking_score_max BETWEEN 1 AND 5),
    calculation_type VARCHAR(20) NOT NULL CHECK (calculation_type IN ('PER_POINT', 'FIXED')),
    amount_per_point DECIMAL(15, 2),
    fixed_amount DECIMAL(15, 2),
    cap_amount DECIMAL(15, 2),
    currency VARCHAR(10) NOT NULL DEFAULT 'VND',
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_ranking_range CHECK (ranking_score_min <= ranking_score_max)
);

CREATE INDEX idx_kpi_bonus_warehouse ON kpi_bonus_config(warehouse_code);
CREATE INDEX idx_kpi_bonus_country ON kpi_bonus_config(country);
CREATE INDEX idx_kpi_bonus_active ON kpi_bonus_config(is_active, effective_from, effective_to);

-- ORS Catalog (Violation Types)
CREATE TABLE IF NOT EXISTS ors_catalog (
    id BIGSERIAL PRIMARY KEY,
    ors_code VARCHAR(20) UNIQUE NOT NULL,
    job_group VARCHAR(50) NOT NULL CHECK (job_group IN (
        'packing', 'picking', 'handover', 'putaway', 'inspection',
        'co_inspection', 'data_entry', 'unloading', 'move', 'cycle_count', 'relabel'
    )),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    severity_level VARCHAR(5) NOT NULL CHECK (severity_level IN ('S1', 'S2', 'S3', 'S4', 'S5')),
    ors_points INTEGER NOT NULL CHECK (ors_points > 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ors_catalog_code ON ors_catalog(ors_code);
CREATE INDEX idx_ors_catalog_group ON ors_catalog(job_group);
CREATE INDEX idx_ors_catalog_severity ON ors_catalog(severity_level);

-- ORS Milestone Configuration
CREATE TABLE IF NOT EXISTS ors_milestone_config (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50), -- NULL = global
    ors_points_from INTEGER NOT NULL,
    ors_points_to INTEGER NOT NULL,
    milestone_level VARCHAR(20) NOT NULL CHECK (milestone_level IN ('GREEN', 'YELLOW', 'ORANGE', 'RED', 'CRITICAL')),
    action_type VARCHAR(200),
    penalty_rate DECIMAL(5, 4) NOT NULL DEFAULT 0 CHECK (penalty_rate BETWEEN 0 AND 1),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_points_range CHECK (ors_points_from <= ors_points_to)
);

CREATE INDEX idx_ors_milestone_warehouse ON ors_milestone_config(warehouse_code);
CREATE INDEX idx_ors_milestone_active ON ors_milestone_config(is_active);

-- ============================================================
-- FACT/RESULT TABLES
-- ============================================================

-- KPI Weekly Summary
CREATE TABLE IF NOT EXISTS kpi_weekly_summary (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50) NOT NULL,
    warehouse_name VARCHAR(200),
    staff_id VARCHAR(50) NOT NULL,
    staff_name VARCHAR(200),
    role VARCHAR(100),
    year_week VARCHAR(10) NOT NULL, -- Format: YYYY-Www (e.g., 2025-W03)
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    payroll_period VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    main_task VARCHAR(50),
    main_task_points DECIMAL(12, 2) NOT NULL DEFAULT 0,
    main_task_quantity DECIMAL(12, 2),
    task_points_detail JSONB DEFAULT '{}',
    total_points DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total_quantity DECIMAL(12, 2),
    estimated_work_hours DECIMAL(8, 2) NOT NULL DEFAULT 0,
    working_days INTEGER DEFAULT 0,
    pph DECIMAL(10, 4) NOT NULL DEFAULT 0, -- Points Per Hour
    data_status VARCHAR(30) DEFAULT 'OK' CHECK (data_status IN ('OK', 'INSUFFICIENT_HOURS', 'NO_DATA', 'PARTIAL_DATA')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT uq_kpi_weekly_staff UNIQUE (warehouse_code, staff_id, year_week)
);

CREATE INDEX idx_kpi_weekly_warehouse ON kpi_weekly_summary(warehouse_code);
CREATE INDEX idx_kpi_weekly_staff ON kpi_weekly_summary(staff_id);
CREATE INDEX idx_kpi_weekly_yearweek ON kpi_weekly_summary(year_week);
CREATE INDEX idx_kpi_weekly_period ON kpi_weekly_summary(payroll_period);

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
    ranking_score INTEGER NOT NULL CHECK (ranking_score BETWEEN 1 AND 5),
    ranking_config_id BIGINT REFERENCES ranking_range_config(id),
    status VARCHAR(30) DEFAULT 'FINAL' CHECK (status IN ('FINAL', 'INSUFFICIENT_DATA', 'PENDING_REVIEW', 'ADJUSTED')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT uq_ranking_weekly_staff UNIQUE (warehouse_code, staff_id, year_week)
);

CREATE INDEX idx_ranking_weekly_warehouse ON ranking_weekly_result(warehouse_code);
CREATE INDEX idx_ranking_weekly_staff ON ranking_weekly_result(staff_id);
CREATE INDEX idx_ranking_weekly_yearweek ON ranking_weekly_result(year_week);
CREATE INDEX idx_ranking_weekly_score ON ranking_weekly_result(ranking_score);

-- ORS Event
CREATE TABLE IF NOT EXISTS ors_event (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50) NOT NULL,
    staff_id VARCHAR(50) NOT NULL,
    staff_name VARCHAR(200),
    event_date DATE NOT NULL,
    event_time TIME,
    ors_code VARCHAR(20) NOT NULL REFERENCES ors_catalog(ors_code),
    ors_points INTEGER NOT NULL, -- Snapshot at creation time
    description TEXT,
    evidence_urls JSONB DEFAULT '[]',
    reported_by VARCHAR(100) NOT NULL,
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CONFIRMED', 'REJECTED', 'ADJUSTED')),
    rejection_reason TEXT,
    original_ors_code VARCHAR(20), -- If adjusted from another code
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ors_event_warehouse ON ors_event(warehouse_code);
CREATE INDEX idx_ors_event_staff ON ors_event(staff_id);
CREATE INDEX idx_ors_event_date ON ors_event(event_date);
CREATE INDEX idx_ors_event_status ON ors_event(status);
CREATE INDEX idx_ors_event_code ON ors_event(ors_code);

-- ORS Monthly Summary
CREATE TABLE IF NOT EXISTS ors_monthly_summary (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50) NOT NULL,
    staff_id VARCHAR(50) NOT NULL,
    staff_name VARCHAR(200),
    payroll_period VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    ors_points_total INTEGER NOT NULL DEFAULT 0,
    event_count INTEGER NOT NULL DEFAULT 0,
    events_detail JSONB DEFAULT '[]',
    milestone_level VARCHAR(20) DEFAULT 'GREEN' CHECK (milestone_level IN ('GREEN', 'YELLOW', 'ORANGE', 'RED', 'CRITICAL')),
    penalty_rate DECIMAL(5, 4) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT uq_ors_monthly_staff UNIQUE (warehouse_code, staff_id, payroll_period)
);

CREATE INDEX idx_ors_monthly_warehouse ON ors_monthly_summary(warehouse_code);
CREATE INDEX idx_ors_monthly_staff ON ors_monthly_summary(staff_id);
CREATE INDEX idx_ors_monthly_period ON ors_monthly_summary(payroll_period);
CREATE INDEX idx_ors_monthly_milestone ON ors_monthly_summary(milestone_level);

-- KPI Monthly Summary
CREATE TABLE IF NOT EXISTS kpi_monthly_summary (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(50) NOT NULL,
    warehouse_name VARCHAR(200),
    staff_id VARCHAR(50) NOT NULL,
    staff_name VARCHAR(200),
    role VARCHAR(100),
    payroll_period VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    major_kpi DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total_kpi_points DECIMAL(12, 2) NOT NULL DEFAULT 0,
    task_points_monthly JSONB DEFAULT '{}',
    weekly_rankings JSONB DEFAULT '[]',
    avg_ranking_score DECIMAL(4, 2) NOT NULL DEFAULT 0,
    final_ranking_score INTEGER NOT NULL DEFAULT 3 CHECK (final_ranking_score BETWEEN 1 AND 5),
    rating_factor DECIMAL(4, 2) NOT NULL DEFAULT 0.85,
    kpi_bonus_calculated DECIMAL(15, 2) NOT NULL DEFAULT 0,
    ors_points_total INTEGER NOT NULL DEFAULT 0,
    ors_penalty_rate DECIMAL(5, 4) NOT NULL DEFAULT 0,
    kpi_bonus_final DECIMAL(15, 2) NOT NULL DEFAULT 0,
    actual_workdays INTEGER,
    work_hours DECIMAL(8, 2),
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'CALCULATED', 'REVIEWED', 'FINAL', 'LOCKED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT uq_kpi_monthly_staff UNIQUE (warehouse_code, staff_id, payroll_period)
);

CREATE INDEX idx_kpi_monthly_warehouse ON kpi_monthly_summary(warehouse_code);
CREATE INDEX idx_kpi_monthly_staff ON kpi_monthly_summary(staff_id);
CREATE INDEX idx_kpi_monthly_period ON kpi_monthly_summary(payroll_period);
CREATE INDEX idx_kpi_monthly_status ON kpi_monthly_summary(status);
CREATE INDEX idx_kpi_monthly_ranking ON kpi_monthly_summary(final_ranking_score);

-- ============================================================
-- OUTPUT TABLE
-- ============================================================

-- Payroll KPI Bridge (for updating payroll_monthly)
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

CREATE INDEX idx_payroll_bridge_warehouse ON payroll_kpi_bridge(warehouse_code);
CREATE INDEX idx_payroll_bridge_period ON payroll_kpi_bridge(payroll_period);
CREATE INDEX idx_payroll_bridge_staff ON payroll_kpi_bridge(staff_id);
CREATE INDEX idx_payroll_bridge_applied ON payroll_kpi_bridge(applied_to_payroll);

-- ============================================================
-- TRIGGER FOR updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN (
            'role_main_task_config', 'ranking_range_config', 'kpi_bonus_config',
            'ors_catalog', 'ors_milestone_config', 'kpi_weekly_summary',
            'ranking_weekly_result', 'ors_event', 'ors_monthly_summary',
            'kpi_monthly_summary', 'payroll_kpi_bridge'
        )
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END;
$$;

-- ============================================================
-- SEED DATA: ORS CATALOG (32 Violation Types)
-- ============================================================

INSERT INTO ors_catalog (ors_code, job_group, name, description, severity_level, ors_points) VALUES
-- Packing (5)
('PACK-001', 'packing', 'Đóng gói thiếu/sai vật liệu chèn lót', 'Không sử dụng đủ giấy chèn/xốp nổ cho hàng dễ vỡ hoặc hàng điện tử, gây nguy cơ bể vỡ trong vận chuyển', 'S2', 3),
('PACK-002', 'packing', 'Không seal chất lỏng/mỹ phẩm', 'Không chèn/quấn vòi, nắp chai lọ mỹ phẩm, chất lỏng dẫn đến rò rỉ', 'S3', 6),
('PACK-003', 'packing', 'Sử dụng hộp cũ/hư hỏng', 'Sử dụng hộp đã qua sử dụng, móp méo, không có logo theo quy định', 'S1', 2),
('PACK-004', 'packing', 'Đóng gói sai hàng/thiếu hàng', 'Đóng gói không đúng sản phẩm hoặc số lượng so với đơn hàng, dẫn đến đơn bị hoàn/khiếu nại', 'S3', 8),
('PACK-005', 'packing', 'Trễ cam kết đóng gói (SLA)', 'Không hoàn thành đóng gói trong thời gian quy định (2h với đơn ưu tiên/B2B, 6h với đơn thường)', 'S2', 4),

-- Picking (3)
('PICK-001', 'picking', 'Lấy sai sản phẩm (Sai SKU)', 'Lấy nhầm sản phẩm do không kiểm tra kỹ Barcode/SKU trước khi lấy', 'S2', 5),
('PICK-002', 'picking', 'Báo cáo thiếu hàng sai (Hàng ảo)', 'Xác nhận thiếu hàng trên hệ thống nhưng thực tế hàng vẫn còn ở vị trí khác hoặc bị che khuất', 'S3', 7),
('PICK-003', 'picking', 'Lấy hàng cận date/hết date sai chiến lược', 'Không tuân thủ FEFO (First Expired First Out), lấy hàng mới nhập thay vì hàng cũ cần xuất trước', 'S3', 6),

-- Handover (3)
('HAND-001', 'handover', 'Bàn giao sai hãng vận chuyển', 'Phân loại sai hãng vận chuyển, đưa nhầm hàng cho bưu tá/tài xế khác', 'S3', 6),
('HAND-002', 'handover', 'Thiếu biên bản/chữ ký bàn giao (POD)', 'Bàn giao hàng nhưng không có biên bản hoặc chữ ký xác nhận của tài xế/bưu tá', 'S3', 8),
('HAND-003', 'handover', 'Bàn giao trễ (Miss cutoff time)', 'Không kịp bàn giao đơn hàng trong khung giờ quy định (trước 20h hoặc 12h hôm sau)', 'S2', 5),

-- Putaway (4)
('PUT-001', 'putaway', 'Để hàng trực tiếp dưới sàn', 'Vi phạm quy chuẩn lưu kho - đặt hàng hóa trực tiếp xuống sàn mà không có pallet/kệ', 'S3', 7),
('PUT-002', 'putaway', 'Lưu kho chung lô hạn sử dụng khác nhau', 'Để lẫn lộn các hàng hóa có hạn sử dụng (Date) khác nhau vào cùng một vị trí', 'S2', 4),
('PUT-003', 'putaway', 'Sắp xếp sai chiều quy định', 'Đặt hàng sai chiều (ngược/ngang) gây nguy cơ chảy nước hoặc hư hỏng sản phẩm', 'S2', 3),
('PUT-004', 'putaway', 'Không tháo bao bì bảo quản tạm', 'Không tuân thủ quy chuẩn bọc plastic/seal sách hoặc quần áo trước khi lên kệ lưu trữ', 'S1', 2),

-- Inspection (3)
('INSP-001', 'inspection', 'Bỏ sót lỗi ngoại quan (QC sai)', 'Nhập kho hàng móp méo, hư hỏng, ẩm ướt nhưng không phát hiện và phân loại Grade D', 'S3', 6),
('INSP-002', 'inspection', 'Nhập hàng cận date không cảnh báo', 'Nhập kho hàng có hạn sử dụng dưới 6 tháng mà không có xác nhận của người bán', 'S3', 7),
('INSP-003', 'inspection', 'Không kiểm tra niêm phong/Seal', 'Đối với hàng giá trị cao/điện tử, không kiểm tra tình trạng nguyên seal/tem nhãn trước khi nhập', 'S4', 12),

-- Co-inspection (2)
('COIN-001', 'co_inspection', 'Thiếu bằng chứng đồng kiểm', 'Không chụp ảnh/quay video quá trình đồng kiểm, đặc biệt với hàng hoàn/nhập kho', 'S3', 8),
('COIN-002', 'co_inspection', 'Ký nhận sai số lượng thực tế', 'Xác nhận trên biên bản số lượng khác với thực tế nhận được từ đối tác', 'S3', 9),

-- Data Entry (3)
('DATA-001', 'data_entry', 'Nhập sai kích thước/trọng lượng', 'Nhập liệu sai cân nặng, kích thước (DIM) dẫn đến tính sai phí vận chuyển/lưu kho', 'S3', 6),
('DATA-002', 'data_entry', 'Nhập sai hạn sử dụng (Expiry Date)', 'Cập nhật sai hạn sử dụng lên hệ thống WMS, gây rủi ro xuất hàng hết hạn', 'S3', 7),
('DATA-003', 'data_entry', 'Sai thông tin kiện hàng', 'Nhập sai số lượng kiện hoặc mã kiện trong lô hàng nhập', 'S2', 4),

-- Unloading (2)
('UNLD-001', 'unloading', 'Làm hư hỏng hàng khi hạ tải', 'Thao tác ẩu, làm rơi vỡ hàng hóa trong quá trình dỡ hàng từ xe tải', 'S3', 8),
('UNLD-002', 'unloading', 'Không sử dụng thiết bị chuyên dụng', 'Bê vác tay đối với hàng nặng/cồng kềnh thay vì dùng xe nâng, gây rủi ro an toàn và hỏng hàng', 'S4', 15),

-- Move (2)
('MOVE-001', 'move', 'Vận chuyển hàng không che chắn/cố định', 'Không quấn PE hoặc cố định hàng trên pallet khi di chuyển, gây xô lệch, rơi vỡ', 'S2', 5),
('MOVE-002', 'move', 'Làm rơi/móp méo hàng nội bộ', 'Gây hư hỏng hàng hóa trong quá trình di chuyển vị trí trong kho', 'S3', 6),

-- Cycle Count (2)
('CYCL-001', 'cycle_count', 'Sai lệch số lượng kiểm kê', 'Báo cáo số lượng tồn kho sai so với thực tế tại vị trí kiểm', 'S3', 7),
('CYCL-002', 'cycle_count', 'Bỏ sót vị trí/SKU', 'Không kiểm đếm hết các sản phẩm trong vị trí được chỉ định', 'S2', 4),

-- Relabel (4)
('RLAB-001', 'relabel', 'Dán đè thông tin gốc/nhãn gốc', 'Dán tem phụ che khuất nội dung bắt buộc hoặc che nhãn gốc của sản phẩm', 'S3', 8),
('RLAB-002', 'relabel', 'Dán sai vị trí quy định', 'Dán tem không đúng vị trí đã được hướng dẫn hoặc thống nhất với khách hàng', 'S1', 2),
('RLAB-003', 'relabel', 'Không dán nhãn Combo/Set', 'Không dán nhãn "Không tách lẻ" cho hàng bộ/combo, gây sai sót khi xuất kho', 'S3', 7),
('RLAB-004', 'relabel', 'Tem nhãn mờ/nhăn/rách', 'Tem in bị mờ không đọc được hoặc dán bị nhăn/gấp nếp không đạt chuẩn', 'S1', 2)

ON CONFLICT (ors_code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    severity_level = EXCLUDED.severity_level,
    ors_points = EXCLUDED.ors_points,
    updated_at = NOW();

-- ============================================================
-- SEED DATA: ORS MILESTONE CONFIG (Global Defaults)
-- ============================================================

INSERT INTO ors_milestone_config (warehouse_code, ors_points_from, ors_points_to, milestone_level, action_type, penalty_rate, description) VALUES
(NULL, 0, 9, 'GREEN', 'NO_ACTION', 0.0000, 'Bình thường - Tiếp tục làm việc tốt'),
(NULL, 10, 19, 'YELLOW', 'WARNING', 0.0000, 'Cảnh báo - Gửi thông báo cảnh báo, quản lý nhận alert để coaching'),
(NULL, 20, 29, 'ORANGE', 'TRAINING_REQUIRED', 0.1000, 'Cần cải thiện - Yêu cầu đào tạo lại, giảm 10% KPI bonus'),
(NULL, 30, 39, 'RED', 'HR_REVIEW', 0.3000, 'Nghiêm trọng - Yêu cầu đánh giá HR, giảm 30% KPI bonus'),
(NULL, 40, 999999, 'CRITICAL', 'DISCIPLINARY', 1.0000, 'Đặc biệt nghiêm trọng - Mất toàn bộ KPI bonus, xem xét kỷ luật')

ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA: DEFAULT RANKING RANGE CONFIG
-- ============================================================

INSERT INTO ranking_range_config (warehouse_code, role, main_task, pph_min, pph_max, ranking_score, min_weekly_hours, description) VALUES
(NULL, NULL, NULL, 50.00, 999999.99, 5, 20, 'Xuất sắc - Vượt trội, năng suất cao nhất'),
(NULL, NULL, NULL, 40.00, 49.99, 4, 20, 'Tốt - Hiệu suất tốt, ổn định'),
(NULL, NULL, NULL, 30.00, 39.99, 3, 20, 'Đạt yêu cầu - Hoàn thành công việc theo chuẩn'),
(NULL, NULL, NULL, 20.00, 29.99, 2, 20, 'Cần cải thiện - Chưa đạt kỳ vọng, cần hỗ trợ'),
(NULL, NULL, NULL, 0.00, 19.99, 1, 20, 'Chưa đạt - Cần can thiệp và đào tạo lại')

ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA: DEFAULT ROLE MAIN TASK CONFIG
-- ============================================================

INSERT INTO role_main_task_config (warehouse_code, role, role_id, main_task) VALUES
(NULL, 'Packer', NULL, 'packing'),
(NULL, 'Picker', NULL, 'picking'),
(NULL, 'Putaway Staff', NULL, 'putaway'),
(NULL, 'Inspector', NULL, 'inspection'),
(NULL, 'Data Entry', NULL, 'data_entry'),
(NULL, 'Handover Staff', NULL, 'handover'),
(NULL, 'Unloader', NULL, 'unloading'),
(NULL, 'Mover', NULL, 'move'),
(NULL, 'Cycle Counter', NULL, 'cycle_count'),
(NULL, 'Relabeler', NULL, 'relabel'),
(NULL, 'Co-Inspector', NULL, 'co_inspection')

ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA: DEFAULT KPI BONUS CONFIG (Vietnam)
-- ============================================================

INSERT INTO kpi_bonus_config (warehouse_code, country, ranking_score_min, ranking_score_max, calculation_type, amount_per_point, currency) VALUES
(NULL, 'VN', 1, 5, 'PER_POINT', 1000.00, 'VND'),
(NULL, 'TH', 1, 5, 'PER_POINT', 5.00, 'THB'),
(NULL, 'PH', 1, 5, 'PER_POINT', 10.00, 'PHP'),
(NULL, 'ID', 1, 5, 'PER_POINT', 500.00, 'IDR'),
(NULL, 'MY', 1, 5, 'PER_POINT', 0.50, 'MYR')

ON CONFLICT DO NOTHING;
