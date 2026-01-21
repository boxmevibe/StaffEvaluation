import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

export const HomePage: FC = () => {
  return (
    <Layout>
      {/* Hero Section - Mobile Optimized */}
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 md:p-8 mb-8 text-white shadow-lg">
        <div class="max-w-3xl">
          <Badge variant="secondary" className="mb-4 bg-blue-500/30 text-blue-50 border-blue-400/40 text-sm px-3 py-1">
            🚀 v2.0 Phiên bản mới
          </Badge>
          <h1 class="text-2xl md:text-4xl font-bold mb-4 tracking-tight leading-tight">
            <i class="fas fa-chart-line mr-2 md:mr-3"></i>
            Hệ thống KPI Kho Vận
          </h1>
          <p class="text-base md:text-xl text-blue-100 mb-6 md:mb-8 leading-relaxed max-w-[95%]">
            Đo lường hiệu suất chính xác, xếp hạng công bằng và quản lý rủi ro vận hành.
          </p>
          <div class="flex flex-col md:flex-row gap-3 md:gap-4">
            <Button href="/employee" size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-0 font-bold w-full md:w-auto justify-center text-base py-3">
              <span class="mr-2">👤</span>
              Tra Cứu Nhân Viên
            </Button>
            <Button href="/manager" size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-blue-50 border-0 font-bold w-full md:w-auto justify-center text-base py-3">
              <span class="mr-2">📊</span>
              Quản Lý Chung
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid - Responsive 1 -> 2 -> 4 columns */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        <Card className="border-blue-100">
          <CardContent className="p-5">
            <div class="flex items-start gap-4">
              <div class="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                <i class="fas fa-tachometer-alt text-blue-600 text-2xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">PPH - Điểm/Giờ</h3>
                <p class="text-sm text-gray-700 leading-relaxed">Công bằng: So hiệu suất mọi người</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-100">
          <CardContent className="p-5">
            <div class="flex items-start gap-4">
              <div class="bg-yellow-100 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                <i class="fas fa-star text-yellow-600 text-2xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">Xếp Hạng 1-5</h3>
                <p class="text-sm text-gray-700 leading-relaxed">Đánh giá theo mức điểm/giờ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-100">
          <CardContent className="p-5">
            <div class="flex items-start gap-4">
              <div class="bg-red-100 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                <i class="fas fa-shield-alt text-red-600 text-2xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">Theo Dõi Lỗi (ORS)</h3>
                <p class="text-sm text-gray-700 leading-relaxed">32 loại vi phạm, 5 cấp độ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardContent className="p-5">
            <div class="flex items-start gap-4">
              <div class="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                <i class="fas fa-money-bill-wave text-green-600 text-2xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">Thưởng KPI</h3>
                <p class="text-sm text-gray-700 leading-relaxed">Tính tự động theo điểm</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards - Mobile Optimized */}
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl md:text-2xl font-bold text-gray-900">
          <i class="fas fa-rocket mr-2 text-blue-600"></i>
          Truy cập nhanh
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {/* Employee Card */}
        <a href="/employee" class="group block">
          <Card className="hover:shadow-lg transition-all border-blue-100 hover:border-blue-300 group-hover:-translate-y-1 h-full">
            <CardContent className="p-5">
              <div class="flex items-center gap-4">
                <div class="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors flex-shrink-0">
                  <i class="fas fa-user text-blue-600 text-2xl group-hover:text-white transition-colors"></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 text-base">👤 Nhân Viên</h3>
                  <p class="text-sm text-gray-600">Xem điểm của bạn</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </a>

        {/* Manager Card */}
        <a href="/manager" class="group block">
          <Card className="hover:shadow-lg transition-all border-purple-100 hover:border-purple-300 group-hover:-translate-y-1 h-full">
            <CardContent className="p-5">
              <div class="flex items-center gap-4">
                <div class="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors flex-shrink-0">
                  <i class="fas fa-users-cog text-purple-600 text-2xl group-hover:text-white transition-colors"></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 text-base">📊 Quản Lý Kho</h3>
                  <p class="text-sm text-gray-600">Quản lý team</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </a>

        {/* Admin Card */}
        <a href="/admin" class="group block">
          <Card className="hover:shadow-lg transition-all border-orange-100 hover:border-orange-300 group-hover:-translate-y-1 h-full">
            <CardContent className="p-5">
              <div class="flex items-center gap-4">
                <div class="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center group-hover:bg-orange-600 transition-colors flex-shrink-0">
                  <i class="fas fa-cogs text-orange-600 text-2xl group-hover:text-white transition-colors"></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 text-base">⚙️ Admin</h3>
                  <p class="text-sm text-gray-600">Cài đặt hệ thống</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </a>

        {/* Payroll Card */}
        <a href="/payroll" class="group block">
          <Card className="hover:shadow-lg transition-all border-green-100 hover:border-green-300 group-hover:-translate-y-1 h-full">
            <CardContent className="p-5">
              <div class="flex items-center gap-4">
                <div class="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors flex-shrink-0">
                  <i class="fas fa-money-check-alt text-green-600 text-2xl group-hover:text-white transition-colors"></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 text-base">💰 Payroll</h3>
                  <p class="text-sm text-gray-600">Tính lương KPI</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </a>
      </div>

      {/* Info Section */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* How It Works - Plain Language */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <i class="fas fa-lightbulb text-yellow-500"></i>
              Cách tính KPI
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <span class="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold text-base shadow-md">1</span>
                <div>
                  <p class="font-bold text-gray-900 text-base">Tính Điểm Giờ (PPH)</p>
                  <p class="text-sm text-gray-600 mt-1">Tổng Điểm ÷ Giờ Làm = Điểm/Giờ</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold text-base shadow-md">2</span>
                <div>
                  <p class="font-bold text-gray-900 text-base">Xếp Hạng (1-5 sao)</p>
                  <p class="text-sm text-gray-600 mt-1">Dựa trên mức điểm/giờ của bạn</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold text-base shadow-md">3</span>
                <div>
                  <p class="font-bold text-gray-900 text-base">Tính Thưởng Tháng</p>
                  <p class="text-sm text-gray-600 mt-1">Điểm × Tiền/1 điểm × Mức xếp hạng</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ranking Guide - Mobile Card Layout */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <i class="fas fa-star text-yellow-500"></i>
              Mức Xếp Hạng
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div class="space-y-3">
              {[
                { score: 5, emoji: '🏅', label: 'Xuất Sắc', range: '≥50 điểm/giờ', bonus: '100%', bg: 'bg-green-50 border-green-200', color: 'ranking-5' },
                { score: 4, emoji: '⭐', label: 'Tốt', range: '40-49 điểm', bonus: '95%', bg: 'bg-blue-50 border-blue-200', color: 'ranking-4' },
                { score: 3, emoji: '✓', label: 'Đạt', range: '30-39 điểm', bonus: '85%', bg: 'bg-yellow-50 border-yellow-200', color: 'ranking-3' },
                { score: 2, emoji: '⚠️', label: 'Cần cải thiện', range: '20-29 điểm', bonus: '70%', bg: 'bg-orange-50 border-orange-200', color: 'ranking-2' },
                { score: 1, emoji: '❌', label: 'Chưa đạt', range: '<20 điểm', bonus: '50%', bg: 'bg-red-50 border-red-200', color: 'ranking-1' },
              ].map(rank => (
                <div class={`flex items-center justify-between p-3 rounded-xl border ${rank.bg}`}>
                  <div class="flex items-center gap-3">
                    <div class={`${rank.color} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md text-lg`}>{rank.score}</div>
                    <div>
                      <span class="font-bold text-gray-900 text-base">{rank.emoji} {rank.label}</span>
                      <p class="text-xs text-gray-600">{rank.range}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-sm font-bold">{rank.bonus} thưởng</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
