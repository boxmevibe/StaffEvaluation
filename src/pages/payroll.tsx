import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { WAREHOUSES } from '../types/database'

export const PayrollPage: FC = () => {
  const warehouses = Object.entries(WAREHOUSES)

  return (
    <Layout title="Payroll KPI Data" activeTab="payroll">
      {/* Filter Section */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="grid md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
            <select 
              id="warehouseCode" 
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Tất cả kho --</option>
              {warehouses.map(([code, info]) => (
                <option value={code}>{code} - {info.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kỳ lương *</label>
            <input 
              type="month" 
              id="payrollPeriod" 
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select id="applyFilter" class="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="">Tất cả</option>
              <option value="false">Chưa apply</option>
              <option value="true">Đã apply</option>
            </select>
          </div>
          <div class="flex items-end">
            <button 
              onclick="loadPayrollData()"
              class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              <i class="fas fa-search mr-2"></i>
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
              <p class="text-3xl font-bold text-gray-900 mt-1" id="stat-total">--</p>
            </div>
            <div class="bg-blue-500 p-4 rounded-xl">
              <i class="fas fa-users text-white text-2xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Tổng KPI Bonus</p>
              <p class="text-2xl font-bold text-green-600 mt-1" id="stat-total-bonus">--</p>
            </div>
            <div class="bg-green-500 p-4 rounded-xl">
              <i class="fas fa-money-bill-wave text-white text-2xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Đã Apply</p>
              <p class="text-3xl font-bold text-purple-600 mt-1" id="stat-applied">--</p>
            </div>
            <div class="bg-purple-500 p-4 rounded-xl">
              <i class="fas fa-check-double text-white text-2xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Chưa Apply</p>
              <p class="text-3xl font-bold text-orange-600 mt-1" id="stat-pending">--</p>
            </div>
            <div class="bg-orange-500 p-4 rounded-xl">
              <i class="fas fa-clock text-white text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <div class="flex gap-2">
            <button onclick="selectAll()" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
              <i class="fas fa-check-square mr-2"></i>Chọn tất cả
            </button>
            <button onclick="deselectAll()" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
              <i class="fas fa-square mr-2"></i>Bỏ chọn
            </button>
            <button onclick="exportCSV()" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
              <i class="fas fa-download mr-2"></i>Export CSV
            </button>
          </div>
          <div class="flex gap-2">
            <button onclick="applySelected()" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
              <i class="fas fa-check mr-2"></i>Apply Selected to Payroll
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-3 text-left">
                  <input type="checkbox" id="select-all-checkbox" onchange="toggleSelectAll()" class="rounded" />
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff ID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Major KPI</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating Factor</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">KPI Bonus</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penalty</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Calculated At</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody id="payroll-data-body" class="divide-y divide-gray-200">
              <tr><td colspan="10" class="px-4 py-8 text-center text-gray-500">Chọn kỳ lương và click "Tải dữ liệu"</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary by Warehouse */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-chart-bar text-blue-600 mr-2"></i>
          Tổng hợp theo Warehouse
        </h3>
        <div id="warehouse-summary" class="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          <p class="text-gray-500 col-span-full text-center py-4">Chưa có dữ liệu</p>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        // Using window.window.API_BASE from Layout;
        let payrollData = [];

        // Set default period to current month
        const now = new Date();
        document.getElementById('payrollPeriod').value = now.toISOString().slice(0, 7);

        async function loadPayrollData() {
          const warehouseCode = document.getElementById('warehouseCode').value;
          const payrollPeriod = document.getElementById('payrollPeriod').value;
          const applyFilter = document.getElementById('applyFilter').value;

          if (!payrollPeriod) {
            alert('Vui lòng chọn kỳ lương');
            return;
          }

          try {
            let url = window.API_BASE + '/payroll/bridge?payrollPeriod=' + payrollPeriod;
            if (warehouseCode) url += '&warehouseCode=' + warehouseCode;

            const res = await axios.get(url);
            payrollData = res.data.data || [];

            // Apply filter
            let filteredData = payrollData;
            if (applyFilter !== '') {
              const filterValue = applyFilter === 'true';
              filteredData = payrollData.filter(d => d.applied_to_payroll === filterValue);
            }

            // Update stats
            const totalBonus = payrollData.reduce((sum, d) => sum + (d.kpi_bonus || 0), 0);
            const applied = payrollData.filter(d => d.applied_to_payroll).length;
            const pending = payrollData.length - applied;

            document.getElementById('stat-total').textContent = payrollData.length;
            document.getElementById('stat-total-bonus').textContent = totalBonus.toLocaleString() + ' VND';
            document.getElementById('stat-applied').textContent = applied;
            document.getElementById('stat-pending').textContent = pending;

            // Render table
            renderTable(filteredData);

            // Warehouse summary
            renderWarehouseSummary(payrollData);

          } catch (error) {
            console.error('Error loading payroll data:', error);
            alert('Không thể tải dữ liệu: ' + error.message);
          }
        }

        function renderTable(data) {
          document.getElementById('payroll-data-body').innerHTML = data.map(d => \`
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-3">
                <input type="checkbox" class="row-checkbox rounded" data-staff-id="\${d.staff_id}" \${d.applied_to_payroll ? 'disabled' : ''} />
              </td>
              <td class="px-4 py-3 font-mono text-sm">\${d.warehouse_code}</td>
              <td class="px-4 py-3 font-medium">\${d.staff_id}</td>
              <td class="px-4 py-3">\${d.major_kpi?.toLocaleString() || 0}</td>
              <td class="px-4 py-3">\${d.rating_factor?.toFixed(2) || 0}</td>
              <td class="px-4 py-3 font-bold text-green-600">\${d.kpi_bonus?.toLocaleString() || 0}</td>
              <td class="px-4 py-3 text-red-600">\${d.penalty?.toLocaleString() || 0}</td>
              <td class="px-4 py-3 text-sm text-gray-500">\${d.calculation_version || 'v2.0'}</td>
              <td class="px-4 py-3 text-sm text-gray-500">\${d.calculated_at ? new Date(d.calculated_at).toLocaleString('vi-VN') : '-'}</td>
              <td class="px-4 py-3">
                \${d.applied_to_payroll 
                  ? '<span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Applied</span>'
                  : '<span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pending</span>'
                }
              </td>
            </tr>
          \`).join('') || '<tr><td colspan="10" class="px-4 py-8 text-center text-gray-500">Không có dữ liệu</td></tr>';
        }

        function renderWarehouseSummary(data) {
          const summary = {};
          data.forEach(d => {
            if (!summary[d.warehouse_code]) {
              summary[d.warehouse_code] = { count: 0, totalBonus: 0, applied: 0 };
            }
            summary[d.warehouse_code].count++;
            summary[d.warehouse_code].totalBonus += d.kpi_bonus || 0;
            if (d.applied_to_payroll) summary[d.warehouse_code].applied++;
          });

          document.getElementById('warehouse-summary').innerHTML = Object.entries(summary).map(([code, s]) => \`
            <div class="p-4 bg-gray-50 rounded-lg">
              <h4 class="font-medium text-gray-900 mb-2">\${code}</h4>
              <div class="text-sm space-y-1">
                <p><span class="text-gray-500">Nhân viên:</span> <span class="font-medium">\${s.count}</span></p>
                <p><span class="text-gray-500">Tổng bonus:</span> <span class="font-medium text-green-600">\${s.totalBonus.toLocaleString()}</span></p>
                <p><span class="text-gray-500">Đã apply:</span> <span class="font-medium">\${s.applied}/\${s.count}</span></p>
              </div>
            </div>
          \`).join('') || '<p class="text-gray-500 col-span-full text-center py-4">Không có dữ liệu</p>';
        }

        function toggleSelectAll() {
          const checked = document.getElementById('select-all-checkbox').checked;
          document.querySelectorAll('.row-checkbox:not(:disabled)').forEach(cb => cb.checked = checked);
        }

        function selectAll() {
          document.getElementById('select-all-checkbox').checked = true;
          document.querySelectorAll('.row-checkbox:not(:disabled)').forEach(cb => cb.checked = true);
        }

        function deselectAll() {
          document.getElementById('select-all-checkbox').checked = false;
          document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = false);
        }

        async function applySelected() {
          const warehouseCode = document.getElementById('warehouseCode').value;
          const payrollPeriod = document.getElementById('payrollPeriod').value;
          const selectedIds = [];

          document.querySelectorAll('.row-checkbox:checked').forEach(cb => {
            selectedIds.push(cb.dataset.staffId);
          });

          if (selectedIds.length === 0) {
            alert('Vui lòng chọn ít nhất một nhân viên');
            return;
          }

          if (!confirm('Bạn có chắc muốn apply ' + selectedIds.length + ' records vào payroll?')) {
            return;
          }

          try {
            const res = await axios.post(window.API_BASE + '/payroll/apply', {
              warehouseCode: warehouseCode || undefined,
              payrollPeriod,
              staffIds: selectedIds
            });

            alert('Đã apply ' + res.data.updated + ' records thành công!');
            loadPayrollData();
          } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
          }
        }

        function exportCSV() {
          if (payrollData.length === 0) {
            alert('Không có dữ liệu để export');
            return;
          }

          const headers = ['warehouse_code', 'payroll_period', 'staff_id', 'major_kpi', 'rating_factor', 'kpi_bonus', 'penalty', 'calculation_version', 'calculated_at', 'applied_to_payroll'];
          const csvContent = [
            headers.join(','),
            ...payrollData.map(d => headers.map(h => d[h] ?? '').join(','))
          ].join('\\n');

          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'payroll_kpi_' + document.getElementById('payrollPeriod').value + '.csv';
          link.click();
        }
      `}} />
    </Layout>
  )
}
