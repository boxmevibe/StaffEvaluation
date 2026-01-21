import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { WAREHOUSES } from '../types/database'

export const ManagerPage: FC = () => {
  const warehouses = Object.entries(WAREHOUSES)

  return (
    <Layout title="Báo cáo kho" activeTab="report">
      {/* Page Header */}
      <div class="mb-4">
        <p class="text-sm text-gray-500">Xem tổng quan chỉ số hiệu suất (KPI) và vận hành của kho.</p>
      </div>

      {/* Filter Section - Mobile Responsive */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kho</label>
            <select
              id="warehouseCode"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px] focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn kho...</option>
              {warehouses.map(([code, info]) => (
                <option value={code}>{code} – {info.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tuần KPI</label>
            <input
              type="week"
              id="yearWeek"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px] focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tháng tính lương</label>
            <input
              type="month"
              id="payrollPeriod"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px] focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex items-end">
            <button
              onclick="loadDashboard()"
              id="btn-load-dashboard"
              class="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 min-h-[44px]"
            >
              <i class="fas fa-sync-alt mr-2"></i>
              Tải dữ liệu
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards - Mobile Responsive */}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-xs md:text-sm font-medium text-gray-500">Tổng nhân viên</p>
              <p class="text-2xl md:text-3xl font-bold text-gray-900 mt-1" id="stat-total-staff">--</p>
              <p class="text-xs text-gray-400 mt-1 hidden md:block">Có ca trong tuần</p>
            </div>
            <div class="bg-blue-500 p-3 md:p-4 rounded-xl flex-shrink-0">
              <i class="fas fa-users text-white text-lg md:text-2xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-xs md:text-sm font-medium text-gray-500">PPH trung bình</p>
              <p class="text-2xl md:text-3xl font-bold text-gray-900 mt-1" id="stat-avg-pph">--</p>
              <p class="text-xs text-gray-400 mt-1 hidden md:block">Đơn/giờ toàn kho</p>
            </div>
            <div class="bg-green-500 p-3 md:p-4 rounded-xl flex-shrink-0">
              <i class="fas fa-tachometer-alt text-white text-lg md:text-2xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-xs md:text-sm font-medium text-gray-500">Tổng điểm KPI</p>
              <p class="text-2xl md:text-3xl font-bold text-gray-900 mt-1" id="stat-total-points">--</p>
              <p class="text-xs text-gray-400 mt-1 hidden md:block">Điểm nhiệm vụ chính</p>
            </div>
            <div class="bg-purple-500 p-3 md:p-4 rounded-xl flex-shrink-0">
              <i class="fas fa-star text-white text-lg md:text-2xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-xs md:text-sm font-medium text-gray-500">Cảnh báo ORS</p>
              <p class="text-2xl md:text-3xl font-bold text-red-600 mt-1" id="stat-ors-alerts">--</p>
              <p class="text-xs text-gray-400 mt-1 hidden md:block">≥10 điểm lỗi/tháng</p>
            </div>
            <div class="bg-red-500 p-3 md:p-4 rounded-xl flex-shrink-0">
              <i class="fas fa-exclamation-triangle text-white text-lg md:text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content Grid */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Ranking Distribution */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h3 class="text-base md:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-chart-pie text-blue-600"></i>
            Phân bố mức xếp hạng
          </h3>
          <div class="h-40 md:h-48">
            <canvas id="ranking-distribution-chart"></canvas>
          </div>
          <div id="ranking-distribution-legend" class="mt-3 md:mt-4 grid grid-cols-5 gap-1 md:gap-2 text-center text-xs md:text-sm">
            <div><span class="block font-bold text-green-600" id="rank-5-count">0</span>5⭐</div>
            <div><span class="block font-bold text-blue-600" id="rank-4-count">0</span>4⭐</div>
            <div><span class="block font-bold text-yellow-600" id="rank-3-count">0</span>3⭐</div>
            <div><span class="block font-bold text-orange-600" id="rank-2-count">0</span>2⭐</div>
            <div><span class="block font-bold text-red-600" id="rank-1-count">0</span>1⭐</div>
          </div>
        </div>

        {/* Top 10 Performers */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 lg:col-span-2">
          <h3 class="text-base md:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-trophy text-yellow-500"></i>
            Top 10 Nhân viên
            <span class="text-xs font-normal text-gray-500 ml-2 hidden md:inline">Điểm KPI cao nhất tuần</span>
          </h3>

          {/* Mobile Card View */}
          <div id="top-performers-cards" class="md:hidden space-y-2">
            <p class="text-gray-500 text-center py-4">Chọn kho và tuần để xem dữ liệu</p>
          </div>

          {/* Desktop Table View */}
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">#</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Nhân viên</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">PPH</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Điểm</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Xếp hạng</th>
                </tr>
              </thead>
              <tbody id="top-performers-body" class="divide-y divide-gray-200">
                <tr><td colSpan={5} class="px-4 py-8 text-center text-gray-500">Chọn kho và tuần để xem dữ liệu</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-gray-500">
        <p>Vui lòng chọn các mục từ menu để xem chi tiết từng phần:</p>
        <div class="flex flex-wrap justify-center gap-4 mt-4">
          <a href="/leaderboard" class="text-blue-600 hover:underline">Bảng xếp hạng đầy đủ</a>
          <a href="/recovery" class="text-blue-600 hover:underline">Phục hồi điểm</a>
          <a href="/faults" class="text-blue-600 hover:underline">Biên bản phạt</a>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
        // Using window.API_BASE from Layout;
        let distributionChart = null;

        // Set default dates
        const now = new Date();
        document.getElementById('payrollPeriod').value = now.toISOString().slice(0, 7);
        const year = now.getFullYear();
        const onejan = new Date(year, 0, 1);
        const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        document.getElementById('yearWeek').value = year + '-W' + String(week).padStart(2, '0');

        async function loadDashboard() {
          const warehouseCode = document.getElementById('warehouseCode').value;
          const yearWeek = document.getElementById('yearWeek').value;
          const payrollPeriod = document.getElementById('payrollPeriod').value;

          if (!warehouseCode) {
            alert('Vui lòng chọn Warehouse');
            return;
          }

          try {
            // Load dashboard stats
            const dashRes = await axios.get(window.API_BASE + '/manager/dashboard?warehouseCode=' + warehouseCode + '&yearWeek=' + yearWeek);
            const dash = dashRes.data.data;
            
            document.getElementById('stat-total-staff').textContent = dash.totalStaff;
            document.getElementById('stat-avg-pph').textContent = dash.avgPPH.toFixed(2);
            document.getElementById('stat-total-points').textContent = dash.totalPoints.toLocaleString();

            // Load ORS alerts count for the period
            const alertRes = await axios.get(window.API_BASE + '/manager/ors/alerts?warehouseCode=' + warehouseCode + '&payrollPeriod=' + payrollPeriod);
            const alerts = alertRes.data.data || [];
            document.getElementById('stat-ors-alerts').textContent = alerts.length;

            // --- RANKING DISTRIBUTION & TOP 10 ---
            // Update ranking distribution
            const dist = dash.rankingDistribution || {};
            document.getElementById('rank-5-count').textContent = dist[5] || 0;
            document.getElementById('rank-4-count').textContent = dist[4] || 0;
            document.getElementById('rank-3-count').textContent = dist[3] || 0;
            document.getElementById('rank-2-count').textContent = dist[2] || 0;
            document.getElementById('rank-1-count').textContent = dist[1] || 0;

            // Update chart
            updateDistributionChart([dist[5]||0, dist[4]||0, dist[3]||0, dist[2]||0, dist[1]||0]);

            // Load ranking for Top 10
            const rankRes = await axios.get(window.API_BASE + '/manager/ranking?warehouseCode=' + warehouseCode + '&yearWeek=' + yearWeek + '&limit=10');
            const rankings = rankRes.data.data || [];

            // Top 10 - Desktop Table
            const rankStars = { 5: '5\u2b50', 4: '4\u2b50', 3: '3\u2b50', 2: '2\u2b50', 1: '1\u2b50' };
            document.getElementById('top-performers-body').innerHTML = rankings.slice(0, 10).map((r, i) => {
              const colors = { 5: 'bg-green-500', 4: 'bg-blue-500', 3: 'bg-yellow-500', 2: 'bg-orange-500', 1: 'bg-red-500' };
              return \`
                <tr>
                  <td class="px-4 py-2 font-bold text-gray-900">\${i + 1}</td>
                  <td class="px-4 py-2">
                    <div class="font-medium text-gray-900">\${r.staff_name || r.staff_id}</div>
                    <div class="text-xs text-gray-500">\${r.staff_id}</div>
                  </td>
                  <td class="px-4 py-2 font-bold text-blue-600">\${r.pph.toFixed(2)}</td>
                  <td class="px-4 py-2">\${r.main_task_points.toLocaleString()}</td>
                  <td class="px-4 py-2">
                    <span class="\${colors[r.ranking_score]} text-white px-2 py-1 rounded-full text-sm font-bold">\${r.ranking_score}</span>
                  </td>
                </tr>
              \`;
            }).join('') || '<tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">Kh\u00f4ng c\u00f3 d\u1eef li\u1ec7u</td></tr>';

            // Top 10 - Mobile Cards
            document.getElementById('top-performers-cards').innerHTML = rankings.slice(0, 10).map((r, i) => {
              const bgColors = { 5: 'border-l-green-500', 4: 'border-l-blue-500', 3: 'border-l-yellow-500', 2: 'border-l-orange-500', 1: 'border-l-red-500' };
              const isTop3 = i < 3;
              return \`
                <div class="p-3 bg-white border border-gray-200 rounded-lg border-l-4 \${bgColors[r.ranking_score]} \${isTop3 ? 'bg-yellow-50' : ''}">
                  <div class="flex justify-between items-start">
                    <div>
                      <span class="font-bold text-gray-900">#\${i + 1}</span>
                      <span class="font-medium ml-2">\${r.staff_name || r.staff_id}</span>
                      <div class="text-xs text-gray-500">\${r.staff_id}</div>
                    </div>
                    <span class="text-sm font-bold">\${rankStars[r.ranking_score]}</span>
                  </div>
                  <div class="mt-2 text-sm text-gray-600">
                    PPH: <span class="font-bold text-blue-600">\${r.pph.toFixed(2)}</span> | 
                    \u0110i\u1ec3m: <span class="font-bold">\${r.main_task_points.toLocaleString()}</span>
                  </div>
                </div>
              \`;
            }).join('') || '<p class="text-gray-500 text-center py-4">Kh\u00f4ng c\u00f3 d\u1eef li\u1ec7u</p>';

          } catch (error) {
            console.error('Error loading dashboard:', error);
            alert('Không thể tải dữ liệu: ' + error.message);
          }
        }

        function updateDistributionChart(data) {
          const ctx = document.getElementById('ranking-distribution-chart').getContext('2d');
          
          if (distributionChart) {
            distributionChart.destroy();
          }

          distributionChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ['Rank 5', 'Rank 4', 'Rank 3', 'Rank 2', 'Rank 1'],
              datasets: [{
                data: data,
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'],
                borderWidth: 0
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              }
            }
          });
        }

        window.loadDashboard = loadDashboard;
        window.updateDistributionChart = updateDistributionChart;
        `
      }} />
    </Layout>
  )
}
