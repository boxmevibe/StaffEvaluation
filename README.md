# KPI Warehouse Management System v2.2

Hệ thống quản lý KPI kho vận thế hệ mới với tính năng PPH (Points Per Hour), Ranking Score 1-5, và ORS (Operational Risk Score).

## 📋 URLs

- **Sandbox URL**: https://3000-ilxxj5go9kierk3waisl7-5634da27.sandbox.novita.ai
- **Supabase**: https://jubwnkwqkqsmexcyrark.supabase.co

## ✨ Tính năng v2.2

### Sample Data Generator (NEW!)
Truy cập **Admin > Sample Data** để:
- ✅ Xem trạng thái dữ liệu hiện tại (stats)
- ✅ Generate dữ liệu mẫu cho tất cả bảng kết quả
- ✅ Preview dữ liệu với table selector
- ✅ Reset toàn bộ dữ liệu khi cần

### Demo Mode
Hệ thống hỗ trợ 2 chế độ:
- **Demo Mode**: Sử dụng dữ liệu mẫu tự động generate, không cần database
- **Production Mode**: Kết nối với Supabase database thực

Chuyển đổi bằng nút toggle ở góc phải header.

### Export CSV
- Export bảng xếp hạng từ Manager Dashboard
- Export dữ liệu payroll với đầy đủ thông tin

## ✅ Trạng thái dữ liệu hiện tại

| Bảng | Số bản ghi |
|------|-----------|
| kpi_weekly_summary | 132 |
| ranking_weekly_result | 132 |
| ors_event | 33 |
| ors_monthly_summary | 33 |
| kpi_monthly_summary | 33 |
| payroll_kpi_bridge | 33 |

## ✅ Đã hoàn thành

### Core Features
- ✅ **PPH Calculation** - Tính điểm trên giờ (Points Per Hour)
- ✅ **Ranking System** - Xếp hạng 1-5 với ngưỡng PPH cấu hình theo kho
- ✅ **ORS System** - Quản lý 32 loại vi phạm vận hành với 5 mức milestone
- ✅ **KPI Bonus** - Tự động tính thưởng KPI với Rating Factor và ORS Penalty
- ✅ **Demo Data** - Dữ liệu mẫu tự động generate để test UI
- ✅ **Sample Data Generator** - UI để tạo/reset dữ liệu test từ Admin

### Jobs Pipeline
- ✅ **Job A** - Build KPI Weekly Summary
- ✅ **Job B** - Compute Ranking Weekly Result
- ✅ **Job C** - Compute ORS Monthly Summary
- ✅ **Job D** - Build KPI Monthly Summary

### User Interfaces
- ✅ **Employee Dashboard** - Xem KPI cá nhân, PPH, Ranking, ORS với charts
- ✅ **Manager Dashboard** - Quản lý team, xếp hạng, ghi nhận/review ORS, Export CSV
- ✅ **Admin Configuration** - Cấu hình Ranking, Role-Task, ORS Catalog, **Sample Data Generator**
- ✅ **Payroll Interface** - Lấy dữ liệu KPI, Apply payroll, Export CSV

### API Endpoints
- ✅ Employee APIs (weekly/monthly KPI, ORS, ranking history)
- ✅ Manager APIs (dashboard, ranking, ORS alerts, create/review ORS)
- ✅ Admin APIs (configs, ORS catalog)
- ✅ Jobs APIs (run individual jobs or full pipeline)
- ✅ Payroll APIs (get bridge data, apply to payroll)
- ✅ **Seed APIs** (/seed/*) - Generate, preview, reset sample data

## 🔧 Hướng dẫn sử dụng

### Bước 1: Kiểm tra dữ liệu
1. Truy cập Sandbox URL
2. Vào **Admin > Sample Data**
3. Xem stats - nếu tất cả bảng có dữ liệu → sẵn sàng test

### Bước 2: Generate dữ liệu (nếu cần)
1. Vào **Admin > Sample Data**
2. Chọn Payroll Period (ví dụ: 2026-01)
3. Chọn số tuần (4 tuần = cả tháng)
4. Click **Generate Sample Data**
5. Chờ vài giây → Dữ liệu sẽ được tạo cho 33 nhân viên × 3 kho

### Bước 3: Test các Dashboard
1. **Employee** - Nhập `NV001` và chọn `BMVN_HCM_TP`
2. **Manager** - Chọn warehouse và xem ranking, ORS
3. **Admin** - Xem configs và run jobs
4. **Payroll** - Chọn kỳ lương và xem dữ liệu

## 📊 Data Models

### Config Tables (Đã có seed data)
- `role_main_task_config` - 11 vai trò
- `ranking_range_config` - 5 ngưỡng ranking
- `kpi_bonus_config` - 5 quốc gia
- `ors_catalog` - 32 loại vi phạm
- `ors_milestone_config` - 5 mức milestone

### Result Tables (Sample data generated)
- `kpi_weekly_summary` - Tổng hợp KPI tuần với PPH
- `ranking_weekly_result` - Kết quả ranking tuần
- `ors_event` - Sự kiện vi phạm ORS
- `ors_monthly_summary` - Tổng hợp ORS tháng
- `kpi_monthly_summary` - Tổng hợp KPI tháng
- `payroll_kpi_bridge` - Cầu nối dữ liệu cho payroll

## 🔗 API Reference

### Seed APIs (New!)
```
GET  /seed/stats                          # Lấy số lượng bản ghi
GET  /seed/preview?table=xxx&limit=10     # Preview dữ liệu
POST /seed/generate { payrollPeriod, weeks }  # Tạo dữ liệu
POST /seed/reset                          # Xóa toàn bộ dữ liệu
```

### Employee APIs
```
GET /api/employee/:staffId/kpi/weekly?yearWeek=2026-W03&warehouseCode=BMVN_HCM_TP
GET /api/employee/:staffId/kpi/monthly?payrollPeriod=2026-01
GET /api/employee/:staffId/ors
```

### Manager APIs
```
GET /api/manager/dashboard?warehouseCode=BMVN_HCM_TP&yearWeek=2026-W03
GET /api/manager/ranking?warehouseCode=BMVN_HCM_TP&yearWeek=2026-W03
GET /api/manager/ors/alerts?warehouseCode=BMVN_HCM_TP&payrollPeriod=2026-01
POST /api/manager/ors/create
POST /api/manager/ors/:eventId/review
```

### Payroll APIs
```
GET /api/payroll/bridge?payrollPeriod=2026-01&warehouseCode=BMVN_HCM_TP
POST /api/payroll/apply { payrollPeriod, warehouseCode, staffIds }
```

### Jobs APIs
```
POST /api/jobs/run-a  { yearWeek, warehouseCode }
POST /api/jobs/run-b  { yearWeek, warehouseCode }
POST /api/jobs/run-c  { payrollPeriod, warehouseCode }
POST /api/jobs/run-d  { payrollPeriod, warehouseCode }
POST /api/jobs/run-pipeline  { yearWeek, payrollPeriod, warehouseCode }
```

## 📈 Cách tính KPI

### 1. PPH (Points Per Hour)
```
PPH = Main Task Points / Work Hours
```

### 2. Ranking Score (1-5)
| Score | Label | PPH Range | Rating Factor |
|-------|-------|-----------|---------------|
| 5 | Xuất sắc | ≥ 50 | 1.00 |
| 4 | Tốt | 40-49 | 0.95 |
| 3 | Đạt yêu cầu | 30-39 | 0.85 |
| 2 | Cần cải thiện | 20-29 | 0.70 |
| 1 | Chưa đạt | < 20 | 0.50 |

### 3. KPI Bonus
```
KPI Bonus = Major KPI × Amount per Point × Rating Factor × (1 - ORS Penalty)
```

### 4. ORS Penalty Rate
| ORS Points | Milestone | Penalty |
|------------|-----------|---------|
| 0-9 | GREEN | 0% |
| 10-19 | YELLOW | 0% |
| 20-29 | ORANGE | 10% |
| 30-39 | RED | 30% |
| ≥40 | CRITICAL | 100% |

## 🏭 Sample Warehouses

| Code | Name | Employees |
|------|------|-----------|
| BMVN_HCM_TP | Boxme Tân Tạo | 15 |
| BMVN_HCM_TT | Boxme Lê Minh Xuân | 10 |
| BMVN_HN_LB | Boxme Long Biên | 8 |

## 🛠 Tech Stack

- **Frontend**: Hono JSX + TailwindCSS + Chart.js
- **Backend**: Hono Framework on Cloudflare Workers
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Cloudflare Pages

## 📁 Project Structure

```
webapp/
├── src/
│   ├── index.tsx           # Main app entry
│   ├── pages/
│   │   ├── employee.tsx    # Employee dashboard
│   │   ├── manager.tsx     # Manager dashboard
│   │   ├── admin.tsx       # Admin + Sample Data
│   │   └── payroll.tsx     # Payroll interface
│   ├── routes/
│   │   ├── api.ts          # Production API
│   │   ├── demo.ts         # Demo API
│   │   └── seed.ts         # Seed data generator API
│   ├── jobs/               # Job A-D
│   └── lib/                # Utilities
├── database/
│   └── schema.sql          # Database schema
├── ecosystem.config.cjs    # PM2 config
├── wrangler.jsonc          # Cloudflare config
└── README.md
```

## 📝 Next Steps

1. ✅ Schema SQL đã chạy trong Supabase
2. ✅ Sample data đã được generate (132 records mỗi bảng)
3. ✅ Test với Production Mode
4. ⏳ Deploy lên Cloudflare Pages cho production
5. ⏳ Import dữ liệu thực từ hệ thống cũ
6. ⏳ Cấu hình PPH thresholds theo phân tích percentile

---

© 2026 Boxme KPI Warehouse Management System v2.2
