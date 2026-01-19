import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { WAREHOUSES } from '../types/database'

export const ManagerPage: FC = () => {
  const warehouses = Object.entries(WAREHOUSES)

  return (
    <Layout title="Dashboard Quản lý Kho" activeTab="manager">
      {/* Warehouse Selector */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="grid md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
            <select 
              id="warehouseCode" 
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Chọn kho --</option>
              {warehouses.map(([code, info]) => (
                <option value={code}>{code} - {info.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tuần</label>
            <input 
              type="week" 
              id="yearWeek"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tháng (Payroll)</label>
            <input 
              type="month" 
              id="payrollPeriod"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex items-end">
            <button 
              onclick="loadDashboard()"
              class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              <i class="fas fa-sync-alt mr-2"></i>
              Tải dữ liệu
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div class="grid md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Tổng nhân viên</p>
              <p class="text-3xl font-bold text-gray-900 mt-1" id="stat-total-staff">--</p>
            </div>
            <div class="bg-blue-500 p-4 rounded-xl">
              <i class="fas fa-users text-white text-2xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">PPH Trung bình</p>
              <p class="text-3xl font-bold text-gray-900 mt-1" id="stat-avg-pph">--</p>
            </div>
            <div class="bg-green-500 p-4 rounded-xl">
              <i class="fas fa-tachometer-alt text-white text-2xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Tổng điểm</p>
              <p class="text-3xl font-bold text-gray-900 mt-1" id="stat-total-points">--</p>
            </div>
            <div class="bg-purple-500 p-4 rounded-xl">
              <i class="fas fa-star text-white text-2xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">ORS Alerts</p>
              <p class="text-3xl font-bold text-red-600 mt-1" id="stat-ors-alerts">--</p>
            </div>
            <div class="bg-red-500 p-4 rounded-xl">
              <i class="fas fa-exclamation-triangle text-white text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div class="grid md:grid-cols-3 gap-6 mb-6">
        {/* Ranking Distribution */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            <i class="fas fa-chart-pie text-blue-600 mr-2"></i>
            Phân bố Ranking
          </h3>
          <div class="h-48">
            <canvas id="ranking-distribution-chart"></canvas>
          </div>
          <div id="ranking-distribution-legend" class="mt-4 grid grid-cols-5 gap-2 text-center text-sm">
            <div><span class="block font-bold text-green-600" id="rank-5-count">0</span>Rank 5</div>
            <div><span class="block font-bold text-blue-600" id="rank-4-count">0</span>Rank 4</div>
            <div><span class="block font-bold text-yellow-600" id="rank-3-count">0</span>Rank 3</div>
            <div><span class="block font-bold text-orange-600" id="rank-2-count">0</span>Rank 2</div>
            <div><span class="block font-bold text-red-600" id="rank-1-count">0</span>Rank 1</div>
          </div>
        </div>

        {/* Top Performers */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 col-span-2">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            <i class="fas fa-trophy text-yellow-500 mr-2"></i>
            Top 10 Nhân viên
          </h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">#</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Nhân viên</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">PPH</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Điểm</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Ranking</th>
                </tr>
              </thead>
              <tbody id="top-performers-body" class="divide-y divide-gray-200">
                <tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">Chọn kho để xem dữ liệu</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ORS Section */}
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        {/* ORS Alerts */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            <i class="fas fa-bell text-red-600 mr-2"></i>
            Cảnh báo ORS (≥10 điểm)
          </h3>
          <div id="ors-alerts-list" class="space-y-3 max-h-80 overflow-y-auto">
            <p class="text-gray-500 text-center py-4">Không có cảnh báo</p>
          </div>
        </div>

        {/* Pending ORS Review */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            <i class="fas fa-clipboard-check text-orange-600 mr-2"></i>
            ORS Chờ Review
            <span id="pending-count" class="ml-2 bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-sm">0</span>
          </h3>
          <div id="pending-ors-list" class="space-y-3 max-h-80 overflow-y-auto">
            <p class="text-gray-500 text-center py-4">Không có ORS chờ review</p>
          </div>
        </div>
      </div>

      {/* Create ORS Event Modal Trigger */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-plus-circle text-blue-600 mr-2"></i>
          Ghi nhận sự cố ORS
        </h3>
        <form id="create-ors-form" class="grid md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mã nhân viên *</label>
            <input type="text" id="ors-staff-id" required class="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên nhân viên</label>
            <input type="text" id="ors-staff-name" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ngày vi phạm *</label>
            <input type="date" id="ors-event-date" required class="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Loại vi phạm *</label>
            <select id="ors-code" required class="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="">-- Chọn loại vi phạm --</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <input type="text" id="ors-description" class="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Mô tả chi tiết sự cố..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Người báo cáo *</label>
            <input type="text" id="ors-reported-by" required class="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div class="md:col-span-2 flex items-end">
            <button type="submit" class="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700">
              <i class="fas fa-plus mr-2"></i>
              Tạo ORS Event
            </button>
          </div>
        </form>
      </div>

      {/* Full Ranking Table */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            <i class="fas fa-list-ol text-purple-600 mr-2"></i>
            Bảng xếp hạng đầy đủ
          </h3>
          <button 
            onclick="exportRankingCSV()"
            class="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 text-sm"
          >
            <i class="fas fa-file-csv mr-2"></i>
            Export CSV
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">#</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Mã NV</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Tên</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">PPH</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Main Task Points</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Giờ làm</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Ranking</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody id="full-ranking-body" class="divide-y divide-gray-200">
              <tr><td colspan="8" class="px-4 py-8 text-center text-gray-500">Chọn kho để xem dữ liệu</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        // Using window.API_BASE from Layout;
        let distributionChart = null;
        let orsCatalog = [];
        let rankingData = []; // Store ranking data for export

        // Set default dates
        const now = new Date();
        document.getElementById('payrollPeriod').value = now.toISOString().slice(0, 7);
        const year = now.getFullYear();
        const onejan = new Date(year, 0, 1);
        const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        document.getElementById('yearWeek').value = year + '-W' + String(week).padStart(2, '0');
        document.getElementById('ors-event-date').value = now.toISOString().slice(0, 10);

        // Load ORS catalog
        async function loadOrsCatalog() {
          try {
            const res = await axios.get(window.API_BASE + '/admin/ors-catalog');
            orsCatalog = res.data.data || [];
            const select = document.getElementById('ors-code');
            let currentGroup = '';
            orsCatalog.forEach(item => {
              if (item.job_group !== currentGroup) {
                if (currentGroup) select.appendChild(document.createElement('optgroup'));
                const group = document.createElement('optgroup');
                group.label = item.job_group.toUpperCase();
                select.appendChild(group);
                currentGroup = item.job_group;
              }
              const option = document.createElement('option');
              option.value = item.ors_code;
              option.textContent = item.ors_code + ' - ' + item.name + ' (' + item.severity_level + ', ' + item.ors_points + ' pts)';
              select.lastElementChild.appendChild(option);
            });
          } catch (e) {
            console.error('Failed to load ORS catalog:', e);
          }
        }
        loadOrsCatalog();

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

            // Update ranking distribution
            const dist = dash.rankingDistribution;
            document.getElementById('rank-5-count').textContent = dist[5] || 0;
            document.getElementById('rank-4-count').textContent = dist[4] || 0;
            document.getElementById('rank-3-count').textContent = dist[3] || 0;
            document.getElementById('rank-2-count').textContent = dist[2] || 0;
            document.getElementById('rank-1-count').textContent = dist[1] || 0;

            // Update chart
            updateDistributionChart([dist[5]||0, dist[4]||0, dist[3]||0, dist[2]||0, dist[1]||0]);

            // Load ranking
            const rankRes = await axios.get(window.API_BASE + '/manager/ranking?warehouseCode=' + warehouseCode + '&yearWeek=' + yearWeek + '&limit=100');
            const rankings = rankRes.data.data || [];
            rankingData = rankings; // Store for export

            // Top 10
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
            }).join('') || '<tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">Không có dữ liệu</td></tr>';

            // Full ranking
            document.getElementById('full-ranking-body').innerHTML = rankings.map((r, i) => {
              const colors = { 5: 'bg-green-500', 4: 'bg-blue-500', 3: 'bg-yellow-500', 2: 'bg-orange-500', 1: 'bg-red-500' };
              const statusColors = { FINAL: 'text-green-600', INSUFFICIENT_DATA: 'text-yellow-600', PENDING_REVIEW: 'text-orange-600' };
              return \`
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-2">\${i + 1}</td>
                  <td class="px-4 py-2 font-mono text-sm">\${r.staff_id}</td>
                  <td class="px-4 py-2">\${r.staff_name || '-'}</td>
                  <td class="px-4 py-2 font-bold">\${r.pph.toFixed(2)}</td>
                  <td class="px-4 py-2">\${r.main_task_points.toLocaleString()}</td>
                  <td class="px-4 py-2">\${r.estimated_work_hours.toFixed(1)}h</td>
                  <td class="px-4 py-2">
                    <span class="\${colors[r.ranking_score]} text-white px-2 py-1 rounded-full text-sm font-bold">\${r.ranking_score}</span>
                  </td>
                  <td class="px-4 py-2 \${statusColors[r.status] || ''} text-sm">\${r.status}</td>
                </tr>
              \`;
            }).join('') || '<tr><td colspan="8" class="px-4 py-8 text-center text-gray-500">Không có dữ liệu</td></tr>';

            // Load ORS alerts
            const alertRes = await axios.get(window.API_BASE + '/manager/ors/alerts?warehouseCode=' + warehouseCode + '&payrollPeriod=' + payrollPeriod);
            const alerts = alertRes.data.data || [];
            document.getElementById('stat-ors-alerts').textContent = alerts.length;
            
            const milestoneColors = {
              GREEN: 'bg-green-100 text-green-800',
              YELLOW: 'bg-yellow-100 text-yellow-800',
              ORANGE: 'bg-orange-100 text-orange-800',
              RED: 'bg-red-100 text-red-800',
              CRITICAL: 'bg-red-900 text-white'
            };
            
            document.getElementById('ors-alerts-list').innerHTML = alerts.map(a => \`
              <div class="p-3 bg-red-50 rounded-lg border border-red-100">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium text-gray-900">\${a.staff_name || a.staff_id}</p>
                    <p class="text-sm text-gray-500">ID: \${a.staff_id}</p>
                  </div>
                  <div class="text-right">
                    <span class="text-lg font-bold text-red-600">\${a.ors_points_total} pts</span>
                    <span class="\${milestoneColors[a.milestone_level]} px-2 py-0.5 rounded-full text-xs ml-2">\${a.milestone_level}</span>
                  </div>
                </div>
              </div>
            \`).join('') || '<p class="text-gray-500 text-center py-4">Không có cảnh báo</p>';

            // Load pending ORS
            const pendingRes = await axios.get(window.API_BASE + '/manager/ors/pending?warehouseCode=' + warehouseCode);
            const pending = pendingRes.data.data || [];
            document.getElementById('pending-count').textContent = pending.length;
            
            document.getElementById('pending-ors-list').innerHTML = pending.map(p => \`
              <div class="p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <p class="font-medium text-gray-900">\${p.staff_name || p.staff_id}</p>
                    <p class="text-sm text-gray-500">\${p.ors_code} - \${p.event_date}</p>
                  </div>
                  <span class="font-bold text-orange-600">\${p.ors_points} pts</span>
                </div>
                <p class="text-sm text-gray-600 mb-2">\${p.description || 'Không có mô tả'}</p>
                <div class="flex gap-2">
                  <button onclick="reviewOrs(\${p.id}, 'CONFIRMED')" class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                    <i class="fas fa-check mr-1"></i>Approve
                  </button>
                  <button onclick="reviewOrs(\${p.id}, 'REJECTED')" class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                    <i class="fas fa-times mr-1"></i>Reject
                  </button>
                </div>
              </div>
            \`).join('') || '<p class="text-gray-500 text-center py-4">Không có ORS chờ review</p>';

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

        async function reviewOrs(eventId, status) {
          const reviewedBy = prompt('Nhập tên người review:');
          if (!reviewedBy) return;

          let rejectionReason = null;
          if (status === 'REJECTED') {
            rejectionReason = prompt('Nhập lý do reject:');
            if (!rejectionReason) return;
          }

          try {
            await axios.post(window.API_BASE + '/manager/ors/' + eventId + '/review', {
              status,
              reviewed_by: reviewedBy,
              rejection_reason: rejectionReason
            });
            alert('Đã cập nhật ORS event');
            loadDashboard();
          } catch (error) {
            alert('Lỗi: ' + error.message);
          }
        }

        document.getElementById('create-ors-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const warehouseCode = document.getElementById('warehouseCode').value;
          if (!warehouseCode) {
            alert('Vui lòng chọn Warehouse trước');
            return;
          }

          const data = {
            warehouse_code: warehouseCode,
            staff_id: document.getElementById('ors-staff-id').value,
            staff_name: document.getElementById('ors-staff-name').value || null,
            event_date: document.getElementById('ors-event-date').value,
            ors_code: document.getElementById('ors-code').value,
            description: document.getElementById('ors-description').value || null,
            reported_by: document.getElementById('ors-reported-by').value
          };

          try {
            await axios.post(window.API_BASE + '/manager/ors/create', data);
            alert('Đã tạo ORS event thành công');
            document.getElementById('create-ors-form').reset();
            document.getElementById('ors-event-date').value = new Date().toISOString().slice(0, 10);
            loadDashboard();
          } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
          }
        });

        // Export ranking data to CSV
        function exportRankingCSV() {
          if (!rankingData || rankingData.length === 0) {
            alert('Không có dữ liệu để export. Vui lòng tải dữ liệu trước.');
            return;
          }

          const warehouseCode = document.getElementById('warehouseCode').value;
          const yearWeek = document.getElementById('yearWeek').value;
          
          const columns = [
            { key: 'staff_id', label: 'Mã NV' },
            { key: 'staff_name', label: 'Tên NV' },
            { key: 'pph', label: 'PPH' },
            { key: 'main_task_points', label: 'Điểm Main Task' },
            { key: 'estimated_work_hours', label: 'Giờ làm việc' },
            { key: 'ranking_score', label: 'Ranking Score' },
            { key: 'status', label: 'Trạng thái' },
          ];
          
          // Build CSV
          const header = columns.map(c => '"' + c.label + '"').join(',');
          const rows = rankingData.map(item => {
            return columns.map(c => {
              let val = item[c.key];
              if (val === null || val === undefined) return '""';
              return '"' + String(val).replace(/"/g, '""') + '"';
            }).join(',');
          });
          
          const csv = [header, ...rows].join('\\n');
          const BOM = '\\uFEFF';
          const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'ranking_' + warehouseCode + '_' + yearWeek + '.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      `}} />
    </Layout>
  )
}
