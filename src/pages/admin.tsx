import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { WAREHOUSES } from '../types/database'

export const AdminPage: FC = () => {
  const warehouses = Object.entries(WAREHOUSES)

  return (
    <Layout title="Admin Configuration" activeTab="admin">
      {/* Tabs - Horizontal Scroll on Mobile */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div class="border-b border-gray-200 overflow-x-auto">
          <nav class="flex -mb-px min-w-max" style="-webkit-overflow-scrolling: touch;">
            <button onclick="showTab('ranking')" id="tab-ranking" class="px-4 md:px-6 py-3 md:py-4 text-sm font-medium border-b-2 border-blue-500 text-blue-600 whitespace-nowrap">
              <span class="mr-1.5">⭐</span>Xếp hạng
            </button>
            <button onclick="showTab('role')" id="tab-role" class="px-4 md:px-6 py-3 md:py-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap">
              <span class="mr-1.5">👤</span>Vị trí
            </button>
            <button onclick="showTab('ors')" id="tab-ors" class="px-4 md:px-6 py-3 md:py-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap">
              <span class="mr-1.5">⚠️</span>Danh mục lỗi
            </button>
            <button onclick="showTab('bonus')" id="tab-bonus" class="px-4 md:px-6 py-3 md:py-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap">
              <span class="mr-1.5">💰</span>Thưởng
            </button>
            <button onclick="showTab('jobs')" id="tab-jobs" class="px-4 md:px-6 py-3 md:py-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap">
              <span class="mr-1.5">⚙️</span>Chạy Jobs
            </button>
            <button onclick="showTab('seed')" id="tab-seed" class="px-4 md:px-6 py-3 md:py-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap">
              <span class="mr-1.5">📊</span>Dữ liệu mẫu
            </button>
          </nav>
        </div>
      </div>

      {/* Ranking Config Tab */}
      <div id="content-ranking" class="tab-content">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          {/* Section Header */}
          <div class="mb-4">
            <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              ⭐ Cấu hình xếp hạng năng suất
            </h3>
            <p class="text-sm text-gray-500 mt-1">Đặt ngưỡng PPH để xếp hạng nhân viên từ 1-5 sao theo kho và vị trí.</p>
          </div>

          {/* Filters - Stack on mobile */}
          <div class="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <label class="flex items-center min-h-[44px]">
              <input type="checkbox" id="ranking-show-inactive" onchange="loadRankingConfig()" class="w-5 h-5 mr-2" />
              <span class="text-sm text-gray-600">Hiện cả cấu hình đã tắt</span>
            </label>
            <select id="ranking-warehouse-filter" onchange="loadRankingConfig()" class="border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]">
              <option value="">Tất cả kho</option>
              {warehouses.map(([code, info]) => (
                <option value={code}>{code}</option>
              ))}
            </select>
            <button onclick="openRankingModal()" class="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 min-h-[44px] font-medium">
              <i class="fas fa-plus mr-2"></i>Thêm mới
            </button>
          </div>
          {/* Table with Vietnamese headers */}
          <div class="overflow-x-auto -mx-4 md:mx-0">
            <table class="w-full min-w-[600px]">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Kho</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Vị trí</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">PPH tối thiểu</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">PPH tối đa</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Mức xếp hạng</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Giờ/tuần</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Trạng thái</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Thao tác</th>
                </tr>
              </thead>
              <tbody id="ranking-config-body" class="divide-y divide-gray-200">
                <tr><td colspan="8" class="px-4 py-8 text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i>Đang tải...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Role-Task Mapping Tab */}
      <div id="content-role" class="tab-content hidden">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          {/* Section Header */}
          <div class="mb-4">
            <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              👤 Gán vị trí ↔ Nhiệm vụ chính
            </h3>
            <p class="text-sm text-gray-500 mt-1">Chọn nhiệm vụ chính cho từng vị trí công việc (ví dụ: Packer, Picker, QC).</p>
          </div>

          {/* Filters */}
          <div class="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <label class="flex items-center min-h-[44px]">
              <input type="checkbox" id="role-show-inactive" onchange="loadRoleConfig()" class="w-5 h-5 mr-2" />
              <span class="text-sm text-gray-600">Hiện cả cấu hình đã tắt</span>
            </label>
            <button onclick="openRoleModal()" class="bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 min-h-[44px] font-medium">
              <i class="fas fa-plus mr-2"></i>Thêm mới
            </button>
          </div>

          {/* Table with Vietnamese headers */}
          <div class="overflow-x-auto -mx-4 md:mx-0">
            <table class="w-full min-w-[600px]">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Kho</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Tên vị trí</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Mã HRM</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Nhiệm vụ chính</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Áp dụng từ</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Trạng thái</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Thao tác</th>
                </tr>
              </thead>
              <tbody id="role-config-body" class="divide-y divide-gray-200">
                <tr><td colspan="7" class="px-4 py-8 text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i>Đang tải...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ORS Catalog Tab */}
      <div id="content-ors" class="tab-content hidden">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          {/* Section Header */}
          <div class="mb-4">
            <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              ⚠️ Danh mục lỗi ORS
            </h3>
            <p class="text-sm text-gray-500 mt-1">Quản lý danh sách lỗi vi phạm trong công việc, mức độ nghiêm trọng và điểm phạt.</p>
          </div>

          {/* Filters */}
          <div class="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <input type="text" id="ors-search" placeholder="Tìm theo mã, tên hoặc mô tả..." onkeyup="filterOrsCatalog()" class="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]" />
            <label class="flex items-center min-h-[44px]">
              <input type="checkbox" id="ors-show-inactive" onchange="loadOrsCatalog()" class="w-5 h-5 mr-2" />
              <span class="text-sm text-gray-600">Hiện cả lỗi đã tắt</span>
            </label>
            <button onclick="openOrsModal()" class="bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 min-h-[44px] font-medium">
              <i class="fas fa-plus mr-2"></i>Thêm mới
            </button>
          </div>

          {/* Table with Vietnamese headers */}
          <div class="overflow-x-auto -mx-4 md:mx-0">
            <table class="w-full min-w-[600px]">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Mã lỗi</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Nhóm công việc</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Tên lỗi</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Mức độ</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Điểm phạt</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Trạng thái</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Thao tác</th>
                </tr>
              </thead>
              <tbody id="ors-catalog-body" class="divide-y divide-gray-200">
                <tr><td colspan="7" class="px-4 py-8 text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i>Đang tải...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bonus Config Tab */}
      <div id="content-bonus" class="tab-content hidden">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          {/* Section Header */}
          <div class="mb-4">
            <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              💰 Cấu hình thưởng KPI
            </h3>
            <p class="text-sm text-gray-500 mt-1">Thiết lập cách tính tiền thưởng dựa trên điểm KPI hàng tháng.</p>
          </div>

          {/* Filters */}
          <div class="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <label class="flex items-center min-h-[44px]">
              <input type="checkbox" id="bonus-show-inactive" onchange="loadBonusConfig()" class="w-5 h-5 mr-2" />
              <span class="text-sm text-gray-600">Hiện cả cấu hình đã tắt</span>
            </label>
            <button onclick="openBonusModal()" class="bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 min-h-[44px] font-medium">
              <i class="fas fa-plus mr-2"></i>Thêm mới
            </button>
          </div>

          {/* Table with Vietnamese headers */}
          <div class="overflow-x-auto -mx-4 md:mx-0">
            <table class="w-full min-w-[700px]">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Kho</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Quốc gia</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Loại tính</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Tiền/1 điểm</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Giới hạn tối đa</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Tiền tệ</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Trạng thái</th>
                  <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500">Thao tác</th>
                </tr>
              </thead>
              <tbody id="bonus-config-body" class="divide-y divide-gray-200">
                <tr><td colspan="8" class="px-4 py-8 text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i>Đang tải...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sample Data Tab */}
      <div id="content-seed" class="tab-content hidden">
        {/* Section Header */}
        <div class="mb-4">
          <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            📊 Dữ liệu mẫu (Demo)
          </h3>
          <p class="text-sm text-gray-500 mt-1">Tạo dữ liệu mẫu để test hệ thống. Chỉ dùng cho môi trường Demo.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Current Stats */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h4 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-chart-bar text-blue-600"></i>
              Trạng thái dữ liệu
            </h4>
            <div id="seed-stats" class="space-y-3">
              <div class="text-center text-gray-500 py-4">
                <i class="fas fa-spinner fa-spin mr-2"></i>Đang tải...
              </div>
            </div>
            <button onclick="loadSeedStats()" class="mt-4 w-full bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 min-h-[44px] font-medium">
              <i class="fas fa-sync mr-2"></i>Làm mới
            </button>
          </div>

          {/* Generate Data */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h4 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-magic text-purple-600"></i>
              Tạo dữ liệu mẫu
            </h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kỳ lương (tháng)</label>
                <input type="month" id="seed-period" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Số tuần cần tạo</label>
                <select id="seed-weeks" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]">
                  <option value="1">1 tuần</option>
                  <option value="2">2 tuần</option>
                  <option value="3">3 tuần</option>
                  <option value="4" selected>4 tuần (cả tháng)</option>
                </select>
              </div>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p class="text-sm text-blue-800">
                  <i class="fas fa-info-circle mr-2"></i>
                  <strong>Ước tính:</strong> ~33 nhân viên × 3 kho × số tuần =
                  <span id="estimate-records" class="font-bold">132</span> bản ghi/bảng
                </p>
              </div>
              <button onclick="generateSeedData()" id="btn-generate" class="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 min-h-[48px]">
                <i class="fas fa-database mr-2"></i>
                Tạo dữ liệu mẫu
              </button>
            </div>
          </div>
        </div>

        {/* Data Preview */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mt-4 md:mt-6">
          <h4 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-eye text-green-600"></i>
            Xem trước dữ liệu
          </h4>
          <div class="flex flex-col md:flex-row gap-3 mb-4">
            <select id="preview-table" onchange="loadPreviewData()" class="border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]">
              <option value="kpi_weekly_summary">KPI tuần</option>
              <option value="ranking_weekly_result">Xếp hạng tuần</option>
              <option value="ors_event">Sự kiện ORS</option>
              <option value="ors_monthly_summary">ORS tháng</option>
              <option value="kpi_monthly_summary">KPI tháng</option>
              <option value="payroll_kpi_bridge">Cầu Payroll</option>
            </select>
            <span id="preview-count" class="text-sm text-gray-500 py-2"></span>
          </div>
          <div class="overflow-x-auto -mx-4 md:mx-0">
            <table class="w-full text-sm min-w-[500px]">
              <thead class="bg-gray-50">
                <tr id="preview-header">
                  <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Đang tải...</th>
                </tr>
              </thead>
              <tbody id="preview-body" class="divide-y divide-gray-200">
                <tr><td class="px-3 py-4 text-center text-gray-500">Chọn bảng để xem dữ liệu</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Danger Zone - Improved styling */}
        <div class="bg-red-50 border-2 border-red-300 rounded-xl p-4 md:p-6 mt-4 md:mt-6">
          <h4 class="text-base font-bold text-red-800 mb-3 flex items-center gap-2">
            <i class="fas fa-exclamation-triangle"></i>
            ⚠️ Vùng nguy hiểm
          </h4>
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p class="text-red-700 font-medium">Xóa toàn bộ dữ liệu mẫu</p>
              <p class="text-sm text-red-600">Xóa dữ liệu trong các bảng kết quả. Không ảnh hưởng cấu hình.</p>
            </div>
            <button onclick="resetSeedData()" class="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 min-h-[44px] font-medium whitespace-nowrap">
              <i class="fas fa-trash mr-2"></i>Xóa dữ liệu mẫu
            </button>
          </div>
        </div>

        {/* Generation Result */}
        <div id="seed-result" class="mt-4 md:mt-6 hidden">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h4 class="font-medium text-gray-900 mb-2">Kết quả:</h4>
            <pre id="seed-output" class="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto max-h-64"></pre>
          </div>
        </div>
      </div>

      {/* Jobs Tab */}
      <div id="content-jobs" class="tab-content hidden">
        {/* Section Header */}
        <div class="mb-4">
          <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            ⚙️ Chạy tính toán KPI
          </h3>
          <p class="text-sm text-gray-500 mt-1">Chạy các Job tính toán điểm KPI, xếp hạng, ORS và thưởng theo kỳ.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Individual Jobs */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h4 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-play text-blue-600"></i>
              Chạy Jobs thủ công
            </h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kho (để trống = tất cả)</label>
                <select id="job-warehouse" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]">
                  <option value="">Tất cả kho</option>
                  {warehouses.map(([code, info]) => (
                    <option value={code}>{code}</option>
                  ))}
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tuần (cho Job A, B)</label>
                <input type="week" id="job-week" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tháng (cho Job C, D)</label>
                <input type="month" id="job-month" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <button onclick="runJob('a')" class="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 min-h-[44px] font-medium">
                  <i class="fas fa-calculator mr-1"></i>Job A
                </button>
                <button onclick="runJob('b')" class="bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 min-h-[44px] font-medium">
                  <i class="fas fa-star mr-1"></i>Job B
                </button>
                <button onclick="runJob('c')" class="bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 min-h-[44px] font-medium">
                  <i class="fas fa-shield-alt mr-1"></i>Job C
                </button>
                <button onclick="runJob('d')" class="bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 min-h-[44px] font-medium">
                  <i class="fas fa-money-bill mr-1"></i>Job D
                </button>
              </div>
            </div>
          </div>

          {/* Full Pipeline */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h4 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-rocket text-orange-600"></i>
              Chạy đầy đủ A → B → C → D
            </h4>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <p class="text-sm text-orange-800">
                <i class="fas fa-info-circle mr-2"></i>
                Pipeline sẽ chạy tuần tự tất cả 4 Job cho kỳ đã chọn.
              </p>
            </div>
            <button onclick="runPipeline()" class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 min-h-[48px]">
              <i class="fas fa-play-circle mr-2"></i>
              Chạy Full Pipeline
            </button>

            {/* Job Results */}
            <div id="job-results" class="mt-4 hidden">
              <h4 class="font-medium text-gray-900 mb-2">Kết quả:</h4>
              <pre id="job-output" class="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto max-h-64"></pre>
            </div>
          </div>
        </div>

        {/* Job Descriptions - Vietnamese with clear explanations */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mt-4 md:mt-6">
          <h4 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-info-circle text-gray-600"></i>
            Giải thích các Job
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h5 class="font-bold text-blue-800 mb-2 flex items-center gap-2">
                <i class="fas fa-calculator"></i>Job A
              </h5>
              <p class="text-sm text-blue-700">Tính điểm KPI tuần và PPH (Points Per Hour)</p>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h5 class="font-bold text-purple-800 mb-2 flex items-center gap-2">
                <i class="fas fa-star"></i>Job B
              </h5>
              <p class="text-sm text-purple-700">Chấm xếp hạng 1-5 sao dựa trên PPH</p>
            </div>
            <div class="p-4 bg-red-50 rounded-lg border border-red-200">
              <h5 class="font-bold text-red-800 mb-2 flex items-center gap-2">
                <i class="fas fa-shield-alt"></i>Job C
              </h5>
              <p class="text-sm text-red-700">Tổng hợp lỗi ORS theo tháng</p>
            </div>
            <div class="p-4 bg-green-50 rounded-lg border border-green-200">
              <h5 class="font-bold text-green-800 mb-2 flex items-center gap-2">
                <i class="fas fa-money-bill"></i>Job D
              </h5>
              <p class="text-sm text-green-700">Tính thưởng KPI tháng (chuẩn bị payroll)</p>
            </div>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
        // Using window.window.API_BASE from Layout;
        let orsCatalogData = [];

        // Set default dates
        const now = new Date();
        document.getElementById('job-month').value = now.toISOString().slice(0, 7);
        const year = now.getFullYear();
        const onejan = new Date(year, 0, 1);
        const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        document.getElementById('job-week').value = year + '-W' + String(week).padStart(2, '0');

        function showTab(tab) {
          // Hide all tabs
          document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
          document.querySelectorAll('[id^="tab-"]').forEach(el => {
            el.classList.remove('border-blue-500', 'text-blue-600');
            el.classList.add('border-transparent', 'text-gray-500');
          });

          // Show selected tab
          document.getElementById('content-' + tab).classList.remove('hidden');
          const tabBtn = document.getElementById('tab-' + tab);
          tabBtn.classList.add('border-blue-500', 'text-blue-600');
          tabBtn.classList.remove('border-transparent', 'text-gray-500');

          // Load data
          if (tab === 'ranking') loadRankingConfig();
          if (tab === 'role') loadRoleConfig();
          if (tab === 'ors') loadOrsCatalog();
          if (tab === 'bonus') loadBonusConfig();
          if (tab === 'seed') { loadSeedStats(); loadPreviewData(); }
        }

        async function loadRankingConfig() {
          try {
            const warehouse = document.getElementById('ranking-warehouse-filter').value;
            const showInactive = document.getElementById('ranking-show-inactive')?.checked;
            const endpoint = showInactive ? '/admin/ranking-config/all' : '/admin/ranking-config';
            const url = window.API_BASE + endpoint + (warehouse ? '?warehouseCode=' + warehouse : '');
            const res = await axios.get(url);
            const data = res.data.data || [];

            const rankColors = { 5: 'text-green-600', 4: 'text-blue-600', 3: 'text-yellow-600', 2: 'text-orange-600', 1: 'text-red-600' };

            document.getElementById('ranking-config-body').innerHTML = data.map(r => \`
              <tr class="hover:bg-gray-50 \${!r.is_active ? 'opacity-50' : ''}">
                <td class="px-4 py-2">\${r.warehouse_code || 'Global'}</td>
                <td class="px-4 py-2">\${r.role || 'All'}</td>
                <td class="px-4 py-2">\${r.pph_min}</td>
                <td class="px-4 py-2">\${r.pph_max}</td>
                <td class="px-4 py-2 font-bold \${rankColors[r.ranking_score]}">\${r.ranking_score}</td>
                <td class="px-4 py-2">\${r.min_weekly_hours || 20}h</td>
                <td class="px-4 py-2">
                  <button onclick="toggleRankingConfig(\${r.id})" class="\${r.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} px-2 py-1 rounded-full text-xs cursor-pointer hover:opacity-80">
                    \${r.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td class="px-4 py-2">
                  <button onclick="editRankingConfig(\${JSON.stringify(r).replace(/"/g, '&quot;')})" class="text-blue-600 hover:text-blue-800 mr-2">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button onclick="deleteRankingConfig(\${r.id})" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            \`).join('') || '<tr><td colspan="8" class="px-4 py-8 text-center text-gray-500">Không có dữ liệu</td></tr>';
          } catch (error) {
            console.error('Error loading ranking config:', error);
          }
        }

        async function loadRoleConfig() {
          try {
            const showInactive = document.getElementById('role-show-inactive')?.checked;
            const endpoint = showInactive ? '/admin/role-task-config/all' : '/admin/role-task-config';
            const res = await axios.get(window.API_BASE + endpoint);
            const data = res.data.data || [];

            document.getElementById('role-config-body').innerHTML = data.map(r => \`
              <tr class="hover:bg-gray-50 \${!r.is_active ? 'opacity-50' : ''}">
                <td class="px-4 py-2">\${r.warehouse_code || 'Global'}</td>
                <td class="px-4 py-2 font-medium">\${r.role}</td>
                <td class="px-4 py-2">\${r.role_id || '-'}</td>
                <td class="px-4 py-2">
                  <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm capitalize">\${r.main_task}</span>
                </td>
                <td class="px-4 py-2">\${r.effective_from}</td>
                <td class="px-4 py-2">
                  <button onclick="toggleRoleConfig(\${r.id})" class="\${r.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} px-2 py-1 rounded-full text-xs cursor-pointer hover:opacity-80">
                    \${r.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td class="px-4 py-2">
                  <button onclick="editRoleConfig(\${JSON.stringify(r).replace(/"/g, '&quot;')})" class="text-blue-600 hover:text-blue-800 mr-2">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button onclick="deleteRoleConfig(\${r.id})" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            \`).join('') || '<tr><td colspan="7" class="px-4 py-8 text-center text-gray-500">Không có dữ liệu</td></tr>';
          } catch (error) {
            console.error('Error loading role config:', error);
          }
        }

        async function loadOrsCatalog() {
          try {
            const showInactive = document.getElementById('ors-show-inactive')?.checked;
            const endpoint = showInactive ? '/admin/ors-catalog/all' : '/admin/ors-catalog';
            const res = await axios.get(window.API_BASE + endpoint);
            orsCatalogData = res.data.data || [];
            renderOrsCatalog(orsCatalogData);
          } catch (error) {
            console.error('Error loading ORS catalog:', error);
          }
        }

        function renderOrsCatalog(data) {
          const severityColors = {
            S1: 'bg-blue-100 text-blue-800',
            S2: 'bg-yellow-100 text-yellow-800',
            S3: 'bg-orange-100 text-orange-800',
            S4: 'bg-red-100 text-red-800',
            S5: 'bg-red-900 text-white'
          };

          document.getElementById('ors-catalog-body').innerHTML = data.map(o => \`
            <tr class="hover:bg-gray-50 \${!o.is_active ? 'opacity-50' : ''}">
              <td class="px-4 py-2 font-mono text-sm font-medium">\${o.ors_code}</td>
              <td class="px-4 py-2 capitalize">\${o.job_group.replace('_', ' ')}</td>
              <td class="px-4 py-2" title="\${o.description || ''}">\${o.name}</td>
              <td class="px-4 py-2">
                <span class="\${severityColors[o.severity_level]} px-2 py-1 rounded text-sm font-medium">\${o.severity_level}</span>
              </td>
              <td class="px-4 py-2 font-bold text-red-600">\${o.ors_points}</td>
              <td class="px-4 py-2">
                <button onclick="toggleOrsConfig(\${o.id})" class="\${o.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} px-2 py-1 rounded-full text-xs cursor-pointer hover:opacity-80">
                  \${o.is_active ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td class="px-4 py-2">
                <button onclick="editOrsConfig(\${JSON.stringify(o).replace(/"/g, '&quot;')})" class="text-blue-600 hover:text-blue-800 mr-2">
                  <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteOrsConfig(\${o.id})" class="text-red-600 hover:text-red-800">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          \`).join('') || '<tr><td colspan="7" class="px-4 py-8 text-center text-gray-500">Không có dữ liệu</td></tr>';
        }

        function filterOrsCatalog() {
          const search = document.getElementById('ors-search').value.toLowerCase();
          const filtered = orsCatalogData.filter(o => 
            o.ors_code.toLowerCase().includes(search) ||
            o.name.toLowerCase().includes(search) ||
            o.job_group.toLowerCase().includes(search)
          );
          renderOrsCatalog(filtered);
        }

        async function loadBonusConfig() {
          try {
            const res = await axios.get(window.API_BASE + '/admin/bonus-config');
            const data = res.data.data || [];

            document.getElementById('bonus-config-body').innerHTML = data.map(b => \`
              <tr class="hover:bg-gray-50 \${!b.is_active ? 'opacity-50' : ''}">
                <td class="px-4 py-2">\${b.warehouse_code || 'All'}</td>
                <td class="px-4 py-2 font-medium">\${b.country || 'All'}</td>
                <td class="px-4 py-2">
                  <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">\${b.calculation_type}</span>
                </td>
                <td class="px-4 py-2">\${b.amount_per_point?.toLocaleString() || '-'}</td>
                <td class="px-4 py-2">\${b.cap_amount?.toLocaleString() || '-'}</td>
                <td class="px-4 py-2 font-medium">\${b.currency}</td>
                <td class="px-4 py-2">
                  <button onclick="toggleBonusConfig(\${b.id})" class="\${b.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} px-2 py-1 rounded-full text-xs cursor-pointer hover:opacity-80">
                    \${b.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td class="px-4 py-2">
                  <button onclick="editBonusConfig(\${JSON.stringify(b).replace(/"/g, '&quot;')})" class="text-blue-600 hover:text-blue-800 mr-2">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button onclick="deleteBonusConfig(\${b.id})" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            \`).join('') || '<tr><td colspan="8" class="px-4 py-8 text-center text-gray-500">Không có dữ liệu</td></tr>';
          } catch (error) {
            console.error('Error loading bonus config:', error);
          }
        }

        async function runJob(job) {
          const warehouse = document.getElementById('job-warehouse').value;
          const yearWeek = document.getElementById('job-week').value;
          const payrollPeriod = document.getElementById('job-month').value;

          const urls = {
            a: '/jobs/run-a',
            b: '/jobs/run-b',
            c: '/jobs/run-c',
            d: '/jobs/run-d'
          };

          const body = {
            warehouseCode: warehouse || undefined,
            yearWeek: yearWeek || undefined,
            payrollPeriod: payrollPeriod || undefined
          };

          try {
            document.getElementById('job-results').classList.remove('hidden');
            document.getElementById('job-output').textContent = 'Running Job ' + job.toUpperCase() + '...';

            const res = await axios.post(window.API_BASE + urls[job], body);
            document.getElementById('job-output').textContent = JSON.stringify(res.data, null, 2);
          } catch (error) {
            document.getElementById('job-output').textContent = 'Error: ' + (error.response?.data?.error || error.message);
          }
        }

        async function runPipeline() {
          const warehouse = document.getElementById('job-warehouse').value;
          const yearWeek = document.getElementById('job-week').value;
          const payrollPeriod = document.getElementById('job-month').value;

          try {
            document.getElementById('job-results').classList.remove('hidden');
            document.getElementById('job-output').textContent = 'Running full pipeline...';

            const res = await axios.post(window.API_BASE + '/jobs/run-pipeline', {
              warehouseCode: warehouse || undefined,
              yearWeek: yearWeek || undefined,
              payrollPeriod: payrollPeriod || undefined
            });
            document.getElementById('job-output').textContent = JSON.stringify(res.data, null, 2);
          } catch (error) {
            document.getElementById('job-output').textContent = 'Error: ' + (error.response?.data?.error || error.message);
          }
        }

        // Load initial data
        loadRankingConfig();

        // ========== SEED DATA FUNCTIONS ==========
        // Set default seed period
        document.getElementById('seed-period').value = new Date().toISOString().slice(0, 7);

        // Update estimate when weeks change
        document.getElementById('seed-weeks').addEventListener('change', function() {
          const weeks = parseInt(this.value);
          document.getElementById('estimate-records').textContent = (33 * weeks).toString();
        });

        async function loadSeedStats() {
          try {
            const res = await axios.get('/seed/stats');
            const stats = res.data.stats;

            const tables = [
              { key: 'kpi_weekly_summary', label: 'KPI Weekly Summary', icon: 'fa-calculator', color: 'blue' },
              { key: 'ranking_weekly_result', label: 'Ranking Weekly Result', icon: 'fa-star', color: 'purple' },
              { key: 'ors_event', label: 'ORS Events', icon: 'fa-exclamation-circle', color: 'red' },
              { key: 'ors_monthly_summary', label: 'ORS Monthly Summary', icon: 'fa-shield-alt', color: 'orange' },
              { key: 'kpi_monthly_summary', label: 'KPI Monthly Summary', icon: 'fa-chart-line', color: 'green' },
              { key: 'payroll_kpi_bridge', label: 'Payroll KPI Bridge', icon: 'fa-money-bill', color: 'teal' }
            ];

            document.getElementById('seed-stats').innerHTML = tables.map(t => {
              const count = stats[t.key]?.count || 0;
              const hasData = count > 0;
              return \`
                <div class="flex items-center justify-between p-3 bg-\${t.color}-50 rounded-lg">
                  <div class="flex items-center">
                    <i class="fas \${t.icon} text-\${t.color}-600 mr-3"></i>
                    <span class="text-sm font-medium text-gray-700">\${t.label}</span>
                  </div>
                  <span class="px-3 py-1 rounded-full text-sm font-bold \${hasData ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}">
                    \${count.toLocaleString()}
                  </span>
                </div>
              \`;
            }).join('');
          } catch (error) {
            document.getElementById('seed-stats').innerHTML = '<div class="text-red-500">Error loading stats</div>';
          }
        }

        async function generateSeedData() {
          const period = document.getElementById('seed-period').value;
          const weeks = document.getElementById('seed-weeks').value;

          if (!period) {
            alert('Vui lòng chọn Payroll Period');
            return;
          }

          const btn = document.getElementById('btn-generate');
          btn.disabled = true;
          btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Đang tạo dữ liệu...';

          try {
            document.getElementById('seed-result').classList.remove('hidden');
            document.getElementById('seed-output').textContent = 'Generating sample data...\\nPeriod: ' + period + '\\nWeeks: ' + weeks;

            const res = await axios.post('/seed/generate', {
              payrollPeriod: period,
              weeks: parseInt(weeks)
            });

            document.getElementById('seed-output').textContent = JSON.stringify(res.data, null, 2);
            loadSeedStats();
            loadPreviewData();

            alert('✅ Tạo dữ liệu thành công!');
          } catch (error) {
            document.getElementById('seed-output').textContent = 'Error: ' + (error.response?.data?.error || error.message);
            alert('❌ Lỗi: ' + (error.response?.data?.error || error.message));
          } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-database mr-2"></i>Generate Sample Data';
          }
        }

        async function loadPreviewData() {
          const table = document.getElementById('preview-table').value;

          try {
            const res = await axios.get('/seed/preview?table=' + table);
            const data = res.data.data || [];
            const total = res.data.total || 0;

            document.getElementById('preview-count').textContent = total + ' bản ghi (hiển thị ' + data.length + ')';

            if (data.length === 0) {
              document.getElementById('preview-header').innerHTML = '<th class="px-3 py-2 text-left text-xs font-medium text-gray-500">No data</th>';
              document.getElementById('preview-body').innerHTML = '<tr><td class="px-3 py-4 text-center text-gray-500">Không có dữ liệu. Hãy Generate Sample Data trước.</td></tr>';
              return;
            }

            // Get columns from first record
            const columns = Object.keys(data[0]).filter(k => !k.startsWith('_') && k !== 'created_at' && k !== 'updated_at');

            document.getElementById('preview-header').innerHTML = columns.map(c => 
              '<th class="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">' + c.replace(/_/g, ' ') + '</th>'
            ).join('');

            document.getElementById('preview-body').innerHTML = data.map(row => 
              '<tr class="hover:bg-gray-50">' + columns.map(c => {
                let val = row[c];
                if (val === null) val = '-';
                else if (typeof val === 'number') val = val.toLocaleString();
                else if (typeof val === 'boolean') val = val ? '✅' : '❌';
                return '<td class="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">' + val + '</td>';
              }).join('') + '</tr>'
            ).join('');
          } catch (error) {
            document.getElementById('preview-body').innerHTML = '<tr><td class="px-3 py-4 text-center text-red-500">Error: ' + error.message + '</td></tr>';
          }
        }

        async function resetSeedData() {
          if (!confirm('⚠️ Bạn có chắc muốn xóa toàn bộ dữ liệu sample?\\n\\nĐây là hành động không thể hoàn tác!')) {
            return;
          }

          try {
            document.getElementById('seed-result').classList.remove('hidden');
            document.getElementById('seed-output').textContent = 'Resetting data...';

            const res = await axios.post('/seed/reset');
            document.getElementById('seed-output').textContent = JSON.stringify(res.data, null, 2);
            loadSeedStats();
            loadPreviewData();

            alert('✅ Đã reset dữ liệu thành công!');
          } catch (error) {
            document.getElementById('seed-output').textContent = 'Error: ' + (error.response?.data?.error || error.message);
            alert('❌ Lỗi: ' + (error.response?.data?.error || error.message));
          }
        }

        // Auto-load stats and preview when seed tab is shown
        if (window.location.hash === '#seed' || document.getElementById('tab-seed').classList.contains('border-blue-500')) {
          loadSeedStats();
          loadPreviewData();
        }

        // ========== TOGGLE FUNCTIONS ==========
        async function toggleRankingConfig(id) {
          try {
            await axios.post(window.API_BASE + '/admin/ranking-config/' + id + '/toggle');
            loadRankingConfig();
          } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
          }
        }

        async function toggleRoleConfig(id) {
          try {
            await axios.post(window.API_BASE + '/admin/role-task-config/' + id + '/toggle');
            loadRoleConfig();
          } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
          }
        }

        async function toggleOrsConfig(id) {
          try {
            await axios.post(window.API_BASE + '/admin/ors-catalog/' + id + '/toggle');
            loadOrsCatalog();
          } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
          }
        }

        async function toggleBonusConfig(id) {
          try {
            await axios.post(window.API_BASE + '/admin/bonus-config/' + id + '/toggle');
            loadBonusConfig();
          } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
          }
        }

        // ========== DELETE FUNCTIONS ==========
        async function deleteRankingConfig(id) {
          if (!confirm('Bạn có chắc muốn xóa cấu hình này?')) return;
          try {
            await axios.delete(window.API_BASE + '/admin/ranking-config/' + id);
            loadRankingConfig();
            alert('Đã xóa thành công!');
          } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
          }
        }

        async function deleteRoleConfig(id) {
          if (!confirm('Bạn có chắc muốn xóa cấu hình này?')) return;
          try {
            await axios.delete(window.API_BASE + '/admin/role-task-config/' + id);
            loadRoleConfig();
            alert('Đã xóa thành công!');
          } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
          }
        }

        async function deleteOrsConfig(id) {
          if (!confirm('Bạn có chắc muốn xóa loại lỗi này?')) return;
          try {
            await axios.delete(window.API_BASE + '/admin/ors-catalog/' + id);
            loadOrsCatalog();
            alert('Đã xóa thành công!');
          } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
          }
        }

        async function deleteBonusConfig(id) {
          if (!confirm('Bạn có chắc muốn xóa cấu hình này?')) return;
          try {
            await axios.delete(window.API_BASE + '/admin/bonus-config/' + id);
            loadBonusConfig();
            alert('Đã xóa thành công!');
          } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
          }
        }

        // ========== MODAL FUNCTIONS ==========
        let currentEditId = null;

        function openRankingModal(data = null) {
          currentEditId = data?.id || null;
          document.getElementById('ranking-modal').classList.remove('hidden');
          document.getElementById('ranking-modal-title').textContent = data ? 'Sửa Ranking Config' : 'Thêm Ranking Config';
          
          document.getElementById('ranking-warehouse').value = data?.warehouse_code || '';
          document.getElementById('ranking-role').value = data?.role || '';
          document.getElementById('ranking-pph-min').value = data?.pph_min || '';
          document.getElementById('ranking-pph-max').value = data?.pph_max || '';
          document.getElementById('ranking-score').value = data?.ranking_score || '3';
          document.getElementById('ranking-min-hours').value = data?.min_weekly_hours || '20';
          document.getElementById('ranking-active').checked = data?.is_active !== false;
        }

        function closeRankingModal() {
          document.getElementById('ranking-modal').classList.add('hidden');
          currentEditId = null;
        }

        async function saveRankingConfig() {
          const data = {
            id: currentEditId,
            warehouse_code: document.getElementById('ranking-warehouse').value || null,
            role: document.getElementById('ranking-role').value || null,
            pph_min: document.getElementById('ranking-pph-min').value,
            pph_max: document.getElementById('ranking-pph-max').value,
            ranking_score: document.getElementById('ranking-score').value,
            min_weekly_hours: document.getElementById('ranking-min-hours').value,
            is_active: document.getElementById('ranking-active').checked
          };

          try {
            await axios.post(window.API_BASE + '/admin/ranking-config/upsert', data);
            closeRankingModal();
            loadRankingConfig();
            alert('Lưu thành công!');
          } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
          }
        }

        function editRankingConfig(data) {
          openRankingModal(data);
        }

        function openRoleModal(data = null) {
          currentEditId = data?.id || null;
          document.getElementById('role-modal').classList.remove('hidden');
          document.getElementById('role-modal-title').textContent = data ? 'Sửa Role-Task' : 'Thêm Role-Task';
          
          document.getElementById('role-warehouse').value = data?.warehouse_code || '';
          document.getElementById('role-name').value = data?.role || '';
          document.getElementById('role-id').value = data?.role_id || '';
          document.getElementById('role-main-task').value = data?.main_task || 'pack';
          document.getElementById('role-active').checked = data?.is_active !== false;
        }

        function closeRoleModal() {
          document.getElementById('role-modal').classList.add('hidden');
          currentEditId = null;
        }

        async function saveRoleConfig() {
          const data = {
            id: currentEditId,
            warehouse_code: document.getElementById('role-warehouse').value || null,
            role: document.getElementById('role-name').value,
            role_id: document.getElementById('role-id').value || null,
            main_task: document.getElementById('role-main-task').value,
            is_active: document.getElementById('role-active').checked
          };

          try {
            await axios.post(window.API_BASE + '/admin/role-task-config/upsert', data);
            closeRoleModal();
            loadRoleConfig();
            alert('Lưu thành công!');
          } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
          }
        }

        function editRoleConfig(data) {
          openRoleModal(data);
        }

        function openOrsModal(data = null) {
          currentEditId = data?.id || null;
          document.getElementById('ors-modal').classList.remove('hidden');
          document.getElementById('ors-modal-title').textContent = data ? 'Sửa ORS' : 'Thêm loại lỗi ORS';
          
          document.getElementById('ors-code').value = data?.ors_code || '';
          document.getElementById('ors-job-group').value = data?.job_group || 'packing';
          document.getElementById('ors-name').value = data?.name || '';
          document.getElementById('ors-description').value = data?.description || '';
          document.getElementById('ors-severity').value = data?.severity_level || 'S2';
          document.getElementById('ors-points').value = data?.ors_points || '3';
          document.getElementById('ors-active').checked = data?.is_active !== false;
        }

        function closeOrsModal() {
          document.getElementById('ors-modal').classList.add('hidden');
          currentEditId = null;
        }

        async function saveOrsConfig() {
          const data = {
            id: currentEditId,
            ors_code: document.getElementById('ors-code').value,
            job_group: document.getElementById('ors-job-group').value,
            name: document.getElementById('ors-name').value,
            description: document.getElementById('ors-description').value || null,
            severity_level: document.getElementById('ors-severity').value,
            ors_points: document.getElementById('ors-points').value,
            is_active: document.getElementById('ors-active').checked
          };

          try {
            await axios.post(window.API_BASE + '/admin/ors-catalog/upsert', data);
            closeOrsModal();
            loadOrsCatalog();
            alert('Lưu thành công!');
          } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
          }
        }

        function editOrsConfig(data) {
          openOrsModal(data);
        }

        function openBonusModal(data = null) {
          currentEditId = data?.id || null;
          document.getElementById('bonus-modal').classList.remove('hidden');
          document.getElementById('bonus-modal-title').textContent = data ? 'Sửa Bonus Config' : 'Thêm Bonus Config';
          
          document.getElementById('bonus-warehouse').value = data?.warehouse_code || '';
          document.getElementById('bonus-country').value = data?.country || 'VN';
          document.getElementById('bonus-type').value = data?.calculation_type || 'per_point';
          document.getElementById('bonus-amount-per-point').value = data?.amount_per_point || '';
          document.getElementById('bonus-fixed-amount').value = data?.fixed_amount || '';
          document.getElementById('bonus-cap').value = data?.cap_amount || '';
          document.getElementById('bonus-currency').value = data?.currency || 'VND';
          document.getElementById('bonus-active').checked = data?.is_active !== false;
        }

        function closeBonusModal() {
          document.getElementById('bonus-modal').classList.add('hidden');
          currentEditId = null;
        }

        async function saveBonusConfig() {
          const data = {
            id: currentEditId,
            warehouse_code: document.getElementById('bonus-warehouse').value || null,
            country: document.getElementById('bonus-country').value,
            calculation_type: document.getElementById('bonus-type').value,
            amount_per_point: document.getElementById('bonus-amount-per-point').value || null,
            fixed_amount: document.getElementById('bonus-fixed-amount').value || null,
            cap_amount: document.getElementById('bonus-cap').value || null,
            currency: document.getElementById('bonus-currency').value,
            is_active: document.getElementById('bonus-active').checked
          };

          try {
            await axios.post(window.API_BASE + '/admin/bonus-config/upsert', data);
            closeBonusModal();
            loadBonusConfig();
            alert('Lưu thành công!');
          } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
          }
        }

        function editBonusConfig(data) {
          openBonusModal(data);
        }
      `}} />

      {/* ========== MODALS ========== */}

      {/* Ranking Config Modal */}
      <div id="ranking-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
          <div class="flex items-center justify-between p-4 border-b">
            <h3 id="ranking-modal-title" class="text-lg font-semibold text-gray-900">Thêm Ranking Config</h3>
            <button onclick="closeRankingModal()" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Warehouse (để trống = Global)</label>
              <select id="ranking-warehouse" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">Global (All)</option>
                {warehouses.map(([code]) => <option value={code}>{code}</option>)}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role (để trống = All)</label>
              <input type="text" id="ranking-role" placeholder="VD: Packer, Picker..." class="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">PPH Min</label>
                <input type="number" id="ranking-pph-min" step="0.01" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">PPH Max</label>
                <input type="number" id="ranking-pph-max" step="0.01" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ranking Score</label>
                <select id="ranking-score" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="5">5 - Xuất sắc</option>
                  <option value="4">4 - Tốt</option>
                  <option value="3">3 - Trung bình</option>
                  <option value="2">2 - Cần cải thiện</option>
                  <option value="1">1 - Yếu</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Min Hours/Tuần</label>
                <input type="number" id="ranking-min-hours" step="0.5" value="20" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="ranking-active" checked class="w-4 h-4 text-blue-600 border-gray-300 rounded" />
              <label for="ranking-active" class="ml-2 text-sm text-gray-700">Active</label>
            </div>
          </div>
          <div class="flex justify-end gap-3 p-4 border-t">
            <button onclick="closeRankingModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">Hủy</button>
            <button onclick="saveRankingConfig()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu</button>
          </div>
        </div>
      </div>

      {/* Role-Task Modal */}
      <div id="role-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
          <div class="flex items-center justify-between p-4 border-b">
            <h3 id="role-modal-title" class="text-lg font-semibold text-gray-900">Thêm Role-Task</h3>
            <button onclick="closeRoleModal()" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Warehouse (để trống = Global)</label>
              <select id="role-warehouse" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">Global (All)</option>
                {warehouses.map(([code]) => <option value={code}>{code}</option>)}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role Name *</label>
              <input type="text" id="role-name" placeholder="VD: Packer, Picker, QC Staff..." class="w-full border border-gray-300 rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role ID (mã từ HRM)</label>
              <input type="text" id="role-id" placeholder="VD: R001, R002..." class="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Main Task *</label>
              <select id="role-main-task" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="pack">Pack - Đóng gói</option>
                <option value="pick">Pick - Lấy hàng</option>
                <option value="qc">QC - Kiểm tra chất lượng</option>
                <option value="data_entry">Data Entry - Nhập liệu</option>
                <option value="handover">Handover - Giao hàng</option>
                <option value="putaway">Putaway - Nhập kho</option>
                <option value="inventory">Inventory - Kiểm kê</option>
                <option value="return">Return - Xử lý đổi trả</option>
              </select>
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="role-active" checked class="w-4 h-4 text-purple-600 border-gray-300 rounded" />
              <label for="role-active" class="ml-2 text-sm text-gray-700">Active</label>
            </div>
          </div>
          <div class="flex justify-end gap-3 p-4 border-t">
            <button onclick="closeRoleModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">Hủy</button>
            <button onclick="saveRoleConfig()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Lưu</button>
          </div>
        </div>
      </div>

      {/* ORS Catalog Modal */}
      <div id="ors-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
          <div class="flex items-center justify-between p-4 border-b">
            <h3 id="ors-modal-title" class="text-lg font-semibold text-gray-900">Thêm loại lỗi ORS</h3>
            <button onclick="closeOrsModal()" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ORS Code *</label>
                <input type="text" id="ors-code" placeholder="VD: PACK-001" class="w-full border border-gray-300 rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Job Group *</label>
                <select id="ors-job-group" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="packing">Packing - Đóng gói</option>
                  <option value="picking">Picking - Lấy hàng</option>
                  <option value="qc_inspection">QC Inspection - Kiểm tra</option>
                  <option value="data_entry">Data Entry - Nhập liệu</option>
                  <option value="handover">Handover - Giao nhận</option>
                  <option value="inventory">Inventory - Kiểm kê</option>
                  <option value="safety">Safety - An toàn</option>
                  <option value="general">General - Chung</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tên lỗi *</label>
              <input type="text" id="ors-name" placeholder="VD: Đóng gói sai quy cách" class="w-full border border-gray-300 rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea id="ors-description" rows="2" placeholder="Mô tả chi tiết lỗi..." class="w-full border border-gray-300 rounded-lg px-3 py-2"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mức độ *</label>
                <select id="ors-severity" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="S1">S1 - Nhẹ</option>
                  <option value="S2" selected>S2 - Trung bình</option>
                  <option value="S3">S3 - Nghiêm trọng</option>
                  <option value="S4">S4 - Rất nghiêm trọng</option>
                  <option value="S5">S5 - Cực kỳ nghiêm trọng</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Điểm phạt *</label>
                <input type="number" id="ors-points" value="3" min="1" max="20" class="w-full border border-gray-300 rounded-lg px-3 py-2" required />
              </div>
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="ors-active" checked class="w-4 h-4 text-red-600 border-gray-300 rounded" />
              <label for="ors-active" class="ml-2 text-sm text-gray-700">Active</label>
            </div>
          </div>
          <div class="flex justify-end gap-3 p-4 border-t">
            <button onclick="closeOrsModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">Hủy</button>
            <button onclick="saveOrsConfig()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Lưu</button>
          </div>
        </div>
      </div>

      {/* Bonus Config Modal */}
      <div id="bonus-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
          <div class="flex items-center justify-between p-4 border-b">
            <h3 id="bonus-modal-title" class="text-lg font-semibold text-gray-900">Thêm Bonus Config</h3>
            <button onclick="closeBonusModal()" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Warehouse (để trống = All)</label>
              <select id="bonus-warehouse" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">All Warehouses</option>
                {warehouses.map(([code]) => <option value={code}>{code}</option>)}
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Quốc gia *</label>
                <select id="bonus-country" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="VN">Vietnam</option>
                  <option value="TH">Thailand</option>
                  <option value="PH">Philippines</option>
                  <option value="ID">Indonesia</option>
                  <option value="MY">Malaysia</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Currency *</label>
                <select id="bonus-currency" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="VND">VND</option>
                  <option value="THB">THB</option>
                  <option value="PHP">PHP</option>
                  <option value="IDR">IDR</option>
                  <option value="MYR">MYR</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Calculation Type *</label>
              <select id="bonus-type" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="per_point">Per Point - Tính theo điểm</option>
                <option value="fixed">Fixed - Mức cố định</option>
                <option value="percentage">Percentage - Phần trăm lương</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Amount/Point</label>
                <input type="number" id="bonus-amount-per-point" step="0.01" placeholder="VD: 1000" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fixed Amount</label>
                <input type="number" id="bonus-fixed-amount" step="0.01" placeholder="VD: 500000" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cap (Giới hạn tối đa)</label>
              <input type="number" id="bonus-cap" step="0.01" placeholder="VD: 5000000" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="bonus-active" checked class="w-4 h-4 text-green-600 border-gray-300 rounded" />
              <label for="bonus-active" class="ml-2 text-sm text-gray-700">Active</label>
            </div>
          </div>
          <div class="flex justify-end gap-3 p-4 border-t">
            <button onclick="closeBonusModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">Hủy</button>
            <button onclick="saveBonusConfig()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Lưu</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
