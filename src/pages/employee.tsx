import type { FC } from 'hono/jsx'
import { Layout, StatCard, RankingBadge, MilestoneBadge, Table } from '../components/Layout'
import { tooltipScript } from '../components/Tooltip'
import { WAREHOUSES } from '../types/database'

interface EmployeePageProps {
  staffId?: string
  warehouseCode?: string
}

export const EmployeePage: FC<EmployeePageProps> = ({ staffId, warehouseCode }) => {
  const warehouses = Object.entries(WAREHOUSES)

  return (
    <Layout title="Dashboard Nhân viên" activeTab="employee">
      {/* Help Banner */}
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <i class="fas fa-lightbulb text-yellow-500 text-xl mr-3"></i>
            <div>
              <p class="font-medium text-gray-900">Mới sử dụng? Xem hướng dẫn để hiểu các chỉ số KPI</p>
              <p class="text-sm text-gray-600">Bấm vào icon <i class="fas fa-info-circle text-blue-500"></i> bên cạnh mỗi chỉ số để xem giải thích chi tiết</p>
            </div>
          </div>
          <a href="/onboarding" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
            <i class="fas fa-book-open mr-2"></i>Hướng dẫn
          </a>
        </div>
      </div>

      {/* Staff Selection Form */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-search mr-2 text-blue-600"></i>
          Tra cứu KPI Cá nhân
        </h2>
        <form id="employee-search-form" class="grid md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
            <select 
              id="warehouseCode" 
              name="warehouseCode" 
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Chọn kho --</option>
              {warehouses.map(([code, info]) => (
                <option value={code} selected={code === warehouseCode}>{code} - {info.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mã nhân viên</label>
            <input 
              type="text" 
              id="staffId" 
              name="staffId"
              value={staffId || ''}
              placeholder="Nhập mã NV..."
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tuần</label>
            <input 
              type="week" 
              id="yearWeek" 
              name="yearWeek"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="flex items-end">
            <button 
              type="submit" 
              class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <i class="fas fa-search mr-2"></i>
              Tra cứu
            </button>
          </div>
        </form>
      </div>

      {/* KPI Dashboard (will be populated by JS) */}
      <div id="kpi-dashboard" class="hidden">
        {/* Stats Row */}
        <div class="grid md:grid-cols-4 gap-6 mb-6">
          <div id="stat-pph" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">
                  PPH (Points/Hour)
                  <span class="inline-flex items-center justify-center w-5 h-5 ml-1 text-gray-400 hover:text-blue-500 cursor-help transition-colors" data-tooltip-key="pph">
                    <i class="fas fa-info-circle text-sm"></i>
                  </span>
                </p>
                <p class="text-3xl font-bold text-gray-900 mt-1" id="pph-value">--</p>
                <p class="text-sm mt-2" id="pph-trend"></p>
              </div>
              <div class="bg-blue-500 p-4 rounded-xl">
                <i class="fas fa-tachometer-alt text-white text-2xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">
                  Ranking Score
                  <span class="inline-flex items-center justify-center w-5 h-5 ml-1 text-gray-400 hover:text-blue-500 cursor-help transition-colors" data-tooltip-key="ranking">
                    <i class="fas fa-info-circle text-sm"></i>
                  </span>
                </p>
                <div class="mt-2" id="ranking-badge">--</div>
              </div>
              <div class="bg-yellow-500 p-4 rounded-xl">
                <i class="fas fa-star text-white text-2xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">
                  Điểm Main Task
                  <span class="inline-flex items-center justify-center w-5 h-5 ml-1 text-gray-400 hover:text-blue-500 cursor-help transition-colors" data-tooltip-key="mainTask">
                    <i class="fas fa-info-circle text-sm"></i>
                  </span>
                </p>
                <p class="text-3xl font-bold text-gray-900 mt-1" id="main-task-points">--</p>
                <p class="text-xs text-gray-400 mt-1" id="main-task-name">--</p>
              </div>
              <div class="bg-green-500 p-4 rounded-xl">
                <i class="fas fa-tasks text-white text-2xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">
                  Giờ làm việc
                  <span class="inline-flex items-center justify-center w-5 h-5 ml-1 text-gray-400 hover:text-blue-500 cursor-help transition-colors" data-tooltip-key="workHours">
                    <i class="fas fa-info-circle text-sm"></i>
                  </span>
                </p>
                <p class="text-3xl font-bold text-gray-900 mt-1" id="work-hours">--</p>
                <p class="text-xs text-gray-400 mt-1" id="working-days">-- ngày</p>
              </div>
              <div class="bg-purple-500 p-4 rounded-xl">
                <i class="fas fa-clock text-white text-2xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Task Breakdown & ORS */}
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          {/* Task Breakdown */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              <i class="fas fa-chart-pie text-blue-600 mr-2"></i>
              Chi tiết điểm theo Task
            </h3>
            <div id="task-breakdown" class="space-y-3">
              <p class="text-gray-500 text-center py-4">Chưa có dữ liệu</p>
            </div>
          </div>

          {/* ORS Summary */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              <i class="fas fa-shield-alt text-red-600 mr-2"></i>
              Điểm rủi ro ORS (Tháng)
              <span class="inline-flex items-center justify-center w-5 h-5 ml-1 text-gray-400 hover:text-blue-500 cursor-help transition-colors" data-tooltip-key="ors">
                <i class="fas fa-info-circle text-sm"></i>
              </span>
            </h3>
            <div id="ors-summary" class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p class="text-sm text-gray-500">Tổng điểm ORS</p>
                  <p class="text-2xl font-bold text-gray-900" id="ors-total">0</p>
                </div>
                <div id="ors-milestone">
                  <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">GREEN</span>
                </div>
              </div>
              <div id="ors-events" class="space-y-2">
                <p class="text-gray-500 text-center py-2 text-sm">Không có vi phạm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            <i class="fas fa-calendar-alt text-green-600 mr-2"></i>
            Tổng hợp KPI Tháng
          </h3>
          <div id="monthly-summary" class="grid md:grid-cols-5 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-gray-500">
                Major KPI
                <span class="inline-flex items-center justify-center w-4 h-4 ml-1 text-gray-400 hover:text-blue-500 cursor-help transition-colors" data-tooltip-key="mainTask">
                  <i class="fas fa-info-circle text-xs"></i>
                </span>
              </p>
              <p class="text-2xl font-bold text-blue-600" id="monthly-major-kpi">--</p>
            </div>
            <div class="text-center p-4 bg-yellow-50 rounded-lg">
              <p class="text-sm text-gray-500">
                Avg Ranking
                <span class="inline-flex items-center justify-center w-4 h-4 ml-1 text-gray-400 hover:text-blue-500 cursor-help transition-colors" data-tooltip-key="ranking">
                  <i class="fas fa-info-circle text-xs"></i>
                </span>
              </p>
              <p class="text-2xl font-bold text-yellow-600" id="monthly-avg-ranking">--</p>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <p class="text-sm text-gray-500">
                Rating Factor
                <span class="inline-flex items-center justify-center w-4 h-4 ml-1 text-gray-400 hover:text-blue-500 cursor-help transition-colors" data-tooltip-key="ratingFactor">
                  <i class="fas fa-info-circle text-xs"></i>
                </span>
              </p>
              <p class="text-2xl font-bold text-purple-600" id="monthly-rating-factor">--</p>
            </div>
            <div class="text-center p-4 bg-red-50 rounded-lg">
              <p class="text-sm text-gray-500">
                ORS Penalty
                <span class="inline-flex items-center justify-center w-4 h-4 ml-1 text-gray-400 hover:text-blue-500 cursor-help transition-colors" data-tooltip-key="ors">
                  <i class="fas fa-info-circle text-xs"></i>
                </span>
              </p>
              <p class="text-2xl font-bold text-red-600" id="monthly-ors-penalty">--</p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-gray-500">
                KPI Bonus
                <span class="inline-flex items-center justify-center w-4 h-4 ml-1 text-gray-400 hover:text-blue-500 cursor-help transition-colors" data-tooltip-key="kpiBonus">
                  <i class="fas fa-info-circle text-xs"></i>
                </span>
              </p>
              <p class="text-2xl font-bold text-green-600" id="monthly-kpi-bonus">--</p>
            </div>
          </div>
        </div>

        {/* Ranking History Chart */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            <i class="fas fa-chart-line text-purple-600 mr-2"></i>
            Lịch sử Ranking (12 tuần gần nhất)
          </h3>
          <div class="h-64">
            <canvas id="ranking-history-chart"></canvas>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div id="empty-state" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <i class="fas fa-chart-bar text-gray-300 text-6xl mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Chưa có dữ liệu</h3>
        <p class="text-gray-500">Vui lòng nhập Mã NV và chọn Warehouse để xem KPI</p>
      </div>

      {/* JavaScript for fetching and displaying data */}
      <script dangerouslySetInnerHTML={{ __html: `
        // Use dynamic API_BASE from Layout (demo or api)
        let rankingChart = null;

        document.getElementById('employee-search-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          const staffId = document.getElementById('staffId').value;
          const warehouseCode = document.getElementById('warehouseCode').value;
          const yearWeek = document.getElementById('yearWeek').value;

          if (!staffId) {
            alert('Vui lòng nhập Mã nhân viên');
            return;
          }

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

              // Task breakdown
              const taskDetail = weekly.current.task_points_detail || {};
              const taskHtml = Object.entries(taskDetail)
                .filter(([_, v]) => v.points > 0)
                .sort((a, b) => b[1].points - a[1].points)
                .map(([task, v]) => \`
                  <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span class="font-medium text-gray-700 capitalize">\${task.replace('_', ' ')}</span>
                    <span class="text-gray-900">\${v.points.toLocaleString()} điểm</span>
                  </div>
                \`).join('') || '<p class="text-gray-500 text-center py-4">Không có dữ liệu</p>';
              document.getElementById('task-breakdown').innerHTML = taskHtml;

              // PPH trend
              if (weekly.comparison) {
                const trend = weekly.comparison.pphChange;
                document.getElementById('pph-trend').innerHTML = \`
                  <span class="\${trend >= 0 ? 'text-green-600' : 'text-red-600'}">
                    <i class="fas fa-arrow-\${trend >= 0 ? 'up' : 'down'} mr-1"></i>
                    \${Math.abs(trend).toFixed(2)} so với tuần trước
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
                <div class="flex items-center gap-2">
                  <div class="\${colors[score]} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">\${score}</div>
                  <span class="text-sm text-gray-600">\${labels[score]}</span>
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
              const level = ors.summary.milestone_level || 'GREEN';
              document.getElementById('ors-milestone').innerHTML = \`
                <span class="\${milestoneColors[level]} px-3 py-1 rounded-full text-sm font-medium">\${level}</span>
              \`;
            }

            if (ors?.events && ors.events.length > 0) {
              document.getElementById('ors-events').innerHTML = ors.events.slice(0, 5).map(e => \`
                <div class="flex items-center justify-between p-2 bg-red-50 rounded text-sm">
                  <div>
                    <span class="font-medium">\${e.ors_code}</span>
                    <span class="text-gray-500 ml-2">\${e.event_date}</span>
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
            alert('Không thể tải dữ liệu. Vui lòng thử lại.');
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
                  min: 1,
                  max: 5,
                  title: {
                    display: true,
                    text: 'Ranking'
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
