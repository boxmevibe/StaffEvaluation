-- ============================================================
-- ORS RECOVERY SYSTEM - DATABASE SCHEMA
-- Version: 1.0
-- Date: 2025-01-20
-- ============================================================

-- ============================================================
-- RECOVERY CATALOG (Training Packages)
-- ============================================================

CREATE TABLE IF NOT EXISTS ors_recovery_catalog (
    id BIGSERIAL PRIMARY KEY,
    recovery_code VARCHAR(30) UNIQUE NOT NULL, -- VD: REC_PACK_01
    title VARCHAR(300) NOT NULL,
    recovery_type VARCHAR(30) NOT NULL CHECK (
        recovery_type IN ('TRAINING_QUIZ', 'SKILL_CHALLENGE', 'IMPROVEMENT_PROPOSAL')
    ),
    target_roles TEXT[] DEFAULT '{}', -- ['Packer', 'QC', 'Picker']
    difficulty VARCHAR(20) NOT NULL CHECK (
        difficulty IN ('EASY', 'MEDIUM', 'HARD', 'VERY_HARD')
    ),
    ors_reward INTEGER NOT NULL CHECK (ors_reward > 0 AND ors_reward <= 10),
    prerequisite TEXT, -- Điều kiện để thực hiện
    description TEXT, -- Mô tả chi tiết
    validation_method VARCHAR(50) NOT NULL DEFAULT 'MANAGER_CONFIRM' CHECK (
        validation_method IN ('MANAGER_CONFIRM', 'HR_REVIEW')
    ),
    one_time_use BOOLEAN DEFAULT TRUE,
    related_ors_codes TEXT[] DEFAULT '{}', -- Mã lỗi ORS liên quan
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recovery_catalog_code ON ors_recovery_catalog (recovery_code);

CREATE INDEX IF NOT EXISTS idx_recovery_catalog_type ON ors_recovery_catalog (recovery_type);

CREATE INDEX IF NOT EXISTS idx_recovery_catalog_difficulty ON ors_recovery_catalog (difficulty);

CREATE INDEX IF NOT EXISTS idx_recovery_catalog_active ON ors_recovery_catalog (is_active);

-- ============================================================
-- RECOVERY TICKET (Assigned to Employee)
-- ============================================================

CREATE TABLE IF NOT EXISTS ors_recovery_ticket (
    id BIGSERIAL PRIMARY KEY,
    ticket_code VARCHAR(50) UNIQUE NOT NULL, -- VD: REC-2025-01-0001
    warehouse_code VARCHAR(50) NOT NULL,
    staff_id VARCHAR(50) NOT NULL,
    staff_name VARCHAR(200),
    recovery_catalog_id BIGINT NOT NULL REFERENCES ors_recovery_catalog(id),
    recovery_code VARCHAR(30) NOT NULL,
    recovery_type VARCHAR(30) NOT NULL,
    ors_reward INTEGER NOT NULL,

-- Trạng thái
status VARCHAR(20) DEFAULT 'ASSIGNED' CHECK (
    status IN (
        'ASSIGNED', -- Mới gán
        'IN_PROGRESS', -- Đang thực hiện
        'COMPLETED', -- Hoàn thành
        'FAILED', -- Không đạt
        'EXPIRED', -- Hết hạn
        'CANCELLED' -- Bị hủy
    )
),

-- Thời gian
assigned_at TIMESTAMPTZ DEFAULT NOW(),
deadline_at TIMESTAMPTZ,
completed_at TIMESTAMPTZ,

-- Kết quả (ghi nhận từ offline)
completion_notes TEXT, -- Ghi chú kết quả
evidence_description TEXT, -- Mô tả bằng chứng (link video, ảnh, etc)

-- ORS Application
ors_applied BOOLEAN DEFAULT FALSE,
ors_applied_at TIMESTAMPTZ,
ors_applied_to_period VARCHAR(7), -- YYYY-MM

-- Metadata
assigned_by VARCHAR(100) NOT NULL,
    confirmed_by VARCHAR(100),
    confirmed_at TIMESTAMPTZ,
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recovery_ticket_warehouse ON ors_recovery_ticket (warehouse_code);

CREATE INDEX IF NOT EXISTS idx_recovery_ticket_staff ON ors_recovery_ticket (staff_id);

CREATE INDEX IF NOT EXISTS idx_recovery_ticket_status ON ors_recovery_ticket (status);

CREATE INDEX IF NOT EXISTS idx_recovery_ticket_catalog ON ors_recovery_ticket (recovery_catalog_id);

CREATE INDEX IF NOT EXISTS idx_recovery_ticket_period ON ors_recovery_ticket (ors_applied_to_period);

CREATE INDEX IF NOT EXISTS idx_recovery_ticket_assigned_at ON ors_recovery_ticket (assigned_at);

-- ============================================================
-- TRIGGERS FOR updated_at
-- ============================================================

-- Apply trigger to recovery tables
DO $$
BEGIN
    -- ors_recovery_catalog trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ors_recovery_catalog_updated_at') THEN
        CREATE TRIGGER update_ors_recovery_catalog_updated_at
        BEFORE UPDATE ON ors_recovery_catalog
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

END IF;

-- ors_recovery_ticket trigger
IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE
        tgname = 'update_ors_recovery_ticket_updated_at'
) THEN
CREATE TRIGGER update_ors_recovery_ticket_updated_at BEFORE
UPDATE ON ors_recovery_ticket FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column ();

END IF;

END;

$$;

-- ============================================================
-- SEED DATA: 12 RECOVERY PACKAGES
-- ============================================================

INSERT INTO ors_recovery_catalog (
    recovery_code,
    title,
    recovery_type,
    target_roles,
    difficulty,
    ors_reward,
    prerequisite,
    description,
    validation_method,
    one_time_use,
    related_ors_codes
) VALUES 
-- REC_PACK_01: Chuyên gia Vật liệu & Quy cách Đóng gói
(
    'REC_PACK_01',
    'Chuyên gia Vật liệu & Quy cách Đóng gói',
    'TRAINING_QUIZ',
    ARRAY['Packer', 'QC'],
    'EASY',
    2,
    'Nhân viên bị trừ điểm do đóng gói sai quy cách hoặc lãng phí vật tư.',
    'Nắm vững quy định về sử dụng thùng carton (3-5 lớp), phân biệt bóng khí hạt to (gia dụng) và hạt nhỏ (mỹ phẩm), quy tắc dán băng keo niêm phong. Quiz: 15 câu hỏi trắc nghiệm về vật liệu đóng gói.',
    'MANAGER_CONFIRM',
    TRUE,
    ARRAY['PACK-001', 'PACK-003']
),

-- REC_PACK_02: Thử thách 'Bàn Tay Vàng'
(
    'REC_PACK_02',
    'Thử thách ''Bàn Tay Vàng'': Đóng gói Hàng Dễ Vỡ',
    'SKILL_CHALLENGE',
    ARRAY['Packer'],
    'HARD',
    6,
    'Nhân viên Packers có kinh nghiệm > 1 tháng hoặc từng làm vỡ hàng.',
    'Thực hiện đóng gói hoàn hảo 10 đơn hàng chứa thủy tinh/sành sứ hoặc chất lỏng. Yêu cầu: Quấn bóng nổ độc lập từng sản phẩm, chèn giấy không để khoảng trống, cố định nắp chai bằng băng keo, dán tem cảnh báo đúng vị trí. Manager kiểm tra thực tế 10 gói hàng trước khi niêm phong.',
    'MANAGER_CONFIRM',
    TRUE,
    ARRAY['PACK-001', 'PACK-002', 'PACK-004']
),

-- REC_STORE_01: Quy chuẩn Lưu kho & Sắp xếp
(
    'REC_STORE_01',
    'Quy chuẩn Lưu kho & Sắp xếp Hàng hóa',
    'TRAINING_QUIZ',
    ARRAY['Putaway', 'Inventory'],
    'EASY',
    2,
    'Nhân viên vi phạm để hàng dưới sàn hoặc sai chiều.',
    'Học về các quy tắc 5S trong kho và tiêu chuẩn sắp xếp hàng lên kệ. Bao gồm: Nghiêm cấm để hàng trực tiếp dưới sàn, hàng hóa phải đặt trong hộp tránh bụi, sắp xếp đúng chiều mũi tên quy định. Quiz: Nhận diện hình ảnh Đúng/Sai về cách xếp hàng.',
    'MANAGER_CONFIRM',
    TRUE,
    ARRAY['PUT-001', 'PUT-003', 'PUT-004']
),

-- REC_INB_01: Phân loại Chất lượng Hàng hóa
(
    'REC_INB_01',
    'Phân loại Chất lượng Hàng hóa (QC Grading)',
    'TRAINING_QUIZ',
    ARRAY['Inbound', 'Returns'],
    'HARD',
    5,
    'Nhân viên QC hoặc xử lý hàng hoàn.',
    'Phân biệt chính xác các cấp độ hư hỏng của hàng hóa để xử lý nhập kho hoặc hàng hoàn. Bao gồm: Hàng loại A (mới, nguyên vẹn), D1 (hư hỏng nhẹ, bán giảm giá được), D2/D3 (hư hỏng nặng, cần tiêu hủy hoặc xuất trả). Simulation: Phân loại đúng 20 mẫu vật phẩm giả định.',
    'MANAGER_CONFIRM',
    TRUE,
    ARRAY['INSP-001', 'COIN-001']
),

-- REC_FEFO_01: Quản trị Hạn sử dụng
(
    'REC_FEFO_01',
    'Quản trị Hạn sử dụng (FEFO Master)',
    'TRAINING_QUIZ',
    ARRAY['Picker', 'Putaway'],
    'MEDIUM',
    4,
    'Nhân viên lấy hàng sai date hoặc sắp xếp lẫn lộn date.',
    'Quy tắc nhập trước xuất trước (FIFO) và hết hạn trước xuất trước (FEFO). Bao gồm: Không lưu hàng có date giống nhau ở cùng 1 vị trí nếu không có vách ngăn, hàng dưới 6 tháng date phải có xác nhận người bán, cảnh báo hàng cận date dưới 7 ngày. Quiz: Xử lý tình huống về Date hàng hóa.',
    'MANAGER_CONFIRM',
    TRUE,
    ARRAY['PICK-003', 'PUT-002', 'INSP-002']
),

-- REC_B2B_01: Quy trình Xuất kho & Chứng từ B2B
(
    'REC_B2B_01',
    'Quy trình Xuất kho & Chứng từ B2B',
    'TRAINING_QUIZ',
    ARRAY['B2B Staff', 'Handover'],
    'HARD',
    6,
    'Nhân viên khu vực B2B hoặc đã từng làm thất lạc chứng từ.',
    'Quy trình phức tạp của đơn B2B: Đóng gói, dán nhãn thùng và bàn giao chứng từ. Bao gồm: Kiểm tra đủ Hóa đơn GTGT, PO, Phiếu xuất kho, Booking; Ký biên bản bàn giao số kiện với tài xế; Xử lý đơn hàng giao cho chuỗi cửa hàng/siêu thị. Quiz: Sắp xếp quy trình và nhận diện bộ chứng từ đúng.',
    'MANAGER_CONFIRM',
    TRUE,
    ARRAY['HAND-001', 'HAND-002']
),

-- REC_LABEL_01: Kỹ thuật Dán nhãn & Sub-label
(
    'REC_LABEL_01',
    'Kỹ thuật Dán nhãn & Sub-label',
    'SKILL_CHALLENGE',
    ARRAY['VAS', 'Inbound'],
    'MEDIUM',
    3,
    'Nhân viên làm dịch vụ gia tăng (VAS) hoặc nhập kho.',
    'Thực hành dán tem phụ và tem set/combo đúng quy chuẩn. Bao gồm: Không dán che khuất thông tin gốc hoặc logo thương hiệu, dán tem ''Đây là một Set, không tách lẻ'' cho hàng combo, đảm bảo tem phẳng, không nhăn, mã vạch scan được. Manager kiểm tra 50 sản phẩm đã dán tem.',
    'MANAGER_CONFIRM',
    TRUE,
    ARRAY['RLAB-001', 'RLAB-002', 'RLAB-003', 'RLAB-004']
),

-- REC_HIGHVAL_01: Quy trình Xử lý Hàng Giá trị cao
(
    'REC_HIGHVAL_01',
    'Quy trình Xử lý Hàng Giá trị cao',
    'TRAINING_QUIZ',
    ARRAY['All Roles'],
    'VERY_HARD',
    8,
    'Chỉ dành cho nhân viên thâm niên > 3 tháng hoặc được đề xuất.',
    'Quy định nghiêm ngặt khi thao tác với hàng điện tử, điện lạnh, giá trị cao. Bao gồm: Kiểm tra niêm phong/Seal trước khi nhập/xuất, hộp không được móp méo/trầy xước dù là nhỏ nhất, quy trình bàn giao có đồng kiểm chi tiết. Quiz: 100% điểm tuyệt đối (sai 1 câu phải học lại).',
    'HR_REVIEW',
    TRUE,
    ARRAY['INSP-003', 'UNLD-001', 'MOVE-002']
),

-- REC_SPEED_01: Thử thách Tốc độ: Fulfill Now
(
    'REC_SPEED_01',
    'Thử thách Tốc độ: Fulfill Now',
    'SKILL_CHALLENGE',
    ARRAY['Picker', 'Packer'],
    'VERY_HARD',
    7,
    'Nhân viên từng vi phạm SLA (trễ đơn).',
    'Hoàn thành quy trình đóng gói cho đơn hàng hỏa tốc trong khung giờ cao điểm. Yêu cầu: Đóng gói xong trong 45 phút (B2C) hoặc 2h (B2B) từ lúc nổ đơn, không sai sót, không thao tác lỗi trên hệ thống, áp dụng liên tiếp cho 5 đơn Fulfill Now. Quản lý xác nhận qua log thời gian thực.',
    'MANAGER_CONFIRM',
    TRUE,
    ARRAY['PACK-005', 'HAND-003']
),

-- REC_RETURN_01: Xử lý Hàng hoàn & Bằng chứng
(
    'REC_RETURN_01',
    'Xử lý Hàng hoàn & Bằng chứng (Evidence)',
    'TRAINING_QUIZ',
    ARRAY['Returns Staff'],
    'MEDIUM',
    4,
    'Nhân viên bộ phận nhập hoàn (Returns).',
    'Quy trình quay video/chụp ảnh đồng kiểm hàng hoàn để xử lý khiếu nại. Bao gồm: Chụp ảnh/quay video rõ 6 mặt kiện hàng trước khi mở, đồng kiểm với bưu tá ngay khi nhận hàng nếu hộp móp méo, cập nhật trạng thái QC trong vòng 24h. Manager duyệt 5 hồ sơ hàng hoàn (Ticket + Video) đạt chuẩn.',
    'MANAGER_CONFIRM',
    TRUE,
    ARRAY['COIN-001', 'COIN-002']
),

-- REC_MAT_01: Kiểm soát Chất lượng Vật tư Đầu vào
(
    'REC_MAT_01',
    'Kiểm soát Chất lượng Vật tư Đầu vào',
    'TRAINING_QUIZ',
    ARRAY['Warehouse Admin', 'Leader'],
    'MEDIUM',
    3,
    'Dành cho cấp quản lý kho hoặc thủ kho vật tư.',
    'Cách kiểm tra chất lượng thùng carton, băng keo, màng PE khi nhập kho vật tư. Bao gồm: Kiểm tra định lượng giấy carton (145gsm), test độ cứng và QR code; Kiểm tra cân nặng cuộn màng PE (15kg máy/5kg tay); Quy trình lập biên bản từ chối nhận vật tư lỗi. Quiz: Thông số kỹ thuật vật tư.',
    'MANAGER_CONFIRM',
    TRUE,
    ARRAY['PACK-003']
),

-- REC_SAFETY_01: An toàn Vận hành & Thiết bị

(
    'REC_SAFETY_01',
    'An toàn Vận hành & Thiết bị',
    'TRAINING_QUIZ',
    ARRAY['All Roles'],
    'EASY',
    2,
    'Bắt buộc cho nhân viên mới hoặc nhân viên vi phạm quy tắc an toàn.',
    'Quy tắc an toàn khi sử dụng xe nâng, dao rọc giấy và di chuyển trong kho. Bao gồm: Sử dụng thiết bị chuyên dụng cho hàng nặng/cồng kềnh, không để vật tư dễ cháy gần nguồn điện/xe nâng, quy định trang phục bảo hộ (giày, áo phản quang). Quiz: An toàn lao động.',
    'MANAGER_CONFIRM',
    TRUE,
    ARRAY['UNLD-002', 'MOVE-001']
)

ON CONFLICT (recovery_code) DO UPDATE SET
    title = EXCLUDED.title,
    recovery_type = EXCLUDED.recovery_type,
    target_roles = EXCLUDED.target_roles,
    difficulty = EXCLUDED.difficulty,
    ors_reward = EXCLUDED.ors_reward,
    prerequisite = EXCLUDED.prerequisite,
    description = EXCLUDED.description,
    validation_method = EXCLUDED.validation_method,
    one_time_use = EXCLUDED.one_time_use,
    related_ors_codes = EXCLUDED.related_ors_codes,
    updated_at = NOW();