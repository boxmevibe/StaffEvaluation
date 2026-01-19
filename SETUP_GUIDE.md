# Hướng dẫn Cài đặt Database

## Bước 1: Tạo Tables trong Supabase

1. Mở Supabase Dashboard: https://supabase.com/dashboard/project/jubwnkwqkqsmexcyrark
2. Vào **SQL Editor** (menu bên trái)
3. Click **New query**
4. Copy toàn bộ nội dung file `database/schema.sql`
5. Click **Run** để thực thi

## Bước 2: Kiểm tra Tables đã tạo

Sau khi chạy SQL thành công, bạn sẽ có các tables:

### Config Tables
- `role_main_task_config` - 11 records (mapping role → task)
- `ranking_range_config` - 5 records (ngưỡng PPH mặc định)
- `kpi_bonus_config` - 5 records (theo quốc gia)
- `ors_catalog` - 32 records (danh mục vi phạm)
- `ors_milestone_config` - 5 records (ngưỡng ORS)

### Result Tables
- `kpi_weekly_summary`
- `ranking_weekly_result`
- `ors_event`
- `ors_monthly_summary`
- `kpi_monthly_summary`
- `payroll_kpi_bridge`

## Bước 3: Verify API hoạt động

Sau khi tạo tables, test lại API:

```bash
curl https://3000-ilxxj5go9kierk3waisl7-5634da27.sandbox.novita.ai/api/admin/ors-catalog
```

Nếu thành công sẽ trả về 32 loại vi phạm ORS.

## Bước 4: Import dữ liệu nguồn (Optional)

Nếu bạn có dữ liệu từ hệ thống cũ:

1. Import vào `warehouse_productivity_daily`
2. Import vào `payroll_monthly`

## Bước 5: Chạy Jobs để tính KPI

Qua Admin UI hoặc API:

```bash
# Chạy full pipeline
curl -X POST https://3000-xxx.sandbox.novita.ai/api/jobs/run-pipeline \
  -H "Content-Type: application/json" \
  -d '{"yearWeek": "2025-W03", "payrollPeriod": "2025-01"}'
```

---

## Quick Copy: Schema SQL

Nếu không thể copy từ file, dưới đây là các lệnh CREATE TABLE chính:

```sql
-- 1. Tạo role_main_task_config
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

-- ... (xem file database/schema.sql để có đầy đủ)
```
