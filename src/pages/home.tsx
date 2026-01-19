import type { FC } from 'hono/jsx'
import { Layout, StatCard } from '../components/Layout'

export const HomePage: FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-8 text-white">
        <div class="max-w-3xl">
          <h1 class="text-4xl font-bold mb-4">
            <i class="fas fa-chart-line mr-3"></i>
            Hệ thống KPI Kho Vận Thế hệ Mới
          </h1>
          <p class="text-xl text-blue-100 mb-6">
            Đo lường hiệu suất chính xác với PPH (Points Per Hour), xếp hạng công bằng 
            và quản lý rủi ro vận hành ORS.
          </p>
          <div class="flex flex-wrap gap-4">
            <a href="/employee" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              <i class="fas fa-user mr-2"></i>
              Xem KPI Cá nhân
            </a>
            <a href="/manager" class="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors">
              <i class="fas fa-users-cog mr-2"></i>
              Dashboard Quản lý
            </a>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="PPH - Points Per Hour"
          value="Hiệu suất thực"
          icon="fas fa-tachometer-alt"
          color="blue"
          subtitle="So sánh công bằng giữa các nhân viên"
        />
        <StatCard
          title="Ranking Score"
          value="1 - 5"
          icon="fas fa-star"
          color="yellow"
          subtitle="Xếp hạng theo ngưỡng PPH cấu hình"
        />
        <StatCard
          title="ORS System"
          value="Quản lý rủi ro"
          icon="fas fa-shield-alt"
          color="red"
          subtitle="32 loại vi phạm, 5 mức milestone"
        />
        <StatCard
          title="KPI Bonus"
          value="Tự động tính"
          icon="fas fa-money-bill-wave"
          color="green"
          subtitle="Major KPI × Rating Factor"
        />
      </div>

      {/* Quick Access Cards */}
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        <i class="fas fa-rocket mr-2 text-blue-600"></i>
        Truy cập nhanh
      </h2>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Employee Card */}
        <a href="/employee" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all group">
          <div class="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
            <i class="fas fa-user text-blue-600 text-2xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Nhân viên</h3>
          <ul class="text-sm text-gray-600 space-y-1">
            <li><i class="fas fa-check text-green-500 mr-2"></i>Xem điểm tuần/tháng</li>
            <li><i class="fas fa-check text-green-500 mr-2"></i>Xem PPH & Ranking</li>
            <li><i class="fas fa-check text-green-500 mr-2"></i>Theo dõi ORS cá nhân</li>
          </ul>
        </a>

        {/* Manager Card */}
        <a href="/manager" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all group">
          <div class="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
            <i class="fas fa-users-cog text-purple-600 text-2xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Quản lý Kho</h3>
          <ul class="text-sm text-gray-600 space-y-1">
            <li><i class="fas fa-check text-green-500 mr-2"></i>Dashboard tổng quan</li>
            <li><i class="fas fa-check text-green-500 mr-2"></i>Bảng xếp hạng team</li>
            <li><i class="fas fa-check text-green-500 mr-2"></i>Ghi nhận & Review ORS</li>
          </ul>
        </a>

        {/* Admin Card */}
        <a href="/admin" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all group">
          <div class="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
            <i class="fas fa-cogs text-orange-600 text-2xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Admin/HR</h3>
          <ul class="text-sm text-gray-600 space-y-1">
            <li><i class="fas fa-check text-green-500 mr-2"></i>Cấu hình Ranking Range</li>
            <li><i class="fas fa-check text-green-500 mr-2"></i>Quản lý ORS Catalog</li>
            <li><i class="fas fa-check text-green-500 mr-2"></i>Chạy Jobs thủ công</li>
          </ul>
        </a>

        {/* Payroll Card */}
        <a href="/payroll" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all group">
          <div class="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
            <i class="fas fa-money-check-alt text-green-600 text-2xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Payroll</h3>
          <ul class="text-sm text-gray-600 space-y-1">
            <li><i class="fas fa-check text-green-500 mr-2"></i>Lấy dữ liệu KPI</li>
            <li><i class="fas fa-check text-green-500 mr-2"></i>Review trước áp dụng</li>
            <li><i class="fas fa-check text-green-500 mr-2"></i>Đánh dấu đã apply</li>
          </ul>
        </a>
      </div>

      {/* Info Section */}
      <div class="grid md:grid-cols-2 gap-6">
        {/* How It Works */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>
            Cách tính KPI
          </h3>
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</div>
              <div>
                <p class="font-medium text-gray-900">Tính PPH hàng tuần</p>
                <p class="text-sm text-gray-600">PPH = Điểm công việc chính / Số giờ làm việc</p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</div>
              <div>
                <p class="font-medium text-gray-900">Chấm Ranking Score (1-5)</p>
                <p class="text-sm text-gray-600">Dựa trên ngưỡng PPH cấu hình theo kho</p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</div>
              <div>
                <p class="font-medium text-gray-900">Tính KPI Bonus tháng</p>
                <p class="text-sm text-gray-600">Major KPI × Amount per Point × Rating Factor × (1 - ORS Penalty)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ranking Guide */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            <i class="fas fa-star text-yellow-500 mr-2"></i>
            Thang đánh giá Ranking
          </h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div class="flex items-center">
                <div class="ranking-5 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3">5</div>
                <span class="font-medium">Xuất sắc</span>
              </div>
              <span class="text-sm text-gray-600">PPH ≥ 50 | RF: 1.00</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div class="flex items-center">
                <div class="ranking-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3">4</div>
                <span class="font-medium">Tốt</span>
              </div>
              <span class="text-sm text-gray-600">PPH 40-49 | RF: 0.95</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div class="flex items-center">
                <div class="ranking-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3">3</div>
                <span class="font-medium">Đạt yêu cầu</span>
              </div>
              <span class="text-sm text-gray-600">PPH 30-39 | RF: 0.85</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div class="flex items-center">
                <div class="ranking-2 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3">2</div>
                <span class="font-medium">Cần cải thiện</span>
              </div>
              <span class="text-sm text-gray-600">PPH 20-29 | RF: 0.70</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div class="flex items-center">
                <div class="ranking-1 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3">1</div>
                <span class="font-medium">Chưa đạt</span>
              </div>
              <span class="text-sm text-gray-600">PPH &lt; 20 | RF: 0.50</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
