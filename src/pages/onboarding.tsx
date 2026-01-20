import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'

export const OnboardingPage: FC = () => {
  return (
    <Layout title="Hướng dẫn sử dụng">
      {/* Progress Bar */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Tiến độ học</span>
          <span id="progress-text" class="text-sm text-blue-600">0/6 bước</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div id="progress-bar" class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
        </div>
      </div>

      {/* Steps Navigation */}
      <div class="flex flex-wrap gap-2 mb-6">
        <button onclick="showStep(1)" class="step-btn px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white" data-step="1">
          1. Giới thiệu
        </button>
        <button onclick="showStep(2)" class="step-btn px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700" data-step="2">
          2. PPH & Ranking
        </button>
        <button onclick="showStep(3)" class="step-btn px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700" data-step="3">
          3. ORS & Penalty
        </button>
        <button onclick="showStep(4)" class="step-btn px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700" data-step="4">
          4. KPI Bonus
        </button>
        <button onclick="showStep(5)" class="step-btn px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700" data-step="5">
          5. Sử dụng Dashboard
        </button>
        <button onclick="showStep(6)" class="step-btn px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700" data-step="6">
          6. Câu hỏi thường gặp
        </button>
      </div>

      {/* Step Contents */}
      <div id="step-container">
        {/* Step 1: Introduction */}
        <div id="step-1" class="step-content">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div class="text-center mb-8">
              <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-rocket text-blue-600 text-3xl"></i>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Chào mừng đến với Performance!</h2>
              <p class="text-gray-600">Hệ thống đánh giá năng suất công bằng và minh bạch</p>
            </div>

            <div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="bg-blue-50 rounded-xl p-6">
                <h3 class="font-semibold text-blue-900 mb-3">
                  <i class="fas fa-bullseye mr-2"></i>Mục tiêu hệ thống
                </h3>
                <ul class="space-y-2 text-blue-800">
                  <li class="flex items-start">
                    <i class="fas fa-check text-blue-600 mr-2 mt-1"></i>
                    <span>Đánh giá năng suất công bằng cho mọi nhân viên</span>
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-check text-blue-600 mr-2 mt-1"></i>
                    <span>Tính thưởng KPI minh bạch, dễ hiểu</span>
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-check text-blue-600 mr-2 mt-1"></i>
                    <span>Giúp bạn theo dõi và cải thiện hiệu suất</span>
                  </li>
                </ul>
              </div>

              <div class="bg-green-50 rounded-xl p-6">
                <h3 class="font-semibold text-green-900 mb-3">
                  <i class="fas fa-chart-line mr-2"></i>Lợi ích cho bạn
                </h3>
                <ul class="space-y-2 text-green-800">
                  <li class="flex items-start">
                    <i class="fas fa-star text-green-600 mr-2 mt-1"></i>
                    <span>Biết chính xác năng suất của mình</span>
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-star text-green-600 mr-2 mt-1"></i>
                    <span>Dự đoán được tiền thưởng KPI</span>
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-star text-green-600 mr-2 mt-1"></i>
                    <span>Có mục tiêu rõ ràng để phấn đấu</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 class="font-semibold text-yellow-900 mb-3">
                <i class="fas fa-lightbulb mr-2"></i>3 điều cần nhớ
              </h3>
              <div class="grid md:grid-cols-3 gap-4">
                <div class="text-center">
                  <div class="text-3xl mb-2">📊</div>
                  <p class="font-medium text-yellow-900">PPH</p>
                  <p class="text-sm text-yellow-700">Điểm/Giờ - Năng suất của bạn</p>
                </div>
                <div class="text-center">
                  <div class="text-3xl mb-2">⭐</div>
                  <p class="font-medium text-yellow-900">Ranking</p>
                  <p class="text-sm text-yellow-700">1-5 sao - Xếp hạng năng suất</p>
                </div>
                <div class="text-center">
                  <div class="text-3xl mb-2">🛡️</div>
                  <p class="font-medium text-yellow-900">ORS</p>
                  <p class="text-sm text-yellow-700">Điểm rủi ro - Tránh vi phạm</p>
                </div>
              </div>
            </div>

            <div class="mt-8 text-center">
              <button onclick="showStep(2); markComplete(1)" class="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Tiếp tục <i class="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: PPH & Ranking */}
        <div id="step-2" class="step-content hidden">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              <i class="fas fa-tachometer-alt text-blue-600 mr-2"></i>
              PPH & Ranking - Chỉ số năng suất
            </h2>

            <div class="grid md:grid-cols-2 gap-8 mb-8">
              {/* PPH Explanation */}
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  📊 PPH là gì?
                </h3>
                <div class="bg-blue-50 rounded-xl p-6 mb-4">
                  <p class="text-blue-900 mb-3">
                    <strong>PPH = Points Per Hour</strong><br />
                    Số điểm sản lượng trung bình mỗi giờ làm việc
                  </p>
                  <div class="bg-white rounded-lg p-3 border border-blue-200">
                    <code class="text-blue-800">PPH = Main Task Points ÷ Giờ làm việc</code>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center p-3 bg-green-50 rounded-lg">
                    <span class="w-16 text-center font-bold text-green-600">≥ 50</span>
                    <span class="text-green-800">Xuất sắc - Top performer</span>
                  </div>
                  <div class="flex items-center p-3 bg-blue-50 rounded-lg">
                    <span class="w-16 text-center font-bold text-blue-600">40-49</span>
                    <span class="text-blue-800">Tốt - Vượt kỳ vọng</span>
                  </div>
                  <div class="flex items-center p-3 bg-yellow-50 rounded-lg">
                    <span class="w-16 text-center font-bold text-yellow-600">30-39</span>
                    <span class="text-yellow-800">Đạt - Đúng kỳ vọng</span>
                  </div>
                  <div class="flex items-center p-3 bg-orange-50 rounded-lg">
                    <span class="w-16 text-center font-bold text-orange-600">20-29</span>
                    <span class="text-orange-800">Cần cải thiện</span>
                  </div>
                  <div class="flex items-center p-3 bg-red-50 rounded-lg">
                    <span class="w-16 text-center font-bold text-red-600">&lt; 20</span>
                    <span class="text-red-800">Chưa đạt yêu cầu</span>
                  </div>
                </div>
              </div>

              {/* Ranking Explanation */}
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  ⭐ Ranking Score là gì?
                </h3>
                <div class="bg-purple-50 rounded-xl p-6 mb-4">
                  <p class="text-purple-900 mb-3">
                    <strong>Ranking = Xếp hạng năng suất</strong><br />
                    Được tính từ PPH, quyết định hệ số thưởng
                  </p>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center">
                      <div class="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold mr-3">5</div>
                      <span class="font-medium">Xuất sắc</span>
                    </div>
                    <span class="text-green-600 font-bold">100% bonus</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center">
                      <div class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-3">4</div>
                      <span class="font-medium">Tốt</span>
                    </div>
                    <span class="text-blue-600 font-bold">95% bonus</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center">
                      <div class="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold mr-3">3</div>
                      <span class="font-medium">Đạt</span>
                    </div>
                    <span class="text-yellow-600 font-bold">85% bonus</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center">
                      <div class="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold mr-3">2</div>
                      <span class="font-medium">Cải thiện</span>
                    </div>
                    <span class="text-orange-600 font-bold">70% bonus</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center">
                      <div class="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold mr-3">1</div>
                      <span class="font-medium">Chưa đạt</span>
                    </div>
                    <span class="text-red-600 font-bold">50% bonus</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
              <h3 class="font-semibold text-gray-900 mb-3">
                💡 Làm sao để tăng PPH?
              </h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div class="flex items-start">
                  <i class="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                  <span>Tập trung vào Main Task của vai trò</span>
                </div>
                <div class="flex items-start">
                  <i class="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                  <span>Giảm thời gian chờ giữa các task</span>
                </div>
                <div class="flex items-start">
                  <i class="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                  <span>Học hỏi kỹ năng từ người ranking cao</span>
                </div>
                <div class="flex items-start">
                  <i class="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                  <span>Đảm bảo chất lượng để tránh làm lại</span>
                </div>
              </div>
            </div>

            <div class="flex justify-between">
              <button onclick="showStep(1)" class="text-gray-600 hover:text-gray-900">
                <i class="fas fa-arrow-left mr-2"></i>Quay lại
              </button>
              <button onclick="showStep(3); markComplete(2)" class="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Tiếp tục <i class="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Step 3: ORS */}
        <div id="step-3" class="step-content hidden">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              <i class="fas fa-shield-alt text-red-600 mr-2"></i>
              ORS - Điểm rủi ro vận hành
            </h2>

            <div class="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <h3 class="font-semibold text-red-900 mb-3">
                ⚠️ ORS là gì?
              </h3>
              <p class="text-red-800">
                <strong>ORS = Operational Risk Score</strong><br />
                Điểm ghi nhận các vi phạm, sai sót trong công việc. ORS càng cao = Bonus bị trừ càng nhiều.
              </p>
            </div>

            <div class="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">🚦 Các mức ORS</h3>
                <div class="space-y-3">
                  <div class="p-4 rounded-lg bg-green-100 border border-green-300">
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-green-800">GREEN</span>
                      <span class="text-green-700">0-9 điểm</span>
                    </div>
                    <p class="text-green-700 text-sm mt-1">✅ An toàn - Không bị trừ bonus</p>
                  </div>
                  <div class="p-4 rounded-lg bg-yellow-100 border border-yellow-300">
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-yellow-800">YELLOW</span>
                      <span class="text-yellow-700">10-19 điểm</span>
                    </div>
                    <p class="text-yellow-700 text-sm mt-1">⚠️ Cảnh báo - Chưa bị trừ</p>
                  </div>
                  <div class="p-4 rounded-lg bg-orange-100 border border-orange-300">
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-orange-800">ORANGE</span>
                      <span class="text-orange-700">20-29 điểm</span>
                    </div>
                    <p class="text-orange-700 text-sm mt-1">⛔ Trừ 10% bonus</p>
                  </div>
                  <div class="p-4 rounded-lg bg-red-100 border border-red-300">
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-red-800">RED</span>
                      <span class="text-red-700">30-39 điểm</span>
                    </div>
                    <p class="text-red-700 text-sm mt-1">🚨 Trừ 30% bonus</p>
                  </div>
                  <div class="p-4 rounded-lg bg-red-900 text-white">
                    <div class="flex justify-between items-center">
                      <span class="font-bold">CRITICAL</span>
                      <span>≥40 điểm</span>
                    </div>
                    <p class="text-red-200 text-sm mt-1">💀 Mất toàn bộ bonus!</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">📋 Ví dụ vi phạm ORS</h3>
                <div class="space-y-3">
                  <div class="p-3 bg-gray-50 rounded-lg">
                    <div class="flex justify-between">
                      <span>Đóng gói thiếu sản phẩm</span>
                      <span class="text-red-600 font-bold">+6 điểm</span>
                    </div>
                  </div>
                  <div class="p-3 bg-gray-50 rounded-lg">
                    <div class="flex justify-between">
                      <span>Pick sai mã SKU</span>
                      <span class="text-red-600 font-bold">+5 điểm</span>
                    </div>
                  </div>
                  <div class="p-3 bg-gray-50 rounded-lg">
                    <div class="flex justify-between">
                      <span>Không đeo thẻ tên</span>
                      <span class="text-red-600 font-bold">+2 điểm</span>
                    </div>
                  </div>
                  <div class="p-3 bg-gray-50 rounded-lg">
                    <div class="flex justify-between">
                      <span>Làm hư hàng hóa</span>
                      <span class="text-red-600 font-bold">+8 điểm</span>
                    </div>
                  </div>
                </div>

                <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 class="font-semibold text-blue-900 mb-2">💡 Cách giảm ORS:</h4>
                  <ul class="text-blue-800 space-y-1 text-sm">
                    <li>• Kiểm tra kỹ trước khi hoàn thành</li>
                    <li>• Báo cáo ngay khi phát hiện sai sót</li>
                    <li>• Tuân thủ quy trình làm việc</li>
                    <li>• Học từ lỗi để không lặp lại</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p class="text-yellow-800">
                <i class="fas fa-info-circle mr-2"></i>
                <strong>Lưu ý:</strong> ORS được tính theo tháng. Đầu tháng mới, ORS reset về 0.
              </p>
            </div>

            <div class="flex justify-between">
              <button onclick="showStep(2)" class="text-gray-600 hover:text-gray-900">
                <i class="fas fa-arrow-left mr-2"></i>Quay lại
              </button>
              <button onclick="showStep(4); markComplete(3)" class="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Tiếp tục <i class="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Step 4: KPI Bonus */}
        <div id="step-4" class="step-content hidden">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              <i class="fas fa-money-bill-wave text-green-600 mr-2"></i>
              KPI Bonus - Tiền thưởng
            </h2>

            <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
              <h3 class="font-semibold text-gray-900 mb-3">💰 Công thức tính bonus</h3>
              <div class="bg-white rounded-lg p-4 border">
                <code class="text-lg text-gray-800 block text-center">
                  KPI Bonus = Major KPI × Đơn giá × Rating Factor × (1 - ORS Penalty)
                </code>
              </div>
            </div>

            <div class="grid md:grid-cols-4 gap-4 mb-8">
              <div class="text-center p-4 bg-blue-50 rounded-xl">
                <div class="text-3xl mb-2">📊</div>
                <h4 class="font-semibold text-blue-900">Major KPI</h4>
                <p class="text-sm text-blue-700">Tổng điểm Main Task trong tháng</p>
              </div>
              <div class="text-center p-4 bg-purple-50 rounded-xl">
                <div class="text-3xl mb-2">💵</div>
                <h4 class="font-semibold text-purple-900">Đơn giá</h4>
                <p class="text-sm text-purple-700">VD: 1,000 VND/điểm</p>
              </div>
              <div class="text-center p-4 bg-yellow-50 rounded-xl">
                <div class="text-3xl mb-2">⭐</div>
                <h4 class="font-semibold text-yellow-900">Rating Factor</h4>
                <p class="text-sm text-yellow-700">50% - 100% theo Ranking</p>
              </div>
              <div class="text-center p-4 bg-red-50 rounded-xl">
                <div class="text-3xl mb-2">🛡️</div>
                <h4 class="font-semibold text-red-900">ORS Penalty</h4>
                <p class="text-sm text-red-700">0% - 100% theo mức ORS</p>
              </div>
            </div>

            <div class="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 class="font-semibold text-gray-900 mb-4">📝 Ví dụ tính bonus</h3>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-white rounded-lg p-4 border border-green-200">
                  <h4 class="font-medium text-green-700 mb-3">✅ Trường hợp tốt</h4>
                  <ul class="space-y-2 text-sm">
                    <li>• Major KPI: <strong>5,000 điểm</strong></li>
                    <li>• Đơn giá: <strong>1,000 VND</strong></li>
                    <li>• Ranking 4 → Rating Factor: <strong>0.95</strong></li>
                    <li>• ORS GREEN → Penalty: <strong>0%</strong></li>
                  </ul>
                  <div class="mt-3 pt-3 border-t border-green-200">
                    <p class="text-green-800">= 5,000 × 1,000 × 0.95 × 1.00</p>
                    <p class="text-xl font-bold text-green-600">= 4,750,000 VND</p>
                  </div>
                </div>

                <div class="bg-white rounded-lg p-4 border border-red-200">
                  <h4 class="font-medium text-red-700 mb-3">❌ Trường hợp có ORS</h4>
                  <ul class="space-y-2 text-sm">
                    <li>• Major KPI: <strong>5,000 điểm</strong></li>
                    <li>• Đơn giá: <strong>1,000 VND</strong></li>
                    <li>• Ranking 3 → Rating Factor: <strong>0.85</strong></li>
                    <li>• ORS ORANGE → Penalty: <strong>10%</strong></li>
                  </ul>
                  <div class="mt-3 pt-3 border-t border-red-200">
                    <p class="text-red-800">= 5,000 × 1,000 × 0.85 × 0.90</p>
                    <p class="text-xl font-bold text-red-600">= 3,825,000 VND</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h4 class="font-semibold text-blue-900 mb-2">🎯 Cách tối đa hóa bonus:</h4>
              <div class="grid md:grid-cols-3 gap-3 text-sm text-blue-800">
                <div class="flex items-center">
                  <i class="fas fa-arrow-up text-green-500 mr-2"></i>
                  Tăng điểm Main Task
                </div>
                <div class="flex items-center">
                  <i class="fas fa-star text-yellow-500 mr-2"></i>
                  Duy trì Ranking cao
                </div>
                <div class="flex items-center">
                  <i class="fas fa-shield-alt text-blue-500 mr-2"></i>
                  Giữ ORS ở mức GREEN
                </div>
              </div>
            </div>

            <div class="flex justify-between">
              <button onclick="showStep(3)" class="text-gray-600 hover:text-gray-900">
                <i class="fas fa-arrow-left mr-2"></i>Quay lại
              </button>
              <button onclick="showStep(5); markComplete(4)" class="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Tiếp tục <i class="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Step 5: Using Dashboard */}
        <div id="step-5" class="step-content hidden">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              <i class="fas fa-desktop text-purple-600 mr-2"></i>
              Cách sử dụng Dashboard
            </h2>

            <div class="space-y-6">
              <div class="border border-gray-200 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm mr-2">1</span>
                  Truy cập Dashboard Nhân viên
                </h3>
                <div class="bg-blue-50 rounded-lg p-4 mb-4">
                  <p class="text-blue-800">
                    Click vào <strong>"Nhân viên"</strong> trên menu hoặc truy cập <code>/employee</code>
                  </p>
                </div>
                <div class="grid md:grid-cols-3 gap-4">
                  <div class="p-3 bg-gray-50 rounded-lg text-center">
                    <i class="fas fa-building text-blue-600 text-2xl mb-2"></i>
                    <p class="text-sm">Chọn <strong>Warehouse</strong></p>
                  </div>
                  <div class="p-3 bg-gray-50 rounded-lg text-center">
                    <i class="fas fa-id-card text-green-600 text-2xl mb-2"></i>
                    <p class="text-sm">Nhập <strong>Mã NV</strong></p>
                  </div>
                  <div class="p-3 bg-gray-50 rounded-lg text-center">
                    <i class="fas fa-search text-purple-600 text-2xl mb-2"></i>
                    <p class="text-sm">Click <strong>Tra cứu</strong></p>
                  </div>
                </div>
              </div>

              <div class="border border-gray-200 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm mr-2">2</span>
                  Đọc hiểu các chỉ số
                </h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-4 bg-gray-50 rounded-lg">
                    <h4 class="font-medium mb-2">📊 Stats Row</h4>
                    <ul class="text-sm text-gray-600 space-y-1">
                      <li>• PPH - Click icon <i class="fas fa-info-circle"></i> để xem giải thích</li>
                      <li>• Ranking Score - Thứ hạng 1-5</li>
                      <li>• Main Task Points - Điểm công việc chính</li>
                      <li>• Giờ làm việc - Tổng giờ trong tuần</li>
                    </ul>
                  </div>
                  <div class="p-4 bg-gray-50 rounded-lg">
                    <h4 class="font-medium mb-2">📈 Charts & Details</h4>
                    <ul class="text-sm text-gray-600 space-y-1">
                      <li>• Task Breakdown - Chi tiết điểm theo task</li>
                      <li>• ORS Summary - Tổng hợp vi phạm tháng</li>
                      <li>• Monthly Summary - Dự tính bonus</li>
                      <li>• History Chart - Xu hướng 12 tuần</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="border border-gray-200 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm mr-2">3</span>
                  Các tips sử dụng
                </h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="flex items-start p-3 bg-green-50 rounded-lg">
                    <i class="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                    <div>
                      <p class="font-medium text-green-900">Kiểm tra định kỳ</p>
                      <p class="text-sm text-green-700">Xem KPI mỗi tuần để theo dõi tiến độ</p>
                    </div>
                  </div>
                  <div class="flex items-start p-3 bg-blue-50 rounded-lg">
                    <i class="fas fa-bell text-blue-600 mr-3 mt-1"></i>
                    <div>
                      <p class="font-medium text-blue-900">Chú ý ORS</p>
                      <p class="text-sm text-blue-700">Nếu ORS vàng/cam, cẩn thận hơn</p>
                    </div>
                  </div>
                  <div class="flex items-start p-3 bg-purple-50 rounded-lg">
                    <i class="fas fa-chart-line text-purple-600 mr-3 mt-1"></i>
                    <div>
                      <p class="font-medium text-purple-900">Xem xu hướng</p>
                      <p class="text-sm text-purple-700">Biểu đồ 12 tuần cho thấy tiến bộ</p>
                    </div>
                  </div>
                  <div class="flex items-start p-3 bg-yellow-50 rounded-lg">
                    <i class="fas fa-question-circle text-yellow-600 mr-3 mt-1"></i>
                    <div>
                      <p class="font-medium text-yellow-900">Click info icons</p>
                      <p class="text-sm text-yellow-700">Xem giải thích chi tiết mỗi chỉ số</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 flex justify-between">
              <button onclick="showStep(4)" class="text-gray-600 hover:text-gray-900">
                <i class="fas fa-arrow-left mr-2"></i>Quay lại
              </button>
              <button onclick="showStep(6); markComplete(5)" class="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Tiếp tục <i class="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Step 6: FAQ */}
        <div id="step-6" class="step-content hidden">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              <i class="fas fa-question-circle text-blue-600 mr-2"></i>
              Câu hỏi thường gặp (FAQ)
            </h2>

            <div class="space-y-4">
              <details class="border border-gray-200 rounded-lg">
                <summary class="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  PPH của tôi thấp, làm sao cải thiện?
                </summary>
                <div class="px-6 py-4 bg-gray-50 border-t">
                  <ul class="space-y-2 text-gray-700">
                    <li>• Tập trung 100% vào Main Task, hạn chế làm task phụ</li>
                    <li>• Giảm thời gian nghỉ giữa các task</li>
                    <li>• Học kỹ năng từ đồng nghiệp ranking cao</li>
                    <li>• Hỏi quản lý về cách tối ưu quy trình</li>
                    <li>• Đảm bảo check-in/out đúng giờ</li>
                  </ul>
                </div>
              </details>

              <details class="border border-gray-200 rounded-lg">
                <summary class="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  Tôi bị ghi nhận ORS sai, phải làm gì?
                </summary>
                <div class="px-6 py-4 bg-gray-50 border-t">
                  <ul class="space-y-2 text-gray-700">
                    <li>• Liên hệ ngay với quản lý trực tiếp</li>
                    <li>• Cung cấp bằng chứng (ảnh, video, log)</li>
                    <li>• Yêu cầu review lại ORS event</li>
                    <li>• ORS có thể được dismiss nếu có lý do hợp lệ</li>
                  </ul>
                </div>
              </details>

              <details class="border border-gray-200 rounded-lg">
                <summary class="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  Ranking được cập nhật khi nào?
                </summary>
                <div class="px-6 py-4 bg-gray-50 border-t">
                  <ul class="space-y-2 text-gray-700">
                    <li>• Ranking được tính mỗi tuần (thường vào Chủ nhật/Thứ 2)</li>
                    <li>• Dữ liệu từ warehouse_productivity_daily được tổng hợp</li>
                    <li>• Cần tối thiểu 20 giờ làm việc/tuần để có ranking</li>
                    <li>• Ranking tháng = Trung bình ranking các tuần</li>
                  </ul>
                </div>
              </details>

              <details class="border border-gray-200 rounded-lg">
                <summary class="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  Bonus được trả khi nào?
                </summary>
                <div class="px-6 py-4 bg-gray-50 border-t">
                  <ul class="space-y-2 text-gray-700">
                    <li>• Bonus được tính vào cuối mỗi tháng</li>
                    <li>• Team Payroll review và apply dữ liệu</li>
                    <li>• Bonus được trả cùng kỳ lương tháng sau</li>
                    <li>• Có thể xem dự tính trong Monthly Summary</li>
                  </ul>
                </div>
              </details>

              <details class="border border-gray-200 rounded-lg">
                <summary class="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  Tôi làm nhiều kho, KPI tính thế nào?
                </summary>
                <div class="px-6 py-4 bg-gray-50 border-t">
                  <ul class="space-y-2 text-gray-700">
                    <li>• KPI được tính riêng cho từng kho</li>
                    <li>• Chọn kho trong dropdown để xem KPI kho đó</li>
                    <li>• Bonus được tính tổng từ tất cả các kho</li>
                    <li>• Ranking so sánh với nhân viên cùng kho</li>
                  </ul>
                </div>
              </details>

              <details class="border border-gray-200 rounded-lg">
                <summary class="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  Dữ liệu của tôi không hiển thị?
                </summary>
                <div class="px-6 py-4 bg-gray-50 border-t">
                  <ul class="space-y-2 text-gray-700">
                    <li>• Kiểm tra Mã NV có đúng không</li>
                    <li>• Chọn đúng Warehouse</li>
                    <li>• Thử chọn tuần khác (có thể tuần hiện tại chưa có dữ liệu)</li>
                    <li>• Liên hệ quản lý nếu vẫn không có dữ liệu</li>
                  </ul>
                </div>
              </details>
            </div>

            <div class="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div class="text-4xl mb-3">🎉</div>
              <h3 class="text-xl font-bold text-green-900 mb-2">Chúc mừng! Bạn đã hoàn thành hướng dẫn</h3>
              <p class="text-green-700 mb-4">Bây giờ bạn đã hiểu cách sử dụng hệ thống KPI</p>
              <button onclick="markComplete(6); window.location.href='/employee'" class="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                <i class="fas fa-rocket mr-2"></i>
                Bắt đầu sử dụng
              </button>
            </div>

            <div class="mt-6 flex justify-between">
              <button onclick="showStep(5)" class="text-gray-600 hover:text-gray-900">
                <i class="fas fa-arrow-left mr-2"></i>Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
        let completedSteps = JSON.parse(localStorage.getItem('onboarding_completed') || '[]');
        
        function showStep(step) {
          // Hide all steps
          document.querySelectorAll('.step-content').forEach(el => el.classList.add('hidden'));
          document.querySelectorAll('.step-btn').forEach(btn => {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
          });
          
          // Show selected step
          document.getElementById('step-' + step).classList.remove('hidden');
          document.querySelector('.step-btn[data-step="' + step + '"]').classList.remove('bg-gray-200', 'text-gray-700');
          document.querySelector('.step-btn[data-step="' + step + '"]').classList.add('bg-blue-600', 'text-white');
        }
        
        function markComplete(step) {
          if (!completedSteps.includes(step)) {
            completedSteps.push(step);
            localStorage.setItem('onboarding_completed', JSON.stringify(completedSteps));
            updateProgress();
          }
        }
        
        function updateProgress() {
          const total = 6;
          const completed = completedSteps.length;
          const percent = Math.round((completed / total) * 100);
          
          document.getElementById('progress-bar').style.width = percent + '%';
          document.getElementById('progress-text').textContent = completed + '/' + total + ' bước';
          
          // Mark completed steps in buttons
          completedSteps.forEach(step => {
            const btn = document.querySelector('.step-btn[data-step="' + step + '"]');
            if (btn && !btn.classList.contains('bg-blue-600')) {
              btn.classList.add('bg-green-100', 'text-green-800');
              btn.classList.remove('bg-gray-200', 'text-gray-700');
            }
          });
        }
        
        // Initialize
        updateProgress();
      `}} />
    </Layout>
  )
}
