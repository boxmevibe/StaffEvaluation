# KPI Warehouse Management System v2.0

Hệ thống quản lý KPI kho vận thế hệ mới với tính năng PPH (Points Per Hour), Ranking Score 1-5, và ORS (Operational Risk Score).

## 📋 URLs

- **Sandbox URL**: https://3000-ilxxj5go9kierk3waisl7-5634da27.sandbox.novita.ai
- **Supabase**: https://jubwnkwqkqsmexcyrark.supabase.co

## ✨ Tính năng mới

### Demo Mode
Hệ thống hỗ trợ 2 chế độ:
- **Demo Mode**: Sử dụng dữ liệu mẫu tự động generate, không cần database
- **Production Mode**: Kết nối với Supabase database thực

Chuyển đổi bằng nút toggle ở góc phải header.

### Export CSV
- Export bảng xếp hạng từ Manager Dashboard
- Export dữ liệu payroll với đầy đủ thông tin

## ✅ Đã hoàn thành

### Core Features
- ✅ **PPH Calculation** - Tính điểm trên giờ (Points Per Hour)
- ✅ **Ranking System** - Xếp hạng 1-5 với ngưỡng PPH cấu hình theo kho
- ✅ **ORS System** - Quản lý 32 loại vi phạm vận hành với 5 mức milestone
- ✅ **KPI Bonus** - Tự động tính thưởng KPI với Rating Factor và ORS Penalty
- ✅ **Demo Data** - Dữ liệu mẫu tự động generate để test UI

### Jobs Pipeline
- ✅ **Job A** - Build KPI Weekly Summary
- ✅ **Job B** - Compute Ranking Weekly Result
- ✅ **Job C** - Compute ORS Monthly Summary
- ✅ **Job D** - Build KPI Monthly Summary

### User Interfaces
- ✅ **Employee Dashboard** - Xem KPI cá nhân, PPH, Ranking, ORS với charts
- ✅ **Manager Dashboard** - Quản lý team, xếp hạng, ghi nhận/review ORS, Export CSV
- ✅ **Admin Configuration** - Cấu hình Ranking, Role-Task, ORS Catalog
- ✅ **Payroll Interface** - Lấy dữ liệu KPI, Apply payroll, Export CSV

### API Endpoints
- ✅ Employee APIs (weekly/monthly KPI, ORS, ranking history)
- ✅ Manager APIs (dashboard, ranking, ORS alerts, create/review ORS)
- ✅ Admin APIs (configs, ORS catalog)
- ✅ Jobs APIs (run individual jobs or full pipeline)
- ✅ Payroll APIs (get bridge data, apply to payroll)
- ✅ **Demo APIs** (/demo/*) - Trả về dữ liệu mẫu, không cần database

## 🔧 Cài đặt

### 1. Setup Database (Supabase)

Chạy file `database/schema.sql` trong Supabase SQL Editor:

1. Mở https://jubwnkwqkqsmexcyrark.supabase.co
2. Vào SQL Editor
3. Copy nội dung file `database/schema.sql`
4. Chạy để tạo tables và seed data

### 2. Local Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Start development server
npm run dev:sandbox
```

### 3. Deploy to Cloudflare Pages

```bash
# Build and deploy
npm run deploy:prod
```

## 📊 Data Models

### Input Tables (Existing)
- `warehouse_productivity_daily` - Dữ liệu sản lượng hàng ngày
- `payroll_monthly` - Dữ liệu lương tháng
- `kpi_master`, `kpi_range` - Cấu hình KPI hiện có

### Config Tables (New)
- `role_main_task_config` - Mapping role → main task
- `ranking_range_config` - Ngưỡng PPH cho ranking
- `kpi_bonus_config` - Cấu hình tính thưởng
- `ors_catalog` - Danh mục 32 loại vi phạm
- `ors_milestone_config` - Ngưỡng ORS và penalty rate

### Result Tables (New)
- `kpi_weekly_summary` - Tổng hợp KPI tuần với PPH
- `ranking_weekly_result` - Kết quả ranking tuần
- `ors_event` - Sự kiện vi phạm ORS
- `ors_monthly_summary` - Tổng hợp ORS tháng
- `kpi_monthly_summary` - Tổng hợp KPI tháng

### Output Table
- `payroll_kpi_bridge` - Cầu nối dữ liệu cho payroll

## 📖 User Guide

### Cho Nhân viên
1. Vào **Dashboard Nhân viên**
2. Nhập Mã NV và chọn Warehouse
3. Xem điểm tuần, PPH, Ranking Score
4. Xem ORS cá nhân và KPI Bonus ước tính

### Cho Quản lý Kho
1. Vào **Dashboard Quản lý**
2. Chọn Warehouse và Tuần/Tháng
3. Xem tổng quan KPI team, bảng xếp hạng
4. Ghi nhận và Review sự cố ORS
5. **Export CSV** để xuất báo cáo

### Cho Admin/HR
1. Vào **Admin Configuration**
2. Cấu hình ngưỡng Ranking theo kho
3. Quản lý ORS Catalog
4. Chạy Jobs thủ công khi cần

### Cho Payroll
1. Vào **Payroll KPI Data**
2. Chọn kỳ lương và Warehouse
3. Review dữ liệu KPI
4. Apply vào payroll
5. **Export CSV** để xuất dữ liệu

## 🔗 API Reference

### Employee APIs
```
GET /api/employee/:staffId/kpi/weekly?yearWeek=2025-W03&warehouseCode=BMVN_HCM_TP
GET /api/employee/:staffId/kpi/monthly?payrollPeriod=2025-01
GET /api/employee/:staffId/ors
GET /api/employee/:staffId/ranking/history?limit=12
```

### Manager APIs
```
GET /api/manager/dashboard?warehouseCode=BMVN_HCM_TP&yearWeek=2025-W03
GET /api/manager/ranking?warehouseCode=BMVN_HCM_TP&yearWeek=2025-W03
GET /api/manager/ors/alerts?warehouseCode=BMVN_HCM_TP
GET /api/manager/ors/pending?warehouseCode=BMVN_HCM_TP
POST /api/manager/ors/create
POST /api/manager/ors/:eventId/review
```

### Demo APIs (No database required)
```
GET /demo/health
GET /demo/employee/:staffId/kpi/weekly
GET /demo/employee/:staffId/kpi/monthly
GET /demo/manager/dashboard
GET /demo/manager/ranking
GET /demo/admin/ors-catalog
GET /demo/payroll/bridge
```

### Jobs APIs
```
POST /api/jobs/run-a  { yearWeek, warehouseCode }
POST /api/jobs/run-b  { yearWeek, warehouseCode }
POST /api/jobs/run-c  { payrollPeriod, warehouseCode }
POST /api/jobs/run-d  { payrollPeriod, warehouseCode }
POST /api/jobs/run-pipeline  { yearWeek, payrollPeriod, warehouseCode }
```

### Payroll APIs
```
GET /api/payroll/bridge?payrollPeriod=2025-01&warehouseCode=BMVN_HCM_TP
POST /api/payroll/apply { payrollPeriod, warehouseCode, staffIds }
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

## 🏭 Warehouses

| Code | Name | Country | Currency |
|------|------|---------|----------|
| BMVN_HCM_TP | Boxme T.Tạo | VN | VND |
| BMVN_HCM_TT | Boxme L.Minh Xuân | VN | VND |
| BMVN_HN_LB | Boxme L.Biên | VN | VND |
| BMVN_BN_VSIP | Boxme VSIP - B.Ninh | VN | VND |
| BMVN_HCM_BTN | Boxme B.Tân | VN | VND |
| BMVN_HN_TT | Boxme T.Triều | VN | VND |
| BMTH_KRB | Boxme Thailand | TH | THB |
| BMPH_PDC | PDC - ONLINE | PH | PHP |
| BMID_ST | Boxme Jakarta | ID | IDR |
| BMMY_PJS | Boxme Malaysia | MY | MYR |

## 🛠 Tech Stack

- **Frontend**: Hono JSX + TailwindCSS
- **Backend**: Hono Framework on Cloudflare Workers
- **Database**: Supabase (PostgreSQL)
- **Charts**: Chart.js
- **Deployment**: Cloudflare Pages

## 📁 Project Structure

```
webapp/
├── src/
│   ├── index.tsx           # Main app entry
│   ├── renderer.tsx        # JSX renderer
│   ├── components/
│   │   └── Layout.tsx      # Layout component with Demo/Prod toggle
│   ├── pages/
│   │   ├── home.tsx        # Home page
│   │   ├── employee.tsx    # Employee dashboard
│   │   ├── manager.tsx     # Manager dashboard
│   │   ├── admin.tsx       # Admin configuration
│   │   └── payroll.tsx     # Payroll interface
│   ├── routes/
│   │   ├── api.ts          # Production API (Supabase)
│   │   └── demo.ts         # Demo API (No database)
│   ├── jobs/
│   │   ├── jobA.ts         # Weekly KPI summary
│   │   ├── jobB.ts         # Weekly ranking
│   │   ├── jobC.ts         # ORS monthly summary
│   │   ├── jobD.ts         # Monthly KPI summary
│   │   └── index.ts        # Job exports
│   ├── lib/
│   │   ├── supabase.ts     # Supabase client
│   │   ├── utils.ts        # Utility functions
│   │   └── export.ts       # Export utilities
│   └── types/
│       └── database.ts     # TypeScript types
├── database/
│   └── schema.sql          # Database schema
├── public/
│   └── static/
│       └── style.css       # Custom styles
├── ecosystem.config.cjs    # PM2 configuration
├── wrangler.jsonc          # Cloudflare configuration
├── vite.config.ts          # Vite configuration
├── package.json
└── README.md
```

## 📝 Next Steps

1. ✅ Chạy Schema SQL trong Supabase để tạo tables
2. ✅ Test với Demo Mode (không cần database)
3. 🔄 Import dữ liệu từ hệ thống cũ vào warehouse_productivity_daily
4. 🔄 Cấu hình role_main_task_config theo vai trò thực tế
5. 🔄 Điều chỉnh ranking_range_config dựa trên phân tích percentile
6. ⏳ Deploy lên Cloudflare Pages cho production

---

© 2025 Boxme KPI Warehouse Management System v2.0
