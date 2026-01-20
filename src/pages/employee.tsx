import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { tooltipScript } from '../components/Tooltip'
import { WAREHOUSES } from '../types/database'

interface EmployeePageProps {
  staffId?: string
  warehouseCode?: string
}

export const EmployeePage: FC<EmployeePageProps> = ({ staffId, warehouseCode }) => {
  const warehouses = Object.entries(WAREHOUSES)

  return (
    <Layout title="Nhân viên" activeTab="employee">
      {/* Help Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mb-4">
        <CardContent className="p-3 md:p-4">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div class="flex items-start gap-3">
              <i class="fas fa-lightbulb text-yellow-500 text-lg mt-0.5"></i>
              <div>
                <p class="font-medium text-gray-900 text-sm">Lần đầu sử dụng?</p>
                <p class="text-xs text-gray-600">Xem hướng dẫn để hiểu các chỉ số KPI. Bấm vào icon <i class="fas fa-info-circle text-blue-500"></i> để xem giải thích.</p>
              </div>
            </div>
            <Button href="/onboarding" className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-sm min-h-[44px]">
              <i class="fas fa-book-open mr-2"></i>Xem hướng dẫn
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staff Search Form */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <i class="fas fa-search text-blue-600"></i>
            Tra cứu KPI Cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form id="employee-search-form" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kho làm việc *</label>
              <select
                id="warehouseCode"
                name="warehouseCode"
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn kho...</option>
                {warehouses.map(([code, info]) => (
                  <option value={code} selected={code === warehouseCode}>{code} – {info.name}</option>
                ))}
              </select>
              <p id="error-warehouse" class="text-xs text-red-500 mt-1 hidden">Vui lòng chọn kho.</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mã nhân viên *</label>
              <input
                type="text"
                id="staffId"
                name="staffId"
                value={staffId || ''}
                placeholder="Ví dụ: EMP020"
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p class="text-xs text-gray-400 mt-1">Mã giống bảng lương/chấm công</p>
              <p id="error-staffId" class="text-xs text-red-500 mt-1 hidden">Vui lòng nhập mã nhân viên.</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tuần KPI *</label>
              <input
                type="week"
                id="yearWeek"
                name="yearWeek"
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p class="text-xs text-gray-400 mt-1">Chọn tuần bạn muốn xem</p>
              <p id="error-yearWeek" class="text-xs text-red-500 mt-1 hidden">Vui lòng chọn tuần.</p>
            </div>
            <div class="flex items-end">
              <Button type="submit" id="btn-search" className="w-full bg-blue-600 hover:bg-blue-700 min-h-[44px]">
                <i class="fas fa-search mr-2"></i>
                Tra cứu KPI
              </Button>
            </div>
          </form>
          <p id="error-general" class="text-sm text-red-500 mt-3 p-3 bg-red-50 rounded-lg hidden"></p>
        </CardContent>
      </Card>

      {/* KPI Dashboard (will be populated by JS) */}
      <div id="kpi-dashboard" class="hidden">
        {/* Stats Row */}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-4">
          <Card id="stat-pph">
            <CardContent className="p-4 md:p-6">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <p class="text-xs md:text-sm font-medium text-gray-500 flex items-center gap-1">
                    PPH – Đơn mỗi giờ
                    <span class="inline-flex items-center justify-center w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help" data-tooltip-key="pph">
                      <i class="fas fa-info-circle text-xs"></i>
                    </span>
                  </p>
                  <p class="text-2xl md:text-3xl font-bold text-gray-900 mt-1" id="pph-value">--</p>
                  <p class="text-xs mt-1" id="pph-trend"></p>
                </div>
                <div class="bg-blue-500 p-3 md:p-4 rounded-xl shadow-lg shadow-blue-200 flex-shrink-0">
                  <i class="fas fa-tachometer-alt text-white text-lg md:text-2xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <p class="text-xs md:text-sm font-medium text-gray-500 flex items-center gap-1">
                    Mức xếp hạng
                    <span class="inline-flex items-center justify-center w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help" data-tooltip-key="ranking">
                      <i class="fas fa-info-circle text-xs"></i>
                    </span>
                  </p>
                  <div class="mt-1" id="ranking-badge">--</div>
                </div>
                <div class="bg-yellow-500 p-3 md:p-4 rounded-xl shadow-lg shadow-yellow-200 flex-shrink-0">
                  <i class="fas fa-star text-white text-lg md:text-2xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <p class="text-xs md:text-sm font-medium text-gray-500 flex items-center gap-1">
                    Điểm nhiệm vụ chính
                    <span class="inline-flex items-center justify-center w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help" data-tooltip-key="mainTask">
                      <i class="fas fa-info-circle text-xs"></i>
                    </span>
                  </p>
                  <p class="text-2xl md:text-3xl font-bold text-gray-900 mt-1" id="main-task-points">--</p>
                  <p class="text-xs text-gray-500 mt-1" id="main-task-name">--</p>
                </div>
                <div class="bg-green-500 p-3 md:p-4 rounded-xl shadow-lg shadow-green-200 flex-shrink-0">
                  <i class="fas fa-tasks text-white text-lg md:text-2xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <p class="text-xs md:text-sm font-medium text-gray-500 flex items-center gap-1">
                    Giờ làm trong tuần
                    <span class="inline-flex items-center justify-center w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help" data-tooltip-key="workHours">
                      <i class="fas fa-info-circle text-xs"></i>
                    </span>
                  </p>
                  <p class="text-2xl md:text-3xl font-bold text-gray-900 mt-1" id="work-hours">--</p>
                  <p class="text-xs text-gray-500 mt-1" id="working-days">-- ngày</p>
                </div>
                <div class="bg-purple-500 p-3 md:p-4 rounded-xl shadow-lg shadow-purple-200 flex-shrink-0">
                  <i class="fas fa-clock text-white text-lg md:text-2xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Breakdown & ORS */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
          {/* Task Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <i class="fas fa-chart-pie text-blue-600"></i>
                Chi tiết điểm theo nhiệm vụ
                <span class="inline-flex items-center justify-center w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help" data-tooltip-key="taskBreakdown">
                  <i class="fas fa-info-circle text-xs"></i>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div id="task-breakdown" class="space-y-2">
                <p class="text-gray-500 text-center py-4 text-sm">Chưa có dữ liệu</p>
              </div>
            </CardContent>
          </Card>

          {/* ORS Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <i class="fas fa-shield-alt text-red-600"></i>
                Điểm lỗi ORS (Tháng)
                <span class="inline-flex items-center justify-center w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help" data-tooltip-key="ors">
                  <i class="fas fa-info-circle text-xs"></i>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div id="ors-summary" class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p class="text-xs text-gray-500">Tổng điểm lỗi ORS</p>
                    <p class="text-xl md:text-2xl font-bold text-gray-900" id="ors-total">0</p>
                  </div>
                  <div id="ors-milestone">
                    <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">Xanh – Tốt</span>
                  </div>
                </div>
                <div id="ors-legend" class="text-xs text-gray-500 grid grid-cols-2 gap-1">
                  <span><span class="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>0–5: Tốt</span>
                  <span><span class="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>6–15: Cần chú ý</span>
                  <span><span class="inline-block w-2 h-2 bg-orange-500 rounded-full mr-1"></span>16–25: Cảnh báo</span>
                  <span><span class="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>&gt;25: Nguy hiểm</span>
                </div>
                <div id="ors-events" class="space-y-2">
                  <p class="text-gray-500 text-center py-2 text-xs">Tháng này bạn chưa có lỗi ORS nào. Tiếp tục giữ phong độ!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Summary */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <i class="fas fa-calendar-alt text-green-600"></i>
              Tổng hợp KPI Tháng
              <span class="inline-flex items-center justify-center w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help" data-tooltip-key="monthlyKpi">
                <i class="fas fa-info-circle text-xs"></i>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div id="monthly-summary" class="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
              <div class="text-center p-3 md:p-4 bg-blue-50 rounded-lg">
                <p class="text-xs text-gray-500 flex items-center justify-center gap-1">
                  Tổng điểm KPI
                  <i class="fas fa-info-circle text-gray-400 hidden md:inline" data-tooltip-key="mainTask"></i>
                </p>
                <p class="text-lg md:text-2xl font-bold text-blue-600" id="monthly-major-kpi">--</p>
              </div>
              <div class="text-center p-3 md:p-4 bg-yellow-50 rounded-lg">
                <p class="text-xs text-gray-500 flex items-center justify-center gap-1">
                  Xếp hạng TB
                  <i class="fas fa-info-circle text-gray-400 hidden md:inline" data-tooltip-key="ranking"></i>
                </p>
                <p class="text-lg md:text-2xl font-bold text-yellow-600" id="monthly-avg-ranking">--</p>
              </div>
              <div class="text-center p-3 md:p-4 bg-purple-50 rounded-lg">
                <p class="text-xs text-gray-500 flex items-center justify-center gap-1">
                  Hệ số đánh giá
                  <i class="fas fa-info-circle text-gray-400 hidden md:inline" data-tooltip-key="ratingFactor"></i>
                </p>
                <p class="text-lg md:text-2xl font-bold text-purple-600" id="monthly-rating-factor">--</p>
              </div>
              <div class="text-center p-3 md:p-4 bg-red-50 rounded-lg">
                <p class="text-xs text-gray-500 flex items-center justify-center gap-1">
                  Tỷ lệ trừ ORS
                  <i class="fas fa-info-circle text-gray-400 hidden md:inline" data-tooltip-key="ors"></i>
                </p>
                <p class="text-lg md:text-2xl font-bold text-red-600" id="monthly-ors-penalty">--</p>
              </div>
              <div class="text-center p-3 md:p-4 bg-green-50 rounded-lg col-span-2 md:col-span-1">
                <p class="text-xs text-gray-500 flex items-center justify-center gap-1">
                  Tiền thưởng KPI
                  <i class="fas fa-info-circle text-gray-400 hidden md:inline" data-tooltip-key="kpiBonus"></i>
                </p>
                <p class="text-lg md:text-2xl font-bold text-green-600" id="monthly-kpi-bonus">--</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ranking History Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <i class="fas fa-chart-line text-purple-600"></i>
              Lịch sử xếp hạng (12 tuần)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="h-56 md:h-64">
              <canvas id="ranking-history-chart"></canvas>
            </div>
            <p id="ranking-summary" class="text-xs text-gray-500 text-center mt-2 hidden"></p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      <Card id="empty-state" className="p-8 md:p-12 text-center">
        <CardContent>
          <div class="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <i class="fas fa-chart-bar text-gray-400 text-2xl md:text-4xl"></i>
          </div>
          <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-2">Chưa có dữ liệu KPI</h3>
          <p class="text-sm text-gray-500">Nhập mã nhân viên, chọn kho và tuần để xem KPI của bạn.</p>
        </CardContent>
      </Card>

      {/* JavaScript for fetching and displaying data */}
      <script dangerouslySetInnerHTML={{
        __html: `
        // Use dynamic API_BASE from Layout (demo or api)
        let rankingChart = null;

        document.getElementById('employee-search-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          
          // Clear previous errors
          ['error-warehouse', 'error-staffId', 'error-yearWeek', 'error-general'].forEach(id => {
            document.getElementById(id)?.classList.add('hidden');
          });
          
          const staffId = document.getElementById('staffId').value.trim();
          const warehouseCode = document.getElementById('warehouseCode').value;
          const yearWeek = document.getElementById('yearWeek').value;
          
          // Inline validation
          let hasError = false;
          if (!warehouseCode) {
            document.getElementById('error-warehouse').classList.remove('hidden');
            hasError = true;
          }
          if (!staffId) {
            document.getElementById('error-staffId').classList.remove('hidden');
            hasError = true;
          }
          if (!yearWeek) {
            document.getElementById('error-yearWeek').classList.remove('hidden');
            hasError = true;
          }
          
          if (hasError) return;

          await loadEmployeeData(staffId, warehouseCode, yearWeek);
        });

        async function loadEmployeeData(staffId, warehouseCode, yearWeek) {
          try {
            // Build query params
            const params = new URLSearchParams();
            if (warehouseCode) params.append('warehouseCode', warehouseCode);
            if (yearWeek) params.append('yearWeek', yearWeek.replace('-W', '-W'));

            // Fetch weekly KPI
            const weeklyRes = await axios.get(\`\${window.API_BASE}/employee/\${staffId}/kpi/weekly?\${params}\`);
            
            // Fetch monthly KPI
            const monthlyRes = await axios.get(\`\${window.API_BASE}/employee/\${staffId}/kpi/monthly?\${params}\`);
            
            // Fetch ORS
            const orsRes = await axios.get(\`\${window.API_BASE}/employee/\${staffId}/ors?\${params}\`);
            
            // Fetch ranking history
            const historyRes = await axios.get(\`\${window.API_BASE}/employee/\${staffId}/ranking/history?limit=12&\${params}\`);

            // Show dashboard
            document.getElementById('empty-state').classList.add('hidden');
            document.getElementById('kpi-dashboard').classList.remove('hidden');

            // Update weekly stats
            const weekly = weeklyRes.data.data;
            if (weekly?.current) {
              document.getElementById('pph-value').textContent = weekly.current.pph?.toFixed(2) || '--';
              document.getElementById('main-task-points').textContent = weekly.current.main_task_points?.toLocaleString() || '--';
              document.getElementById('main-task-name').textContent = weekly.current.main_task || '--';
              document.getElementById('work-hours').textContent = weekly.current.estimated_work_hours?.toFixed(1) || '--';
              document.getElementById('working-days').textContent = (weekly.current.working_days || 0) + ' ngày';

              // Task breakdown with Vietnamese names
              const taskDetail = weekly.current.task_points_detail || {};
              const taskNames = {
                'packing': '\u0110\u00f3ng g\u00f3i',
                'picking': 'L\u1ea5y h\u00e0ng',
                'handover': 'Giao h\u00e0ng',
                'receiving': 'Nh\u1eadn h\u00e0ng',
                'returns': 'Tr\u1ea3 h\u00e0ng',
                'inventory': 'Ki\u1ec3m k\u00ea'
              };
              const taskHtml = Object.entries(taskDetail)
                .filter(([_, v]) => v.points > 0)
                .sort((a, b) => b[1].points - a[1].points)
                .map(([task, v]) => {
                  const displayName = taskNames[task.toLowerCase()] || task.replace('_', ' ');
                  return \`
                    <div class="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <span class="font-medium text-gray-700">\${displayName}</span>
                      <span class="font-bold text-gray-900">\${v.points.toLocaleString()} \u0111i\u1ec3m</span>
                    </div>
                  \`;
                }).join('') || '<p class="text-gray-500 text-center py-4 text-sm">Kh\u00f4ng c\u00f3 d\u1eef li\u1ec7u</p>';
              document.getElementById('task-breakdown').innerHTML = taskHtml;

              // PPH trend
              if (weekly.comparison) {
                const trend = weekly.comparison.pphChange;
                document.getElementById('pph-trend').innerHTML = \`
                  <span class="\${trend >= 0 ? 'text-green-600' : 'text-red-600'} font-medium flex items-center">
                    <i class="fas fa-arrow-\${trend >= 0 ? 'up' : 'down'} mr-1"></i>
                    \${Math.abs(trend).toFixed(2)}
                    <span class="text-gray-400 text-xs ml-1">vs tuần trước</span>
                  </span>
                \`;
              }
            }

            // Update ranking
            if (weekly?.ranking) {
              const score = weekly.ranking.ranking_score;
              const colors = { 5: 'ranking-5', 4: 'ranking-4', 3: 'ranking-3', 2: 'ranking-2', 1: 'ranking-1' };
              const labels = { 5: 'Xuất sắc', 4: 'Tốt', 3: 'Đạt', 2: 'Cải thiện', 1: 'Chưa đạt' };
              document.getElementById('ranking-badge').innerHTML = \`
                <div class="flex items-center gap-3">
                  <div class="\${colors[score]} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">\${score}</div>
                  <span class="font-bold text-gray-700">\${labels[score]}</span>
                </div>
              \`;
            }

            // Update ORS
            const ors = orsRes.data.data;
            if (ors?.summary) {
              document.getElementById('ors-total').textContent = ors.summary.ors_points_total || 0;
              const milestoneColors = {
                GREEN: 'bg-green-100 text-green-800',
                YELLOW: 'bg-yellow-100 text-yellow-800',
                ORANGE: 'bg-orange-100 text-orange-800',
                RED: 'bg-red-100 text-red-800',
                CRITICAL: 'bg-red-900 text-white'
              };
              const milestoneLabels = {
                GREEN: 'Xanh \u2013 T\u1ed1t',
                YELLOW: 'V\u00e0ng \u2013 C\u1ea7n ch\u00fa \u00fd',
                ORANGE: 'Cam \u2013 C\u1ea3nh b\u00e1o',
                RED: '\u0110\u1ecf \u2013 Nguy hi\u1ec3m',
                CRITICAL: 'Nghi\u00eam tr\u1ecdng'
              };
              const level = ors.summary.milestone_level || 'GREEN';
              document.getElementById('ors-milestone').innerHTML = \`
                <span class="\${milestoneColors[level]} px-3 py-1 rounded-full text-xs font-bold">\${milestoneLabels[level]}</span>
              \`;
            }

            if (ors?.events && ors.events.length > 0) {
              document.getElementById('ors-events').innerHTML = ors.events.slice(0, 5).map(e => \`
                <div class="flex items-center justify-between p-2 bg-red-50 rounded text-sm border border-red-100">
                  <div>
                    <span class="font-medium text-gray-900">\${e.ors_code}</span>
                    <span class="text-gray-500 ml-2 text-xs">\${e.event_date}</span>
                  </div>
                  <span class="font-bold text-red-600">-\${e.ors_points}</span>
                </div>
              \`).join('');
            }

            // Update monthly summary
            const monthly = monthlyRes.data.data;
            if (monthly) {
              document.getElementById('monthly-major-kpi').textContent = monthly.major_kpi?.toLocaleString() || '--';
              document.getElementById('monthly-avg-ranking').textContent = monthly.avg_ranking_score?.toFixed(2) || '--';
              document.getElementById('monthly-rating-factor').textContent = monthly.rating_factor?.toFixed(2) || '--';
              document.getElementById('monthly-ors-penalty').textContent = (monthly.ors_penalty_rate * 100).toFixed(0) + '%';
              document.getElementById('monthly-kpi-bonus').textContent = monthly.kpi_bonus_final?.toLocaleString() + ' VND' || '--';
            }

            // Update chart
            const history = historyRes.data.data || [];
            updateRankingChart(history.reverse());

          } catch (error) {
            console.error('Error loading data:', error);
            const errorEl = document.getElementById('error-general');
            errorEl.textContent = 'Kh\u00f4ng t\u1ea3i \u0111\u01b0\u1ee3c d\u1eef li\u1ec7u KPI. Vui l\u00f2ng ki\u1ec3m tra m\u1ea1ng ho\u1eb7c th\u1eed l\u1ea1i sau.';
            errorEl.classList.remove('hidden');
          }
        }

        function updateRankingChart(data) {
          const ctx = document.getElementById('ranking-history-chart').getContext('2d');
          
          if (rankingChart) {
            rankingChart.destroy();
          }

          rankingChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: data.map(d => d.year_week),
              datasets: [
                {
                  label: 'Ranking Score',
                  data: data.map(d => d.ranking_score),
                  borderColor: '#3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.3,
                  fill: true,
                  yAxisID: 'y'
                },
                {
                  label: 'PPH',
                  data: data.map(d => d.pph),
                  borderColor: '#10b981',
                  backgroundColor: 'transparent',
                  tension: 0.3,
                  yAxisID: 'y1'
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  min: 0,
                  max: 5.5,
                  title: {
                    display: true,
                    text: 'Ranking'
                  },
                  grid: {
                    borderDash: [5, 5]
                  }
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  grid: {
                    drawOnChartArea: false,
                  },
                  title: {
                    display: true,
                    text: 'PPH'
                  }
                }
              },
              plugins: {
                legend: {
                    position: 'bottom'
                }
              }
            }
          });
        }

        // Set default week to current week
        const now = new Date();
        const year = now.getFullYear();
        const onejan = new Date(year, 0, 1);
        const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        document.getElementById('yearWeek').value = year + '-W' + String(week).padStart(2, '0');
        
        // Tooltip Script
        ${tooltipScript}
      `}} />
    </Layout>
  )
}
