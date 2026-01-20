import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { WAREHOUSES } from '../types/database'

export const PayrollPage: FC = () => {
  const warehouses = Object.entries(WAREHOUSES)

  return (
    <Layout title="Payroll" activeTab="payroll">
      {/* Page Header */}
      <div class="mb-4">
        <p class="text-sm text-gray-500">Xem và áp dụng dữ liệu thưởng KPI cho kỳ lương.</p>
      </div>
      {/* Filter Section */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kho</label>
            <select
              id="warehouseCode"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px] focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả kho</option>
              {warehouses.map(([code, info]) => (
                <option value={code}>{code} – {info.name}</option>
              ))}
            </select>
            <p class="text-xs text-gray-400 mt-1">Để trống = tất cả kho</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kỳ lương *</label>
            <input
              type="month"
              id="payrollPeriod"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px] focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-xs text-gray-400 mt-1">Tháng tính thưởng KPI</p>
            <p id="error-period" class="text-xs text-red-500 mt-1 hidden">Vui lòng chọn kỳ lương.</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select id="applyFilter" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px] focus:ring-2 focus:ring-blue-500">
              <option value="">Tất cả</option>
              <option value="false">Chưa áp dụng</option>
              <option value="true">Đã áp dụng</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              id="btn-load-payroll"
              onclick="loadPayrollData()"
              class="w-full bg-blue-600 text-white px-4 py-2.5 min-h-[44px] rounded-lg font-medium hover:bg-blue-700"
            >
              <i class="fas fa-download mr-2"></i>
              Tải dữ liệu
            </button>
          </div>
        </div>
        <p id="error-general" class="text-sm text-red-500 mt-3 p-3 bg-red-50 rounded-lg hidden"></p>
      </div>

      {/* Stats Overview */}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-xs md:text-sm font-medium text-gray-500">Tổng nhân viên</p>
              <p class="text-2xl md:text-3xl font-bold text-gray-900 mt-1" id="stat-total">--</p>
              <p class="text-xs text-gray-400 mt-1 hidden md:block">Có dữ liệu thưởng KPI</p>
            </div>
            <div class="bg-blue-500 p-3 md:p-4 rounded-xl flex-shrink-0">
              <i class="fas fa-users text-white text-lg md:text-2xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-xs md:text-sm font-medium text-gray-500">Tổng thưởng KPI</p>
              <p class="text-lg md:text-2xl font-bold text-green-600 mt-1" id="stat-total-bonus">--</p>
              <p class="text-xs text-gray-400 mt-1 hidden md:block">Toàn bộ kho/bộ lọc</p>
            </div>
            <div class="bg-green-500 p-3 md:p-4 rounded-xl flex-shrink-0">
              <i class="fas fa-money-bill-wave text-white text-lg md:text-2xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-xs md:text-sm font-medium text-gray-500">Đã áp dụng</p>
              <p class="text-2xl md:text-3xl font-bold text-purple-600 mt-1" id="stat-applied">--</p>
              <p class="text-xs text-gray-400 mt-1 hidden md:block">Vào bảng lương</p>
            </div>
            <div class="bg-purple-500 p-3 md:p-4 rounded-xl flex-shrink-0">
              <i class="fas fa-check-double text-white text-lg md:text-2xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-xs md:text-sm font-medium text-gray-500">Chưa áp dụng</p>
              <p class="text-2xl md:text-3xl font-bold text-orange-600 mt-1" id="stat-pending">--</p>
              <p class="text-xs text-gray-400 mt-1 hidden md:block">Cần xử lý</p>
            </div>
            <div class="bg-orange-500 p-3 md:p-4 rounded-xl flex-shrink-0">
              <i class="fas fa-clock text-white text-lg md:text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 mb-4">
        <div class="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between">
          <div class="flex flex-wrap gap-2">
            <button onclick="selectAll()" class="flex-1 md:flex-none bg-gray-100 text-gray-700 px-3 py-2 min-h-[44px] rounded-lg hover:bg-gray-200 text-sm">
              <i class="fas fa-check-square mr-1"></i>Chọn tất cả
            </button>
            <button onclick="deselectAll()" class="flex-1 md:flex-none bg-gray-100 text-gray-700 px-3 py-2 min-h-[44px] rounded-lg hover:bg-gray-200 text-sm">
              <i class="fas fa-square mr-1"></i>Bỏ chọn
            </button>
            <button onclick="exportCSV()" class="flex-1 md:flex-none bg-gray-100 text-gray-700 px-3 py-2 min-h-[44px] rounded-lg hover:bg-gray-200 text-sm">
              <i class="fas fa-download mr-1"></i>Xuất file CSV
            </button>
          </div>
          <div>
            <button id="btn-apply" onclick="applySelected()" class="w-full md:w-auto bg-green-600 text-white px-4 py-2.5 min-h-[44px] rounded-lg hover:bg-green-700 font-medium">
              <i class="fas fa-check mr-2"></i>Áp dụng vào bảng lương
            </button>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-2 hidden md:block">Chỉ áp dụng cho các nhân viên bạn đã chọn.</p>
      </div>

      {/* Data Table - Desktop */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hidden md:block">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[800px]">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-3 text-left">
                  <input type="checkbox" id="select-all-checkbox" onchange="toggleSelectAll()" class="rounded" />
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kho</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã NV</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm KPI</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hệ số</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thưởng KPI</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiền trừ</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phiên bản</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tính lúc</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody id="payroll-data-body" class="divide-y divide-gray-200">
              <tr><td colspan={10} class="px-4 py-8 text-center text-gray-500">Chọn kỳ lương rồi bấm "Tải dữ liệu"</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Cards - Mobile */}
      <div id="payroll-cards-mobile" class="md:hidden space-y-3">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-gray-500">
          Chọn kỳ lương rồi bấm "Tải dữ liệu"
        </div>
      </div>

      {/* Summary by Warehouse */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mt-4">
        <h3 class="text-base md:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i class="fas fa-chart-bar text-blue-600"></i>
          Tổng hợp thưởng KPI theo kho
        </h3>
        <div id="warehouse-summary" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          <p class="text-gray-500 col-span-full text-center py-4 text-sm">Chọn kỳ lương và tải dữ liệu để xem tổng hợp.</p>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
        // Using window.window.API_BASE from Layout;
        let payrollData = [];

        // Set default period to current month
        const now = new Date();
        document.getElementById('payrollPeriod').value = now.toISOString().slice(0, 7);

        async function loadPayrollData() {
          // Clear previous errors
          document.getElementById('error-period')?.classList.add('hidden');
          document.getElementById('error-general')?.classList.add('hidden');
          
          const warehouseCode = document.getElementById('warehouseCode').value;
          const payrollPeriod = document.getElementById('payrollPeriod').value;
          const applyFilter = document.getElementById('applyFilter').value;

          if (!payrollPeriod) {
            document.getElementById('error-period').classList.remove('hidden');
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

            // Render table and mobile cards
            renderTable(filteredData);
            renderMobileCards(filteredData);

            // Warehouse summary
            renderWarehouseSummary(payrollData);

          } catch (error) {
            console.error('Error loading payroll data:', error);
            const errorEl = document.getElementById('error-general');
            errorEl.textContent = 'Không tải được dữ liệu Payroll. Vui lòng kiểm tra kết nối hoặc thử lại.';
            errorEl.classList.remove('hidden');
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
                  ? '<span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">Đã áp dụng</span>'
                  : '<span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">Chưa áp dụng</span>'
                }
              </td>
            </tr>
          \`).join('') || '<tr><td colspan="10" class="px-4 py-8 text-center text-gray-500">Không tìm thấy dữ liệu thưởng KPI cho kỳ lương và bộ lọc bạn đã chọn.</td></tr>';
        }

        function renderMobileCards(data) {
          document.getElementById('payroll-cards-mobile').innerHTML = data.map(d => \`
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                  <input type="checkbox" class="row-checkbox rounded w-5 h-5" data-staff-id="\${d.staff_id}" \${d.applied_to_payroll ? 'disabled' : ''} />
                  <div>
                    <p class="font-bold text-gray-900">\${d.staff_id}</p>
                    <p class="text-xs text-gray-500">\${d.warehouse_code}</p>
                  </div>
                </div>
                \${d.applied_to_payroll 
                  ? '<span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">Đã áp dụng</span>'
                  : '<span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">Chưa áp dụng</span>'
                }
              </div>
              <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div><span class="text-gray-500">Điểm KPI:</span> <span class="font-medium">\${d.major_kpi?.toLocaleString() || 0}</span></div>
                <div><span class="text-gray-500">Hệ số:</span> <span class="font-medium">\${d.rating_factor?.toFixed(2) || 0}</span></div>
                <div><span class="text-gray-500">Thưởng:</span> <span class="font-bold text-green-600">\${d.kpi_bonus?.toLocaleString() || 0}</span></div>
                <div><span class="text-gray-500">Trừ:</span> <span class="text-red-600">\${d.penalty?.toLocaleString() || 0}</span></div>
              </div>
              <p class="text-xs text-gray-400 mt-2">Tính lúc: \${d.calculated_at ? new Date(d.calculated_at).toLocaleString('vi-VN') : '-'}</p>
            </div>
          \`).join('') || '<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-gray-500">Không tìm thấy dữ liệu.</div>';
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
            <div class="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 class="font-bold text-gray-900 mb-2 text-sm">\${code}</h4>
              <div class="text-xs md:text-sm space-y-1">
                <p><span class="text-gray-500">Nhân viên:</span> <span class="font-medium">\${s.count}</span></p>
                <p><span class="text-gray-500">Tổng thưởng:</span> <span class="font-bold text-green-600">\${s.totalBonus.toLocaleString()}</span></p>
                <p><span class="text-gray-500">Đã áp dụng:</span> <span class="font-medium">\${s.applied}/\${s.count}</span></p>
              </div>
            </div>
          \`).join('') || '<p class="text-gray-500 col-span-full text-center py-4 text-sm">Không có dữ liệu</p>';
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
            const errorEl = document.getElementById('error-general');
            errorEl.textContent = 'Bạn chưa chọn nhân viên nào. Vui lòng chọn trước khi áp dụng.';
            errorEl.className = 'text-sm text-red-500 mt-3 p-3 bg-red-50 rounded-lg';
            errorEl.classList.remove('hidden');
            return;
          }

          const periodDisplay = payrollPeriod.split('-').reverse().join('/');
          if (!confirm('Bạn chuẩn bị áp dụng thưởng KPI cho ' + selectedIds.length + ' nhân viên trong kỳ lương ' + periodDisplay + '.\n\nThao tác này sẽ cập nhật dữ liệu vào hệ thống lương. Bạn chắc chứ?')) {
            return;
          }

          try {
            const btn = document.getElementById('btn-apply');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Đang áp dụng...';
            
            const res = await axios.post(window.API_BASE + '/payroll/apply', {
              warehouseCode: warehouseCode || undefined,
              payrollPeriod,
              staffIds: selectedIds
            });

            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-check mr-2"></i>Áp dụng vào bảng lương';
            
            // Show success message
            const errorEl = document.getElementById('error-general');
            errorEl.textContent = 'Đã áp dụng thưởng KPI cho ' + res.data.updated + ' nhân viên thành công!';
            errorEl.className = 'text-sm text-green-600 mt-3 p-3 bg-green-50 rounded-lg';
            errorEl.classList.remove('hidden');
            
            loadPayrollData();
          } catch (error) {
            const btn = document.getElementById('btn-apply');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-check mr-2"></i>Áp dụng vào bảng lương';
            
            const errorEl = document.getElementById('error-general');
            errorEl.textContent = 'Lỗi: ' + (error.response?.data?.error || error.message);
            errorEl.className = 'text-sm text-red-500 mt-3 p-3 bg-red-50 rounded-lg';
            errorEl.classList.remove('hidden');
          }
        }

        function exportCSV() {
          if (payrollData.length === 0) {
            const errorEl = document.getElementById('error-general');
            errorEl.textContent = 'Không có dữ liệu để xuất. Vui lòng tải dữ liệu trước.';
            errorEl.className = 'text-sm text-red-500 mt-3 p-3 bg-red-50 rounded-lg';
            errorEl.classList.remove('hidden');
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
