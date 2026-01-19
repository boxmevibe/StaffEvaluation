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
        const API_BASE = '/api';
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
        }

        async function loadRankingConfig() {
          try {
            const warehouse = document.getElementById('ranking-warehouse-filter').value;
            const url = API_BASE + '/admin/ranking-config' + (warehouse ? '?warehouseCode=' + warehouse : '');
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
            const res = await axios.get(API_BASE + '/admin/role-task-config');
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
            const res = await axios.get(API_BASE + '/admin/ors-catalog');
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
            const res = await axios.get(API_BASE + '/admin/bonus-config');
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

            const res = await axios.post(API_BASE + urls[job], body);
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

            const res = await axios.post(API_BASE + '/jobs/run-pipeline', {
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
      `}} />
    </Layout>
  )
}
