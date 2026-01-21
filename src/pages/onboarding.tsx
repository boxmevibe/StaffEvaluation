import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/utils'

export const OnboardingPage: FC = () => {
  return (
    <Layout title="Hướng dẫn sử dụng">
      <div class="max-w-3xl mx-auto pb-20">
        {/* Header & Progress */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 sticky top-0 z-10">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Tiến độ học</span>
            <span id="progress-text" class="text-sm font-bold text-blue-600">1/6 bước</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div id="progress-bar" class="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out" style="width: 16.66%"></div>
          </div>

          {/* Mobile-friendly Breadcrumbs/Indicators */}
          <div class="flex justify-between mt-3 px-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <button
                key={i}
                onclick={`if(isStepUnlocked(${i})) showStep(${i})`}
                class={cn(
                  "w-2 h-2 rounded-full transition-all duration-300 step-dot",
                  i === 1 ? "bg-blue-600 scale-125" : "bg-gray-300"
                )}
                id={`dot-${i}`}
                aria-label={`Step ${i}`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: GIỚI THIỆU */}
        <div id="step-1" class="step-content">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white text-center">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-rocket text-2xl"></i>
              </div>
              <h2 class="text-xl font-bold mb-1">Bước 1/6 – Giới thiệu</h2>
              <p class="text-blue-100 text-sm">Hiểu về hệ thống đánh giá năng suất mới</p>
            </div>

            <div class="p-6">
              <div class="mb-8">
                <h3 class="font-bold text-gray-900 mb-4 flex items-center">
                  <i class="fas fa-bullseye text-blue-600 mr-2"></i>
                  Mục tiêu hệ thống
                </h3>
                <ul class="space-y-3">
                  <li class="flex items-start">
                    <div class="shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5 mr-3">
                      <i class="fas fa-check text-xs"></i>
                    </div>
                    <span class="text-gray-600 text-sm leading-relaxed">Đánh giá năng suất công bằng cho mọi nhân viên.</span>
                  </li>
                  <li class="flex items-start">
                    <div class="shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5 mr-3">
                      <i class="fas fa-check text-xs"></i>
                    </div>
                    <span class="text-gray-600 text-sm leading-relaxed">Tính thưởng KPI minh bạch, rõ ràng.</span>
                  </li>
                  <li class="flex items-start">
                    <div class="shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5 mr-3">
                      <i class="fas fa-check text-xs"></i>
                    </div>
                    <span class="text-gray-600 text-sm leading-relaxed">Giúp bạn theo dõi hiệu suất mỗi ngày.</span>
                  </li>
                </ul>
              </div>

              <div class="mb-8 bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                <h3 class="font-bold text-blue-900 mb-3 flex items-center">
                  <i class="fas fa-gift text-blue-600 mr-2"></i>
                  Lợi ích cho bạn
                </h3>
                <ul class="space-y-2">
                  <li class="flex items-start text-sm text-blue-800">
                    <i class="fas fa-star text-yellow-500 mr-2 mt-1"></i>
                    <span>Biết mình đang ở mức nào so với tiêu chuẩn kho.</span>
                  </li>
                  <li class="flex items-start text-sm text-blue-800">
                    <i class="fas fa-star text-yellow-500 mr-2 mt-1"></i>
                    <span>Ước lượng được tiền thưởng dự kiến.</span>
                  </li>
                  <li class="flex items-start text-sm text-blue-800">
                    <i class="fas fa-star text-yellow-500 mr-2 mt-1"></i>
                    <span>Biết cần cải thiện điều gì để thưởng cao hơn.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 class="font-bold text-gray-900 mb-4 text-center">3 Điều cần nhớ</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="border border-gray-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i class="fas fa-tachometer-alt"></i>
                    </div>
                    <p class="font-bold text-gray-900 text-sm mb-1">PPH</p>
                    <p class="text-xs text-gray-500">Điểm trung bình mỗi giờ</p>
                  </div>
                  <div class="border border-gray-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i class="fas fa-star"></i>
                    </div>
                    <p class="font-bold text-gray-900 text-sm mb-1">Ranking</p>
                    <p class="text-xs text-gray-500">Xếp hạng 1–5</p>
                  </div>
                  <div class="border border-gray-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i class="fas fa-shield-alt"></i>
                    </div>
                    <p class="font-bold text-gray-900 text-sm mb-1">ORS</p>
                    <p class="text-xs text-gray-500">Điểm lỗi (càng thấp càng tốt)</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <Button onclick="nextStep(2)" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>

        {/* STEP 2: PPH & RANKING */}
        <div id="step-2" class="step-content hidden">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white text-center">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-chart-line text-2xl"></i>
              </div>
              <h2 class="text-xl font-bold mb-1">Bước 2/6 – PPH & Ranking</h2>
              <p class="text-indigo-100 text-sm">Chỉ số năng suất & Xếp hạng</p>
            </div>

            <div class="p-6">
              {/* PPH Section */}
              <div class="mb-8">
                <h3 class="font-bold text-gray-900 mb-3 bg-gray-50 p-2 rounded-lg inline-block">
                  1. PPH – Đơn mỗi giờ
                </h3>
                <p class="text-sm text-gray-600 mb-3">
                  Hiểu đơn giản: Tốc độ làm việc của bạn trong 1 giờ.
                </p>

                <div class="bg-indigo-50 rounded-xl p-4 mb-4 border border-indigo-100">
                  <div class="flex items-center justify-center mb-2">
                    <code class="text-indigo-700 font-mono bg-white px-3 py-1 rounded border border-indigo-200 text-sm">
                      PPH = Điểm Main Task ÷ Số giờ làm
                    </code>
                  </div>
                  <p class="text-xs text-center text-gray-500 italic">
                    Ví dụ: Bạn có 1,000 điểm trong 20 giờ làm → PPH = 50.
                  </p>
                </div>

                <div class="space-y-2">
                  <div class="flex items-stretch bg-white border border-green-200 rounded-lg overflow-hidden">
                    <div class="w-2 bg-green-500"></div>
                    <div class="p-3 flex-1 flex justify-between items-center">
                      <div>
                        <span class="font-bold text-green-700 block text-sm">≥ 50 PPH</span>
                        <span class="text-xs text-gray-500">Xuất sắc - Top performer</span>
                      </div>
                      <i class="fas fa-laugh-beam text-green-500 text-xl"></i>
                    </div>
                  </div>
                  <div class="flex items-stretch bg-white border border-blue-200 rounded-lg overflow-hidden">
                    <div class="w-2 bg-blue-500"></div>
                    <div class="p-3 flex-1 flex justify-between items-center">
                      <div>
                        <span class="font-bold text-blue-700 block text-sm">40–49 PPH</span>
                        <span class="text-xs text-gray-500">Tốt - Đạt yêu cầu cao</span>
                      </div>
                      <i class="fas fa-smile text-blue-500 text-xl"></i>
                    </div>
                  </div>
                  <div class="flex items-stretch bg-white border border-yellow-200 rounded-lg overflow-hidden">
                    <div class="w-2 bg-yellow-500"></div>
                    <div class="p-3 flex-1 flex justify-between items-center">
                      <div>
                        <span class="font-bold text-yellow-700 block text-sm">30–39 PPH</span>
                        <span class="text-xs text-gray-500">Khá - Cần cố gắng thêm</span>
                      </div>
                      <i class="fas fa-meh text-yellow-500 text-xl"></i>
                    </div>
                  </div>
                  <div class="flex items-stretch bg-white border border-red-200 rounded-lg overflow-hidden">
                    <div class="w-2 bg-red-500"></div>
                    <div class="p-3 flex-1 flex justify-between items-center">
                      <div>
                        <span class="font-bold text-red-700 block text-sm">20–29 PPH</span>
                        <span class="text-xs text-gray-500">Cần cải thiện - Hãy hỏi quản lý</span>
                      </div>
                      <i class="fas fa-frown text-red-500 text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ranking Section */}
              <div class="mb-6">
                <h3 class="font-bold text-gray-900 mb-3 bg-gray-50 p-2 rounded-lg inline-block">
                  2. Ranking – Xếp hạng
                </h3>
                <p class="text-sm text-gray-600 mb-3">
                  Mức xếp hạng càng cao, tỷ lệ thưởng KPI của bạn càng cao.
                </p>

                <div class="overflow-hidden rounded-lg border border-gray-200 text-sm">
                  <table class="w-full text-left">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="p-3 font-semibold text-gray-600">Mức</th>
                        <th class="p-3 font-semibold text-gray-600">Ý nghĩa</th>
                        <th class="p-3 font-semibold text-gray-600 text-right">Thưởng</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      <tr>
                        <td class="p-3 font-bold text-green-600">5</td>
                        <td class="p-3 text-gray-700">Xuất sắc</td>
                        <td class="p-3 text-right font-bold text-green-600">100%</td>
                      </tr>
                      <tr>
                        <td class="p-3 font-bold text-blue-600">4</td>
                        <td class="p-3 text-gray-700">Tốt</td>
                        <td class="p-3 text-right font-bold text-blue-600">95%</td>
                      </tr>
                      <tr>
                        <td class="p-3 font-bold text-yellow-600">3</td>
                        <td class="p-3 text-gray-700">Đạt</td>
                        <td class="p-3 text-right font-bold text-yellow-600">85%</td>
                      </tr>
                      <tr>
                        <td class="p-3 font-bold text-orange-600">2</td>
                        <td class="p-3 text-gray-700">Cải thiện</td>
                        <td class="p-3 text-right font-bold text-orange-600">70%</td>
                      </tr>
                      <tr>
                        <td class="p-3 font-bold text-red-600">1</td>
                        <td class="p-3 text-gray-700">Yếu</td>
                        <td class="p-3 text-right font-bold text-red-600">50%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                <h4 class="font-bold text-yellow-800 mb-2 text-sm flex items-center">
                  <i class="fas fa-lightbulb mr-2"></i>Tips tăng PPH
                </h4>
                <ul class="text-sm space-y-2 text-yellow-900">
                  <li class="flex items-start">
                    <span class="mr-2 mt-1">•</span>
                    <span><strong>Tập trung Main Task:</strong> Làm công việc chính (đóng gói, lấy hàng...) để tích điểm cao nhất.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2 mt-1">•</span>
                    <span><strong>Giảm thời gian chết:</strong> Chuẩn bị trước dụng cụ, thùng, tem... để không phải chờ đợi.</span>
                  </li>
                </ul>
              </div>

            </div>

            <div class="p-4 border-t border-gray-100 bg-gray-50 flex justify-between gap-3">
              <Button onclick="prevStep(1)" variant="outline" className="w-1/2 md:w-auto">
                Quay lại
              </Button>
              <Button onclick="nextStep(3)" className="w-1/2 md:w-auto bg-blue-600 hover:bg-blue-700">
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>

        {/* STEP 3: ORS & PENALTY */}
        <div id="step-3" class="step-content hidden">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white text-center">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-exclamation-triangle text-2xl"></i>
              </div>
              <h2 class="text-xl font-bold mb-1">Bước 3/6 – ORS & Penalty</h2>
              <p class="text-red-100 text-sm">Điểm lỗi & Phạt vi phạm</p>
            </div>

            <div class="p-6">
              <div class="mb-6">
                <h3 class="font-bold text-gray-900 mb-2">ORS là gì?</h3>
                <p class="text-sm text-gray-600 mb-2">
                  <strong>Kỹ thuật:</strong> Operational Risk Score – hệ thống điểm rủi ro.
                </p>
                <p class="text-sm bg-red-50 text-red-800 p-3 rounded-lg border border-red-100">
                  <strong>Hiểu đơn giản:</strong> Điểm ghi nhận lỗi sai. Càng mắc nhiều lỗi, điểm ORS càng cao, thưởng càng bị trừ.
                </p>
              </div>

              <div class="mb-6">
                <h3 class="font-bold text-gray-900 mb-3">Các mức ORS và hậu quả</h3>
                <div class="space-y-3">
                  <div class="bg-white border rounded-lg p-3 flex items-center shadow-sm">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-lg mr-3 shrink-0">
                      0-9
                    </div>
                    <div>
                      <div class="font-bold text-green-700 text-sm">GREEN - An toàn</div>
                      <div class="text-xs text-gray-500">Giữ nguyên thưởng.</div>
                    </div>
                  </div>
                  <div class="bg-white border rounded-lg p-3 flex items-center shadow-sm">
                    <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold text-lg mr-3 shrink-0">
                      10+
                    </div>
                    <div>
                      <div class="font-bold text-yellow-700 text-sm">YELLOW - Cảnh báo</div>
                      <div class="text-xs text-gray-500">Chưa bị trừ, nhưng cần chú ý.</div>
                    </div>
                  </div>
                  <div class="bg-white border rounded-lg p-3 flex items-center shadow-sm">
                    <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg mr-3 shrink-0">
                      20+
                    </div>
                    <div>
                      <div class="font-bold text-orange-700 text-sm">ORANGE - Đáng lo</div>
                      <div class="text-xs text-gray-500">Ảnh hưởng xét duyệt thi đua & thưởng chiến dịch.</div>
                    </div>
                  </div>
                  <div class="bg-white border rounded-lg p-3 flex items-center shadow-sm">
                    <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-lg mr-3 shrink-0">
                      40+
                    </div>
                    <div>
                      <div class="font-bold text-red-700 text-sm">CRITICAL - Nguy hiểm</div>
                      <div class="text-xs text-red-600 font-bold">Kỷ luật & Ghi nhận vi phạm!</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-6">
                <h3 class="font-bold text-gray-900 mb-3">Ví dụ lỗi thường gặp</h3>
                <ul class="text-sm space-y-2 text-gray-600">
                  <li class="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span>Đóng gói thiếu sản phẩm</span>
                    <span class="font-bold text-red-600">+6 điểm</span>
                  </li>
                  <li class="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span>Pick sai mã hàng (SKU)</span>
                    <span class="font-bold text-red-600">+5 điểm</span>
                  </li>
                  <li class="flex justify-between items-center pb-2">
                    <span>Không tuân thủ an toàn</span>
                    <span class="font-bold text-red-600">+8 điểm</span>
                  </li>
                </ul>
              </div>

              <div class="bg-green-50 rounded-xl p-4 border border-green-100">
                <h4 class="font-bold text-green-800 mb-2 text-sm flex items-center">
                  <i class="fas fa-check-circle mr-2"></i>Lời khuyên
                </h4>
                <p class="text-sm text-green-900">
                  Nếu thấy hàng có vấn đề, báo quản lý ngay thay vì cố làm cho xong. Chất lượng quan trọng hơn số lượng!
                </p>
              </div>

            </div>
            <div class="p-4 border-t border-gray-100 bg-gray-50 flex justify-between gap-3">
              <Button onclick="prevStep(2)" variant="outline" className="w-1/2 md:w-auto">
                Quay lại
              </Button>
              <Button onclick="nextStep(4)" className="w-1/2 md:w-auto bg-blue-600 hover:bg-blue-700">
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>

        {/* STEP 4: KPI BONUS */}
        <div id="step-4" class="step-content hidden">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white text-center">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-money-bill-wave text-2xl"></i>
              </div>
              <h2 class="text-xl font-bold mb-1">Bước 4/6 – KPI Bonus</h2>
              <p class="text-emerald-100 text-sm">Cách tính và nhận thưởng</p>
            </div>

            <div class="p-6">
              <div class="mb-6">
                <h3 class="font-bold text-gray-900 mb-4">Công thức tính thưởng</h3>

                <div class="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  <div class="relative">
                    <div class="absolute -left-6 w-4 h-4 rounded-full bg-blue-500 border-2 border-white ring-1 ring-gray-200 mt-1"></div>
                    <h4 class="font-bold text-gray-900 text-sm">1. Tính thưởng gốc</h4>
                    <p class="text-xs text-gray-500 mb-1">Điểm KPI × Đơn giá</p>
                    <div class="text-sm bg-gray-50 p-2 rounded">
                      VD: 5,000 điểm × 1,000₫ = 5,000,000₫
                    </div>
                  </div>
                  <div class="relative">
                    <div class="absolute -left-6 w-4 h-4 rounded-full bg-yellow-500 border-2 border-white ring-1 ring-gray-200 mt-1"></div>
                    <h4 class="font-bold text-gray-900 text-sm">2. Nhân hệ số Ranking</h4>
                    <p class="text-xs text-gray-500 mb-1">Dựa trên xếp hạng 1-5</p>
                    <div class="text-sm bg-gray-50 p-2 rounded">
                      VD: Ranking 4 (Tốt) → 95%
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-4 mb-6">
                <div class="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-bold text-emerald-800 text-sm">Ví dụ thực tế</span>
                    <span class="bg-emerald-200 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">Nhận thưởng cao</span>
                  </div>
                  <ul class="text-xs space-y-1 text-emerald-900 mb-3">
                    <li>• KPI: 5,000 điểm</li>
                    <li>• Ranking: 4 (95%)</li>
                    <li>• ORS: Green (100% - không trừ)</li>
                  </ul>
                  <div class="font-mono text-lg font-bold text-emerald-600 border-t border-emerald-200 pt-2 text-center">
                    = 4,750,000 VNĐ
                  </div>
                  <p class="text-xs text-center text-emerald-700 mt-1">Bạn giữ ORS tốt nên không bị trừ!</p>
                </div>

                <div class="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-bold text-orange-800 text-sm">Nếu ORS Cao?</span>
                    <span class="bg-orange-200 text-orange-800 text-xs px-2 py-0.5 rounded-full font-bold">Lưu ý!</span>
                  </div>
                  <ul class="text-xs space-y-1 text-orange-900 mb-3">
                    <li>• KPI: 5,000 điểm</li>
                    <li>• ORS: Orange (20+ điểm)</li>
                  </ul>
                  <div class="font-bold text-orange-700 text-sm border-t border-orange-200 pt-2 text-center">
                    Thưởng KPI vẫn giữ nguyên!
                  </div>
                  <p class="text-xs text-center text-orange-800 mt-1">Tuy nhiên, bạn sẽ bị ghi nhận lỗi và ảnh hưởng đến các khoản thưởng khác (chuyên cần, campaigns...).</p>
                </div>
              </div>

              <div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h4 class="font-bold text-blue-900 mb-2 text-sm">Tối đa hóa Bonus:</h4>
                <ul class="text-sm text-blue-800 space-y-1">
                  <li class="flex items-start">
                    <i class="fas fa-caret-right mr-2 mt-1"></i>
                    <span><strong>Tăng Main Task:</strong> Đăng ký ca đều, xin thêm ca nếu sức khỏe cho phép.</span>
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-caret-right mr-2 mt-1"></i>
                    <span><strong>Giữ ORS Green:</strong> Làm chậm một chút nhưng chuẩn xác.</span>
                  </li>
                </ul>
              </div>

            </div>
            <div class="p-4 border-t border-gray-100 bg-gray-50 flex justify-between gap-3">
              <Button onclick="prevStep(3)" variant="outline" className="w-1/2 md:w-auto">
                Quay lại
              </Button>
              <Button onclick="nextStep(5)" className="w-1/2 md:w-auto bg-blue-600 hover:bg-blue-700">
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>

        {/* STEP 5: DASHBOARD USAGE */}
        <div id="step-5" class="step-content hidden">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white text-center">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-laptop text-2xl"></i>
              </div>
              <h2 class="text-xl font-bold mb-1">Bước 5/6 – Sử dụng Dashboard</h2>
              <p class="text-purple-100 text-sm">Cách tra cứu thông tin của bạn</p>
            </div>

            <div class="p-6 space-y-6">
              {/* Lookup Flow */}
              <div>
                <h3 class="font-bold text-gray-900 mb-3 bg-gray-50 p-2 rounded-lg inline-block">
                  1. Cách tra cứu
                </h3>
                <div class="flex flex-col gap-3">
                  <div class="flex items-center p-3 border border-gray-100 rounded-lg shadow-sm">
                    <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3 shrink-0">1</div>
                    <span class="text-sm text-gray-700">Bấm <strong>"Nhân viên"</strong> trên menu chính.</span>
                  </div>
                  <div class="flex items-center p-3 border border-gray-100 rounded-lg shadow-sm">
                    <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3 shrink-0">2</div>
                    <span class="text-sm text-gray-700">Chọn <strong>Kho</strong> và nhập <strong>Mã NV</strong> của bạn (ví dụ: EMP020).</span>
                  </div>
                  <div class="flex items-center p-3 border border-gray-100 rounded-lg shadow-sm">
                    <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3 shrink-0">3</div>
                    <span class="text-sm text-gray-700">Bấm nút <strong>Tra cứu</strong> để xem kết quả.</span>
                  </div>
                </div>
              </div>

              {/* Metrics Reading */}
              <div>
                <h3 class="font-bold text-gray-900 mb-3 bg-gray-50 p-2 rounded-lg inline-block">
                  2. Các chỉ số chính
                </h3>
                <div class="grid grid-cols-2 gap-3">
                  <div class="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div class="text-xs text-gray-500 mb-1">PPH</div>
                    <div class="font-bold text-gray-800 text-sm">Đơn mỗi giờ</div>
                    <i class="fas fa-info-circle text-gray-400 text-xs mt-1"></i>
                  </div>
                  <div class="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div class="text-xs text-gray-500 mb-1">Ranking</div>
                    <div class="font-bold text-gray-800 text-sm">Xếp hạng 1-5</div>
                  </div>
                  <div class="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div class="text-xs text-gray-500 mb-1">Main Task</div>
                    <div class="font-bold text-gray-800 text-sm">Điểm nhiệm vụ</div>
                  </div>
                  <div class="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div class="text-xs text-gray-500 mb-1">Hours</div>
                    <div class="font-bold text-gray-800 text-sm">Giờ làm việc</div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="bg-green-50 p-3 rounded-lg text-center">
                  <div class="mb-1 text-green-600"><i class="fas fa-calendar-check"></i></div>
                  <div class="font-bold text-green-900 text-xs mb-1">Kiểm tra mỗi tuần</div>
                  <p class="text-[10px] text-green-700 leading-tight">Xem lại kết quả để điều chỉnh kịp thời.</p>
                </div>
                <div class="bg-red-50 p-3 rounded-lg text-center">
                  <div class="mb-1 text-red-600"><i class="fas fa-exclamation-circle"></i></div>
                  <div class="font-bold text-red-900 text-xs mb-1">Chú ý ORS</div>
                  <p class="text-[10px] text-red-700 leading-tight">Nếu thấy màu vàng/cam, cẩn thận hơn!</p>
                </div>
              </div>
            </div>

            <div class="p-4 border-t border-gray-100 bg-gray-50 flex justify-between gap-3">
              <Button onclick="prevStep(4)" variant="outline" className="w-1/2 md:w-auto">
                Quay lại
              </Button>
              <Button onclick="nextStep(6)" className="w-1/2 md:w-auto bg-blue-600 hover:bg-blue-700">
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>

        {/* STEP 6: FAQ */}
        <div id="step-6" class="step-content hidden">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-6 text-white text-center">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-question text-2xl"></i>
              </div>
              <h2 class="text-xl font-bold mb-1">Bước 6/6 – FAQ</h2>
              <p class="text-gray-200 text-sm">Câu hỏi thường gặp</p>
            </div>

            <div class="p-6">
              <div class="space-y-4">
                <details class="group border border-gray-200 rounded-lg open:border-blue-300 transition-colors">
                  <summary class="flex justify-between items-center p-4 cursor-pointer font-medium text-gray-800 list-none group-open:text-blue-700">
                    <span>PPH của tôi thấp, làm sao cải thiện?</span>
                    <i class="fas fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform"></i>
                  </summary>
                  <div class="px-4 pb-4 text-sm text-gray-600 space-y-2 border-t border-gray-100 pt-3">
                    <p><strong>• Tập trung Main Task:</strong> Hạn chế nhận việc vặt không tên.</p>
                    <p><strong>• Giảm chờ đợi:</strong> Nhận việc mới ngay khi xong việc cũ.</p>
                    <p><strong>• Học hỏi:</strong> Quan sát các bạn rank cao làm việc.</p>
                  </div>
                </details>

                <details class="group border border-gray-200 rounded-lg open:border-blue-300 transition-colors">
                  <summary class="flex justify-between items-center p-4 cursor-pointer font-medium text-gray-800 list-none group-open:text-blue-700">
                    <span>Tôi bị ghi nhận ORS sai?</span>
                    <i class="fas fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform"></i>
                  </summary>
                  <div class="px-4 pb-4 text-sm text-gray-600 space-y-2 border-t border-gray-100 pt-3">
                    <p><strong>• Liên hệ quản lý:</strong> Báo ngay trong ca làm việc.</p>
                    <p><strong>• Cung cấp bằng chứng:</strong> Giải thích rõ tình huống.</p>
                  </div>
                </details>

                <details class="group border border-gray-200 rounded-lg open:border-blue-300 transition-colors">
                  <summary class="flex justify-between items-center p-4 cursor-pointer font-medium text-gray-800 list-none group-open:text-blue-700">
                    <span>Dữ liệu của tôi không hiển thị?</span>
                    <i class="fas fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform"></i>
                  </summary>
                  <div class="px-4 pb-4 text-sm text-gray-600 space-y-2 border-t border-gray-100 pt-3">
                    <p>• Kiểm tra lại Mã NV và Kho đã chọn.</p>
                    <p>• Nếu vẫn không được, <strong>báo ngay với quản lý hoặc HR.</strong></p>
                  </div>
                </details>
              </div>

              <div class="mt-8 text-center p-6 bg-green-50 border border-green-100 rounded-xl">
                <div class="text-4xl mb-3">🎉</div>
                <h3 class="text-xl font-bold text-green-800 mb-2">Chúc mừng! Bạn đã hoàn thành</h3>
                <p class="text-green-700 text-sm mb-4">Bạn đã sẵn sàng sử dụng hệ thống KPI Warehouse.</p>

                <div class="flex flex-col gap-3 sm:flex-row justify-center">
                  <a href="/employee" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:text-lg w-full sm:w-auto">
                    Mở Dashboard Nhân viên
                  </a>
                </div>
                <div class="mt-3">
                  <a href="/manager" class="text-sm text-green-600 hover:text-green-800 underline">
                    Xem Dashboard Quản lý (nếu có quyền)
                  </a>
                </div>
              </div>
            </div>

            <div class="p-4 border-t border-gray-100 bg-gray-50 flex justify-start">
              <Button onclick="prevStep(5)" variant="outline" className="w-1/2 md:w-auto">
                Quay lại
              </Button>
            </div>
          </div>
        </div>

      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
        let currentStep = 1;
        const totalSteps = 6;
        let unlockedSteps = [1];
        
        // Load state from local storage if needed, but simple flow is often better for guides
        // unlockedSteps = JSON.parse(localStorage.getItem('guide_unlocked') || '[1]');

        function updateUI() {
          // Hide all steps
          document.querySelectorAll('.step-content').forEach(el => el.classList.add('hidden'));
          
          // Show current step
          document.getElementById('step-' + currentStep).classList.remove('hidden');
          
          // Update Text
          document.getElementById('progress-text').textContent = currentStep + '/' + totalSteps + ' bước';
          
          // Update Bar
          const percent = ((currentStep) / totalSteps) * 100;
          document.getElementById('progress-bar').style.width = percent + '%';
          
          // Update Dots
          for(let i=1; i<=totalSteps; i++) {
            const dot = document.getElementById('dot-' + i);
            if(i === currentStep) {
               dot.className = "w-2 h-2 rounded-full transition-all duration-300 step-dot bg-blue-600 scale-150 ring-2 ring-blue-200";
            } else if (unlockedSteps.includes(i)) {
               dot.className = "w-2 h-2 rounded-full transition-all duration-300 step-dot bg-blue-400 cursor-pointer hover:bg-blue-500";
            } else {
               dot.className = "w-2 h-2 rounded-full transition-all duration-300 step-dot bg-gray-200";
            }
          }
          
          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function nextStep(step) {
          if (step > totalSteps) return;
          currentStep = step;
          if (!unlockedSteps.includes(step)) {
            unlockedSteps.push(step);
            // localStorage.setItem('guide_unlocked', JSON.stringify(unlockedSteps));
          }
          updateUI();
        }

        function prevStep(step) {
          if (step < 1) return;
          currentStep = step;
          updateUI();
        }
        
        function showStep(step) {
             currentStep = step;
             updateUI();
        }
        
        function isStepUnlocked(step) {
            return unlockedSteps.includes(step);
        }

        // Initialize
        updateUI();
        
        // Expose to window
        window.nextStep = nextStep;
        window.prevStep = prevStep;
        window.showStep = showStep;
        window.isStepUnlocked = isStepUnlocked;
      `}} />
    </Layout>
  )
}
