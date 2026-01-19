import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { WAREHOUSES } from '../types/database'

export const AdminPage: FC = () => {
  const warehouses = Object.entries(WAREHOUSES)

  return (
    <Layout title="Admin Configuration" activeTab="admin">
      {/* Tabs */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button onclick="showTab('ranking')" id="tab-ranking" class="px-6 py-4 text-sm font-medium border-b-2 border-blue-500 text-blue-600">
              <i class="fas fa-star mr-2"></i>Ranking Config
            </button>
            <button onclick="showTab('role')" id="tab-role" class="px-6 py-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
              <i class="fas fa-user-tag mr-2"></i>Role-Task Mapping
            </button>
            <button onclick="showTab('ors')" id="tab-ors" class="px-6 py-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
              <i class="fas fa-exclamation-triangle mr-2"></i>ORS Catalog
            </button>
            <button onclick="showTab('bonus')" id="tab-bonus" class="px-6 py-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
              <i class="fas fa-money-bill mr-2"></i>Bonus Config
            </button>
            <button onclick="showTab('jobs')" id="tab-jobs" class="px-6 py-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
              <i class="fas fa-cogs mr-2"></i>Run Jobs
            </button>
            <button onclick="showTab('seed')" id="tab-seed" class="px-6 py-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
              <i class="fas fa-database mr-2"></i>Sample Data
            </button>
          </nav>
        </div>
      </div>

      {/* Ranking Config Tab */}
      <div id="content-ranking" class="tab-content">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              <i class="fas fa-sliders-h text-blue-600 mr-2"></i>
              Cấu hình ngưỡng PPH cho Ranking
            </h3>
            <select id="ranking-warehouse-filter" onchange="loadRankingConfig()" class="border border-gray-300 rounded-lg px-3 py-2">
              <option value="">Global (All Warehouses)</option>
              {warehouses.map(([code, info]) => (
                <option value={code}>{code}</option>
              ))}
            </select>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Warehouse</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Role</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">PPH Min</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">PPH Max</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Ranking Score</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Min Hours</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Active</th>
                </tr>
              </thead>
              <tbody id="ranking-config-body" class="divide-y divide-gray-200">
                <tr><td colspan="7" class="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Role-Task Mapping Tab */}
      <div id="content-role" class="tab-content hidden">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            <i class="fas fa-link text-purple-600 mr-2"></i>
            Mapping Role → Main Task
          </h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Warehouse</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Role</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Role ID</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Main Task</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Effective From</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Active</th>
                </tr>
              </thead>
              <tbody id="role-config-body" class="divide-y divide-gray-200">
                <tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ORS Catalog Tab */}
      <div id="content-ors" class="tab-content hidden">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            <i class="fas fa-list text-red-600 mr-2"></i>
            Danh mục lỗi vi phạm (32 loại)
          </h3>
          <div class="mb-4">
            <input type="text" id="ors-search" placeholder="Tìm kiếm..." onkeyup="filterOrsCatalog()" class="w-full md:w-64 border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Code</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Nhóm</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Tên lỗi</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Mức độ</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Điểm phạt</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Active</th>
                </tr>
              </thead>
              <tbody id="ors-catalog-body" class="divide-y divide-gray-200">
                <tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bonus Config Tab */}
      <div id="content-bonus" class="tab-content hidden">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            <i class="fas fa-calculator text-green-600 mr-2"></i>
            Cấu hình tính thưởng KPI
          </h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Warehouse</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Country</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Type</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Amount/Point</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Fixed Amount</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Cap</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Currency</th>
                </tr>
              </thead>
              <tbody id="bonus-config-body" class="divide-y divide-gray-200">
                <tr><td colspan="7" class="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sample Data Tab */}
      <div id="content-seed" class="tab-content hidden">
        <div class="grid md:grid-cols-2 gap-6">
          {/* Current Stats */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              <i class="fas fa-chart-bar text-blue-600 mr-2"></i>
              Trạng thái dữ liệu hiện tại
            </h3>
            <div id="seed-stats" class="space-y-3">
              <div class="text-center text-gray-500 py-4">
                <i class="fas fa-spinner fa-spin mr-2"></i>Loading...
              </div>
            </div>
            <button onclick="loadSeedStats()" class="mt-4 w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
              <i class="fas fa-sync mr-2"></i>Refresh Stats
            </button>
          </div>

          {/* Generate Data */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              <i class="fas fa-magic text-purple-600 mr-2"></i>
              Generate Sample Data
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Payroll Period</label>
                <input type="month" id="seed-period" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Number of Weeks</label>
                <select id="seed-weeks" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="1">1 tuần</option>
                  <option value="2">2 tuần</option>
                  <option value="3">3 tuần</option>
                  <option value="4" selected>4 tuần (cả tháng)</option>
                </select>
              </div>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p class="text-sm text-blue-800">
                  <i class="fas fa-info-circle mr-2"></i>
                  <strong>Sẽ tạo:</strong> ~33 nhân viên × 3 kho × số tuần = 
                  <span id="estimate-records" class="font-bold">132</span> bản ghi/bảng
                </p>
              </div>
              <button onclick="generateSeedData()" id="btn-generate" class="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600">
                <i class="fas fa-database mr-2"></i>
                Generate Sample Data
              </button>
            </div>
          </div>
        </div>

        {/* Data Preview */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            <i class="fas fa-eye text-green-600 mr-2"></i>
            Preview dữ liệu mẫu
          </h3>
          <div class="mb-4">
            <select id="preview-table" onchange="loadPreviewData()" class="border border-gray-300 rounded-lg px-3 py-2">
              <option value="kpi_weekly_summary">KPI Weekly Summary</option>
              <option value="ranking_weekly_result">Ranking Weekly Result</option>
              <option value="ors_event">ORS Events</option>
              <option value="ors_monthly_summary">ORS Monthly Summary</option>
              <option value="kpi_monthly_summary">KPI Monthly Summary</option>
              <option value="payroll_kpi_bridge">Payroll KPI Bridge</option>
            </select>
            <span id="preview-count" class="ml-4 text-sm text-gray-500"></span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr id="preview-header">
                  <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Loading...</th>
                </tr>
              </thead>
              <tbody id="preview-body" class="divide-y divide-gray-200">
                <tr><td class="px-3 py-4 text-center text-gray-500">Select a table to preview data</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Danger Zone */}
        <div class="bg-red-50 border border-red-200 rounded-xl p-6 mt-6">
          <h3 class="text-lg font-semibold text-red-800 mb-4">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            Danger Zone
          </h3>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-red-700 font-medium">Reset all sample data</p>
              <p class="text-sm text-red-600">Xóa toàn bộ dữ liệu trong các bảng kết quả (không ảnh hưởng cấu hình)</p>
            </div>
            <button onclick="resetSeedData()" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              <i class="fas fa-trash mr-2"></i>Reset Data
            </button>
          </div>
        </div>

        {/* Generation Result */}
        <div id="seed-result" class="mt-6 hidden">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 class="font-medium text-gray-900 mb-2">Kết quả:</h4>
            <pre id="seed-output" class="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto max-h-64"></pre>
          </div>
        </div>
      </div>

      {/* Jobs Tab */}
      <div id="content-jobs" class="tab-content hidden">
        <div class="grid md:grid-cols-2 gap-6">
          {/* Individual Jobs */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              <i class="fas fa-play text-blue-600 mr-2"></i>
              Chạy Jobs thủ công
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Warehouse (optional)</label>
                <select id="job-warehouse" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">All Warehouses</option>
                  {warehouses.map(([code, info]) => (
                    <option value={code}>{code}</option>
                  ))}
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tuần (for Job A, B)</label>
                <input type="week" id="job-week" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tháng (for Job C, D)</label>
                <input type="month" id="job-month" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <button onclick="runJob('a')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <i class="fas fa-calculator mr-2"></i>Job A
                </button>
                <button onclick="runJob('b')" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  <i class="fas fa-star mr-2"></i>Job B
                </button>
                <button onclick="runJob('c')" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                  <i class="fas fa-shield-alt mr-2"></i>Job C
                </button>
                <button onclick="runJob('d')" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  <i class="fas fa-file-invoice-dollar mr-2"></i>Job D
                </button>
              </div>
            </div>
          </div>

          {/* Full Pipeline */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              <i class="fas fa-rocket text-orange-600 mr-2"></i>
              Chạy Full Pipeline
            </h3>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <p class="text-sm text-orange-800">
                <i class="fas fa-info-circle mr-2"></i>
                Pipeline sẽ chạy tuần tự: Job A → Job B → Job C → Job D
              </p>
            </div>
            <button onclick="runPipeline()" class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600">
              <i class="fas fa-play-circle mr-2"></i>
              Run Full Pipeline
            </button>
            
            {/* Job Results */}
            <div id="job-results" class="mt-4 hidden">
              <h4 class="font-medium text-gray-900 mb-2">Kết quả:</h4>
              <pre id="job-output" class="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto max-h-64"></pre>
            </div>
          </div>
        </div>

        {/* Job Descriptions */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            <i class="fas fa-info-circle text-gray-600 mr-2"></i>
            Mô tả Jobs
          </h3>
          <div class="grid md:grid-cols-4 gap-4">
            <div class="p-4 bg-blue-50 rounded-lg">
              <h4 class="font-medium text-blue-800 mb-2"><i class="fas fa-calculator mr-2"></i>Job A</h4>
              <p class="text-sm text-blue-600">Build KPI Weekly Summary - Tổng hợp điểm tuần, tính PPH</p>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg">
              <h4 class="font-medium text-purple-800 mb-2"><i class="fas fa-star mr-2"></i>Job B</h4>
              <p class="text-sm text-purple-600">Compute Ranking - Chấm ranking score 1-5 dựa trên PPH</p>
            </div>
            <div class="p-4 bg-red-50 rounded-lg">
              <h4 class="font-medium text-red-800 mb-2"><i class="fas fa-shield-alt mr-2"></i>Job C</h4>
              <p class="text-sm text-red-600">Compute ORS Summary - Tổng hợp ORS tháng, xác định milestone</p>
            </div>
            <div class="p-4 bg-green-50 rounded-lg">
              <h4 class="font-medium text-green-800 mb-2"><i class="fas fa-file-invoice-dollar mr-2"></i>Job D</h4>
              <p class="text-sm text-green-600">Build Monthly Summary - Tính KPI Bonus, chuẩn bị cho payroll</p>
            </div>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
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
            const url = window.API_BASE + '/admin/ranking-config' + (warehouse ? '?warehouseCode=' + warehouse : '');
            const res = await axios.get(url);
            const data = res.data.data || [];

            const rankColors = { 5: 'text-green-600', 4: 'text-blue-600', 3: 'text-yellow-600', 2: 'text-orange-600', 1: 'text-red-600' };

            document.getElementById('ranking-config-body').innerHTML = data.map(r => \`
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-2">\${r.warehouse_code || 'Global'}</td>
                <td class="px-4 py-2">\${r.role || 'All'}</td>
                <td class="px-4 py-2">\${r.pph_min}</td>
                <td class="px-4 py-2">\${r.pph_max}</td>
                <td class="px-4 py-2 font-bold \${rankColors[r.ranking_score]}">\${r.ranking_score}</td>
                <td class="px-4 py-2">\${r.min_weekly_hours || 20}h</td>
                <td class="px-4 py-2">
                  <span class="\${r.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} px-2 py-1 rounded-full text-xs">
                    \${r.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            \`).join('') || '<tr><td colspan="7" class="px-4 py-8 text-center text-gray-500">Không có dữ liệu</td></tr>';
          } catch (error) {
            console.error('Error loading ranking config:', error);
          }
        }

        async function loadRoleConfig() {
          try {
            const res = await axios.get(window.API_BASE + '/admin/role-task-config');
            const data = res.data.data || [];

            document.getElementById('role-config-body').innerHTML = data.map(r => \`
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-2">\${r.warehouse_code || 'Global'}</td>
                <td class="px-4 py-2 font-medium">\${r.role}</td>
                <td class="px-4 py-2">\${r.role_id || '-'}</td>
                <td class="px-4 py-2">
                  <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm capitalize">\${r.main_task}</span>
                </td>
                <td class="px-4 py-2">\${r.effective_from}</td>
                <td class="px-4 py-2">
                  <span class="\${r.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} px-2 py-1 rounded-full text-xs">
                    \${r.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            \`).join('') || '<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">Không có dữ liệu</td></tr>';
          } catch (error) {
            console.error('Error loading role config:', error);
          }
        }

        async function loadOrsCatalog() {
          try {
            const res = await axios.get(window.API_BASE + '/admin/ors-catalog');
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
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-2 font-mono text-sm font-medium">\${o.ors_code}</td>
              <td class="px-4 py-2 capitalize">\${o.job_group.replace('_', ' ')}</td>
              <td class="px-4 py-2" title="\${o.description || ''}">\${o.name}</td>
              <td class="px-4 py-2">
                <span class="\${severityColors[o.severity_level]} px-2 py-1 rounded text-sm font-medium">\${o.severity_level}</span>
              </td>
              <td class="px-4 py-2 font-bold text-red-600">\${o.ors_points}</td>
              <td class="px-4 py-2">
                <span class="\${o.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} px-2 py-1 rounded-full text-xs">
                  \${o.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>
          \`).join('') || '<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">Không có dữ liệu</td></tr>';
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
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-2">\${b.warehouse_code || 'All'}</td>
                <td class="px-4 py-2 font-medium">\${b.country || 'All'}</td>
                <td class="px-4 py-2">
                  <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">\${b.calculation_type}</span>
                </td>
                <td class="px-4 py-2">\${b.amount_per_point?.toLocaleString() || '-'}</td>
                <td class="px-4 py-2">\${b.fixed_amount?.toLocaleString() || '-'}</td>
                <td class="px-4 py-2">\${b.cap_amount?.toLocaleString() || '-'}</td>
                <td class="px-4 py-2 font-medium">\${b.currency}</td>
              </tr>
            \`).join('') || '<tr><td colspan="7" class="px-4 py-8 text-center text-gray-500">Không có dữ liệu</td></tr>';
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
      `}} />
    </Layout>
  )
}
