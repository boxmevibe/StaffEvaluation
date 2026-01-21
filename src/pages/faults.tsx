import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { WAREHOUSES } from '../types/database'

export const FaultsPage: FC = () => {
    const warehouses = Object.entries(WAREHOUSES)

    return (
        <Layout title="Quản lý Sự cố Vận hành (ORS)" activeTab="faults">
            <div class="mb-4">
                <p class="text-sm text-gray-500">Ghi nhận và quản lý các sự cố vận hành (ORS) của nhân viên.</p>
            </div>

            {/* Styles for Autocomplete */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .autocomplete-wrapper { position: relative; }
                .autocomplete-suggestions {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 100;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    display: none;
                }
                .autocomplete-suggestions.show { display: block; }
                .autocomplete-item {
                    padding: 0.5rem 0.75rem;
                    cursor: pointer;
                    font-size: 0.875rem;
                }
                .autocomplete-item:hover { background-color: #f3f4f6; }
                .autocomplete-item strong { display: block; color: #111827; }
                .autocomplete-item span { color: #6b7280; font-size: 0.75rem; }
                
                 /* Bottom Sheet Styles */
                .bottom-sheet-overlay {
                    position: fixed;
                    inset: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 40;
                    transition: opacity 0.3s;
                    opacity: 0;
                    pointer-events: none;
                }
                .bottom-sheet-overlay.open {
                    opacity: 1;
                    pointer-events: auto;
                }
                .bottom-sheet {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: white;
                    border-top-left-radius: 1rem;
                    border-top-right-radius: 1rem;
                    box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
                    z-index: 50;
                    transform: translateY(100%);
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    max-height: 90vh;
                    overflow-y: auto;
                }
                 /* Desktop: Slide-over from right */
                @media (min-width: 768px) {
                    .bottom-sheet {
                        bottom: 0;
                        right: 0;
                        left: auto;
                        top: 0;
                        width: 500px;
                        height: 100vh;
                        max-height: 100vh;
                        border-radius: 0;
                        border-top-left-radius: 1rem;
                        border-bottom-left-radius: 1rem;
                        transform: translateX(100%);
                    }
                }
                .bottom-sheet.open {
                    transform: translateY(0);
                }
                @media (min-width: 768px) {
                    .bottom-sheet.open {
                        transform: translateX(0);
                    }
                }
            `}} />

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
                        <label class="block text-sm font-medium text-gray-700 mb-1">Kỳ lương</label>
                        <input
                            type="month"
                            id="payrollPeriod"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px] focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div class="flex items-end">
                        <button
                            onclick="loadFaultsData()"
                            class="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 min-h-[44px]"
                        >
                            <i class="fas fa-sync-alt mr-2"></i>
                            Tải dữ liệu
                        </button>
                        <button
                            onclick="toggleCreateSheet(true)"
                            class="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-green-700 min-h-[44px] ml-2"
                        >
                            <i class="fas fa-plus mr-2"></i>
                            Ghi nhận
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* ORS Alerts */}
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                    <h3 class="text-base md:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i class="fas fa-bell text-red-600"></i>
                        Theo dõi điểm ORS
                        <span class="text-xs font-normal text-gray-500">(≥10 điểm/tháng)</span>
                    </h3>
                    <div id="ors-alerts-list" class="space-y-2 md:space-y-3 max-h-72 md:max-h-80 overflow-y-auto">
                        <p class="text-gray-500 text-center py-4">Chọn kho và kỳ lương để xem cảnh báo.</p>
                    </div>
                </div>

                {/* Pending Review */}
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                    <h3 class="text-base md:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i class="fas fa-clipboard-check text-orange-600"></i>
                        Sự cố chờ xác nhận
                        <span id="pending-count" class="ml-2 bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-sm">0</span>
                    </h3>
                    <div id="pending-ors-list" class="space-y-2 md:space-y-3 max-h-72 md:max-h-80 overflow-y-auto">
                        <p class="text-gray-500 text-center py-4">Hiện không có lỗi ORS nào chờ duyệt.</p>
                    </div>
                </div>
            </div>

            {/* ORS Events Full List Table */}
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
                <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                    <h3 class="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                        <i class="fas fa-list text-blue-600"></i>
                        Danh sách Sự cố ORS
                        <span id="ors-list-count" class="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-sm">0</span>
                    </h3>
                    <div class="flex flex-wrap gap-2">
                        <select
                            id="filter-status"
                            onchange="loadOrsList()"
                            class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="OPEN">🟡 OPEN</option>
                            <option value="CONFIRMED">✅ CONFIRMED</option>
                            <option value="REJECTED">❌ REJECTED</option>
                        </select>
                        <select
                            id="filter-ors-code"
                            onchange="loadOrsList()"
                            class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả loại lỗi</option>
                        </select>
                        <div class="relative">
                            <input
                                type="text"
                                id="search-query"
                                placeholder="Tìm kiếm..."
                                onkeyup="debounceSearch()"
                                class="border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-40 md:w-48"
                            />
                            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>
                </div>

                {/* Responsive Table */}
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-gray-50 text-left">
                            <tr>
                                <th class="px-3 py-2 font-medium text-gray-600">Mã NV</th>
                                <th class="px-3 py-2 font-medium text-gray-600">Tên</th>
                                <th class="px-3 py-2 font-medium text-gray-600">Ngày</th>
                                <th class="px-3 py-2 font-medium text-gray-600">Loại lỗi</th>
                                <th class="px-3 py-2 font-medium text-gray-600 text-center">Điểm</th>
                                <th class="px-3 py-2 font-medium text-gray-600">Trạng thái</th>
                                <th class="px-3 py-2 font-medium text-gray-600 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody id="ors-list-tbody" class="divide-y divide-gray-100">
                            <tr>
                                <td colspan="7" class="px-3 py-8 text-center text-gray-500">
                                    Chọn kho và click "Tải dữ liệu" để xem danh sách.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div class="flex justify-between items-center mt-4 text-sm text-gray-600">
                    <span id="ors-pagination-info">Đang hiển thị 0 / 0 kết quả</span>
                    <div class="flex gap-2">
                        <button onclick="loadOrsList('prev')" id="btn-prev-page" disabled class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button onclick="loadOrsList('next')" id="btn-next-page" disabled class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Bottom Sheet */}
            <div id="edit-bottom-sheet-overlay" class="bottom-sheet-overlay" onclick="toggleEditSheet(false)"></div>
            <div id="edit-bottom-sheet" class="bottom-sheet">
                <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl md:rounded-tl-xl md:rounded-tr-none">
                    <h3 class="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <i class="fas fa-edit text-blue-600"></i>
                        Chỉnh sửa sự cố
                    </h3>
                    <button onclick="toggleEditSheet(false)" class="text-gray-500 hover:text-gray-700 p-2">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>

                <div class="p-4 md:p-6 overflow-y-auto pb-24">
                    <form id="edit-ors-form" class="space-y-4">
                        <input type="hidden" id="edit-ors-id" />
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nhân viên</label>
                            <input type="text" id="edit-staff-display" disabled class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-gray-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Ngày ghi nhận</label>
                            <input type="date" id="edit-event-date" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Loại lỗi ORS</label>
                            <select id="edit-ors-code" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]">
                                <option value="">Chọn loại lỗi...</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                            <textarea id="edit-description" rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2.5"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái hiện tại</label>
                            <span id="edit-status-badge" class="inline-flex px-3 py-1 rounded-full text-sm font-medium">OPEN</span>
                        </div>

                        <div class="pt-4 sticky bottom-0 bg-white pb-4 border-t mt-4 flex gap-2">
                            <button type="submit" class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 flex justify-center items-center gap-2">
                                <i class="fas fa-save"></i>
                                Lưu thay đổi
                            </button>
                            <button type="button" onclick="toggleEditSheet(false)" class="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50">
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Bottom Sheet */}
            <div id="bottom-sheet-overlay" class="bottom-sheet-overlay" onclick="toggleCreateSheet(false)"></div>
            <div id="create-bottom-sheet" class="bottom-sheet">
                <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl md:rounded-tl-xl md:rounded-tr-none">
                    <h3 class="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <i class="fas fa-plus-circle text-green-600"></i>
                        Ghi nhận sự cố
                    </h3>
                    <button onclick="toggleCreateSheet(false)" class="text-gray-500 hover:text-gray-700 p-2">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>

                <div class="p-4 md:p-6 overflow-y-auto pb-24">
                    <p class="text-sm text-gray-500 mb-4">Nhập thông tin sự cố để ghi nhận vào hệ thống.</p>
                    <form id="create-ors-form" class="space-y-4">
                        <div class="autocomplete-wrapper">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nhân viên liên quan *</label>
                            <input type="text" id="ors-staff-search" required class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]" placeholder="Nhập tên hoặc mã NV" autocomplete="off" />
                            <input type="hidden" id="ors-staff-id" />
                            <input type="hidden" id="ors-staff-name" />
                            <div id="staff-suggestions" class="autocomplete-suggestions"></div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Mã NV</label>
                            <input type="text" id="ors-staff-id-display" disabled class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px] text-gray-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Ngày ghi nhận *</label>
                            <input type="date" id="ors-event-date" required class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Loại lỗi ORS *</label>
                            <select id="ors-code" required class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]">
                                <option value="">Chọn loại lỗi...</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                            <input type="text" id="ors-description" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]" placeholder="Ca nào, lỗi gì, ở đâu..." />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Người báo cáo *</label>
                            <div class="autocomplete-wrapper">
                                <input type="text" id="ors-reported-by-search" required class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]" placeholder="Tên hoặc mã NV" autocomplete="off" />
                                <div id="reporter-suggestions" class="autocomplete-suggestions"></div>
                            </div>
                        </div>

                        {/* Sticky Footer */}
                        <div class="pt-6 md:pt-4 sticky bottom-0 bg-white md:bg-transparent pb-4 md:pb-0 border-t md:border-t-0 mt-4 md:mt-0">
                            <button type="submit" class="w-full bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 shadow-md flex justify-center items-center gap-2 text-lg">
                                <i class="fas fa-plus"></i>
                                Ghi nhận
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <script dangerouslySetInnerHTML={{
                __html: `
        // Using window.API_BASE from Layout
        let orsCatalog = [];
        
        function toggleCreateSheet(open) {
            const warehouseCode = document.getElementById('warehouseCode').value;
             if (open && !warehouseCode) {
                 alert('Vui lòng chọn Warehouse trước khi tạo phiếu!');
                 // Focus if possible
                 const select = document.getElementById('warehouseCode');
                 if(select) {
                     select.focus();
                     select.classList.add('ring-2', 'ring-red-500');
                     setTimeout(() => select.classList.remove('ring-2', 'ring-red-500'), 2000);
                 }
                 return;
             }

            const overlay = document.getElementById('bottom-sheet-overlay');
            const sheet = document.getElementById('create-bottom-sheet');
            if (open) {
                overlay.classList.remove('hidden');
                requestAnimationFrame(() => {
                    overlay.classList.add('open');
                    sheet.classList.add('open');
                });
            } else {
                overlay.classList.remove('open');
                sheet.classList.remove('open');
                setTimeout(() => {
                   if(!overlay.classList.contains('open')) overlay.classList.add('hidden');
                }, 300);
            }
        }

        // Set default dates
        const now = new Date();
        document.getElementById('payrollPeriod').value = now.toISOString().slice(0, 7);
        document.getElementById('ors-event-date').value = now.toISOString().slice(0, 10);

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
        document.addEventListener('DOMContentLoaded', () => {
          loadOrsCatalog();
        });

        async function loadFaultsData() {
          const warehouseCode = document.getElementById('warehouseCode').value;
          const payrollPeriod = document.getElementById('payrollPeriod').value;
          
          if (!warehouseCode) {
            alert('Vui lòng chọn Warehouse');
            return;
          }

          try {
            // Load ORS alerts
            const alertRes = await axios.get(window.API_BASE + '/manager/ors/alerts?warehouseCode=' + warehouseCode + '&payrollPeriod=' + payrollPeriod);
            const alerts = alertRes.data.data || [];
            
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
                    <a href="/employee?staffId=\${a.staff_id}&warehouseCode=\${warehouseCode}" target="_blank" class="font-medium text-gray-900 hover:text-blue-600 hover:underline">
                      \${a.staff_name || a.staff_id}
                    </a>
                    <p class="text-sm text-gray-500">ID: \${a.staff_id}</p>
                  </div>
                  <div class="text-right">
                    <span class="text-lg font-bold text-red-600">\${a.ors_points_total} pts</span>
                    <span class="\${milestoneColors[a.milestone_level]} px-2 py-0.5 rounded-full text-xs ml-2">\${a.milestone_level}</span>
                  </div>
                </div>
              </div>
            \`).join('') || '<p class="text-gray-500 text-center py-4">Không có cảnh báo (dưới 10 điểm)</p>';

            // Load pending ORS
            const pendingRes = await axios.get(window.API_BASE + '/manager/ors/pending?warehouseCode=' + warehouseCode);
            const pending = pendingRes.data.data || [];
            document.getElementById('pending-count').textContent = pending.length;
            
            document.getElementById('pending-ors-list').innerHTML = pending.map(p => \`
              <div class="p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <a href="/employee?staffId=\${p.staff_id}&warehouseCode=\${warehouseCode}" target="_blank" class="font-medium text-gray-900 hover:text-blue-600 hover:underline">
                      \${p.staff_name || p.staff_id}
                    </a>
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
            console.error('Error loading faults data:', error);
            alert('Không thể tải dữ liệu: ' + error.message);
          }
        }

        window.reviewOrs = async function(eventId, status) {
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
            alert('Đã cập nhật!');
            loadFaultsData();
          } catch (error) {
            alert('Lỗi: ' + error.message);
          }
        }

        // Create ORS Form Submit
        document.getElementById('create-ors-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const warehouseCode = document.getElementById('warehouseCode').value;
          if (!warehouseCode) {
            alert('Vui lòng chọn Warehouse trước');
            return;
          }

          const staffId = document.getElementById('ors-staff-id').value;
          const reportedBy = document.getElementById('ors-reported-by-search').value;

          if (!staffId) { alert('Vui lòng chọn Nhân viên vi phạm từ gợi ý'); return; }

          const data = {
            warehouse_code: warehouseCode,
            staff_id: staffId,
            staff_name: document.getElementById('ors-staff-name').value || null,
            event_date: document.getElementById('ors-event-date').value,
            ors_code: document.getElementById('ors-code').value,
            description: document.getElementById('ors-description').value || null,
            reported_by: reportedBy
          };

          try {
            await axios.post(window.API_BASE + '/manager/ors/create', data);
            alert('Đã ghi nhận lỗi thành công');
            document.getElementById('create-ors-form').reset();
            
            // Reset hidden inputs
            document.getElementById('ors-staff-id').value = '';
            document.getElementById('ors-staff-name').value = '';
            document.getElementById('ors-staff-id-display').value = '';

            document.getElementById('ors-event-date').value = new Date().toISOString().slice(0, 10);
            toggleCreateSheet(false);
            loadFaultsData();
          } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
          }
        });

        // ==================== AUTOCOMPLETE LOGIC ====================
        class Autocomplete {
            constructor(inputId, suggestionsId, onSelect, onSearch) {
                this.input = document.getElementById(inputId);
                
                // Move suggestions to body
                const existing = document.getElementById(suggestionsId);
                 if (existing) {
                    this.suggestions = existing;
                    if (this.suggestions.parentNode !== document.body) {
                        document.body.appendChild(this.suggestions);
                    }
                } else {
                    this.suggestions = document.createElement('div');
                    this.suggestions.id = suggestionsId;
                    this.suggestions.className = 'autocomplete-suggestions';
                    document.body.appendChild(this.suggestions);
                }

                this.onSelect = onSelect;
                this.onSearch = onSearch;
                this.debounceTimer = null;
                
                this.init();
            }

            init() {
                this.input.addEventListener('input', () => {
                    clearTimeout(this.debounceTimer);
                    const query = this.input.value.trim();
                    if (query.length < 1) {
                        this.hideSuggestions();
                        return;
                    }
                    this.debounceTimer = setTimeout(() => this.search(query), 300);
                });

                document.addEventListener('click', (e) => {
                    if (!this.input.contains(e.target) && !this.suggestions.contains(e.target)) {
                        this.hideSuggestions();
                    }
                });
                
                // Hide on scroll/resize
                window.addEventListener('scroll', () => this.hideSuggestions(), true);
                window.addEventListener('resize', () => this.hideSuggestions());
            }

            async search(query) {
                const items = await this.onSearch(query);
                this.render(items);
            }

            render(items) {
                if (!items || items.length === 0) {
                    this.hideSuggestions();
                    return;
                }
                
                this.suggestions.innerHTML = items.map((item, index) => \`
                    <div class="autocomplete-item" data-index="\${index}">
                        \${item.html}
                    </div>
                \`).join('');
                
                this.suggestions.querySelectorAll('.autocomplete-item').forEach(div => {
                    div.addEventListener('click', () => {
                        const index = div.dataset.index;
                        this.select(items[index]);
                    });
                });
                
                // Position Fixed calculation
                const rect = this.input.getBoundingClientRect();
                this.suggestions.style.position = 'fixed';
                this.suggestions.style.top = rect.bottom + 'px';
                this.suggestions.style.left = rect.left + 'px';
                this.suggestions.style.width = rect.width + 'px';
                this.suggestions.style.zIndex = '9999';
                this.suggestions.style.maxHeight = '250px';
                this.suggestions.style.backgroundColor = 'white';
                this.suggestions.style.border = '1px solid #ddd';
                this.suggestions.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                 this.suggestions.style.overflowY = 'auto';
                
                this.suggestions.classList.add('show');
                this.suggestions.style.display = 'block';
            }

            select(item) {
                this.input.value = item.displayText; // Update input with display text
                this.onSelect(item.data);
                this.hideSuggestions();
            }

            hideSuggestions() {
                this.suggestions.classList.remove('show');
                this.suggestions.style.display = 'none';
            }
        }

        // Initialize Autocompletes
        document.addEventListener('DOMContentLoaded', () => {
            // Staff Autocomplete
            new Autocomplete('ors-staff-search', 'staff-suggestions', 
                (data) => {
                    document.getElementById('ors-staff-id').value = data.staff_id;
                    document.getElementById('ors-staff-name').value = data.staff_name;
                    document.getElementById('ors-staff-id-display').value = data.staff_id;
                },
                async (query) => {
                    const warehouseCode = document.getElementById('warehouseCode').value;
                    if (!warehouseCode) return [];
                    try {
                        const res = await axios.get(window.API_BASE + \`/staff/search?warehouseCode=\${warehouseCode}&q=\${encodeURIComponent(query)}\`);
                        return res.data.data.map(s => ({
                            displayText: s.staff_name || s.staff_id,
                            html: \`<strong>\${s.staff_name || 'N/A'}</strong><span>\${s.staff_id} - \${s.role_name || 'N/A'}</span>\`,
                            data: s
                        }));
                    } catch (e) { return []; }
                }
            );

            // Reporter Autocomplete
            new Autocomplete('ors-reported-by-search', 'reporter-suggestions',
                (data) => {},
                async (query) => {
                    const warehouseCode = document.getElementById('warehouseCode').value;
                    if (!warehouseCode) return [];
                    try {
                        const res = await axios.get(window.API_BASE + \`/staff/search?warehouseCode=\${warehouseCode}&q=\${encodeURIComponent(query)}\`);
                         return res.data.data.map(s => ({
                            displayText: s.staff_name || s.staff_id,
                            html: \`<strong>\${s.staff_name || 'N/A'}</strong><span>\${s.role_name || 'User'}</span>\`,
                            data: s
                        }));
                    } catch (e) { return []; }
                }
            );
        });
        
        // ==================== ORS LIST & CRUD FUNCTIONS ====================
        let currentOffset = 0;
        const pageLimit = 15;
        let totalOrsEvents = 0;
        let searchDebounceTimer = null;

        function debounceSearch() {
            clearTimeout(searchDebounceTimer);
            searchDebounceTimer = setTimeout(() => loadOrsList(), 400);
        }

        async function loadOrsList(direction) {
            const warehouseCode = document.getElementById('warehouseCode').value;
            const payrollPeriod = document.getElementById('payrollPeriod').value;
            
            if (!warehouseCode) {
                return;
            }

            // Handle pagination
            if (direction === 'next') {
                currentOffset += pageLimit;
            } else if (direction === 'prev') {
                currentOffset = Math.max(0, currentOffset - pageLimit);
            } else {
                currentOffset = 0; // Reset on filter change
            }

            const status = document.getElementById('filter-status').value;
            const orsCode = document.getElementById('filter-ors-code').value;
            const q = document.getElementById('search-query').value;

            try {
                const params = new URLSearchParams({
                    warehouseCode,
                    payrollPeriod,
                    limit: pageLimit,
                    offset: currentOffset
                });
                if (status) params.append('status', status);
                if (orsCode) params.append('orsCode', orsCode);
                if (q) params.append('q', q);

                const res = await axios.get(window.API_BASE + '/manager/ors/list?' + params.toString());
                const events = res.data.data || [];
                totalOrsEvents = res.data.pagination?.total || events.length;

                document.getElementById('ors-list-count').textContent = totalOrsEvents;

                const statusBadges = {
                    OPEN: 'bg-yellow-100 text-yellow-800',
                    CONFIRMED: 'bg-green-100 text-green-800',
                    REJECTED: 'bg-red-100 text-red-800'
                };

                const tbody = document.getElementById('ors-list-tbody');
                if (events.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="7" class="px-3 py-8 text-center text-gray-500">Không tìm thấy sự cố nào.</td></tr>';
                } else {
                    tbody.innerHTML = events.map(e => \`
                        <tr class="hover:bg-gray-50">
                            <td class="px-3 py-2">
                                <a href="/employee?staffId=\${e.staff_id}&warehouseCode=\${warehouseCode}" target="_blank" class="text-blue-600 hover:underline font-medium">\${e.staff_id}</a>
                            </td>
                            <td class="px-3 py-2 text-gray-700">\${e.staff_name || '-'}</td>
                            <td class="px-3 py-2 text-gray-600">\${e.event_date}</td>
                            <td class="px-3 py-2">
                                <span class="font-medium text-gray-900">\${e.ors_code}</span>
                                <p class="text-xs text-gray-500 truncate max-w-[150px]">\${e.ors_name || e.description || ''}</p>
                            </td>
                            <td class="px-3 py-2 text-center">
                                <span class="font-bold text-red-600">\${e.ors_points}</span>
                            </td>
                            <td class="px-3 py-2">
                                <span class="\${statusBadges[e.status]} px-2 py-0.5 rounded-full text-xs font-medium">\${e.status}</span>
                            </td>
                            <td class="px-3 py-2 text-center">
                                <div class="flex justify-center gap-1">
                                    <button onclick='openEditSheet(\${JSON.stringify(e).replace(/'/g, "\\\\'")})' class="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Chỉnh sửa">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    \${e.status === 'OPEN' ? \`
                                        <button onclick="deleteOrs(\${e.id})" class="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Xóa">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    \` : ''}
                                </div>
                            </td>
                        </tr>
                    \`).join('');
                }

                // Update pagination info
                const start = totalOrsEvents > 0 ? currentOffset + 1 : 0;
                const end = Math.min(currentOffset + events.length, totalOrsEvents);
                document.getElementById('ors-pagination-info').textContent = \`Đang hiển thị \${start} - \${end} / \${totalOrsEvents} kết quả\`;

                // Enable/disable pagination buttons
                document.getElementById('btn-prev-page').disabled = currentOffset === 0;
                document.getElementById('btn-next-page').disabled = currentOffset + pageLimit >= totalOrsEvents;

            } catch (error) {
                console.error('Error loading ORS list:', error);
            }
        }

        // Populate ORS code filter dropdown
        function populateOrsCodeFilter() {
            const select = document.getElementById('filter-ors-code');
            if (orsCatalog.length === 0) return;
            
            select.innerHTML = '<option value="">Tất cả loại lỗi</option>' + 
                orsCatalog.map(item => \`<option value="\${item.ors_code}">\${item.ors_code} - \${item.name}</option>\`).join('');
        }

        // Edit Sheet
        function toggleEditSheet(open) {
            const overlay = document.getElementById('edit-bottom-sheet-overlay');
            const sheet = document.getElementById('edit-bottom-sheet');
            if (open) {
                overlay.classList.remove('hidden');
                requestAnimationFrame(() => {
                    overlay.classList.add('open');
                    sheet.classList.add('open');
                });
            } else {
                overlay.classList.remove('open');
                sheet.classList.remove('open');
                setTimeout(() => {
                    if(!overlay.classList.contains('open')) overlay.classList.add('hidden');
                }, 300);
            }
        }

        function openEditSheet(eventData) {
            document.getElementById('edit-ors-id').value = eventData.id;
            document.getElementById('edit-staff-display').value = eventData.staff_name + ' (' + eventData.staff_id + ')';
            document.getElementById('edit-event-date').value = eventData.event_date;
            document.getElementById('edit-description').value = eventData.description || '';
            
            // Populate edit ORS code select
            const editSelect = document.getElementById('edit-ors-code');
            editSelect.innerHTML = '<option value="">Chọn loại lỗi...</option>' + 
                orsCatalog.map(item => \`<option value="\${item.ors_code}" \${item.ors_code === eventData.ors_code ? 'selected' : ''}>\${item.ors_code} - \${item.name}</option>\`).join('');
            
            // Status badge
            const statusBadges = {
                OPEN: 'bg-yellow-100 text-yellow-800',
                CONFIRMED: 'bg-green-100 text-green-800',
                REJECTED: 'bg-red-100 text-red-800'
            };
            const badge = document.getElementById('edit-status-badge');
            badge.textContent = eventData.status;
            badge.className = 'inline-flex px-3 py-1 rounded-full text-sm font-medium ' + (statusBadges[eventData.status] || '');
            
            toggleEditSheet(true);
        }

        // Edit form submit
        document.getElementById('edit-ors-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const eventId = document.getElementById('edit-ors-id').value;
            const data = {
                event_date: document.getElementById('edit-event-date').value,
                ors_code: document.getElementById('edit-ors-code').value,
                description: document.getElementById('edit-description').value
            };

            try {
                await axios.put(window.API_BASE + '/manager/ors/' + eventId + '/update', data);
                alert('Đã cập nhật sự cố thành công!');
                toggleEditSheet(false);
                loadOrsList();
                loadFaultsData();
            } catch (error) {
                alert('Lỗi: ' + (error.response?.data?.error || error.message));
            }
        });

        // Delete ORS event
        window.deleteOrs = async function(eventId) {
            if (!confirm('Bạn có chắc chắn muốn xóa sự cố #' + eventId + '?\\nHành động này không thể hoàn tác.')) {
                return;
            }

            try {
                await axios.delete(window.API_BASE + '/manager/ors/' + eventId + '/delete');
                alert('Đã xóa sự cố thành công!');
                loadOrsList();
                loadFaultsData();
            } catch (error) {
                alert('Lỗi: ' + (error.response?.data?.error || error.message));
            }
        }

        // Extended loadFaultsData to also load ORS list
        const originalLoadFaultsData = loadFaultsData;
        loadFaultsData = async function() {
            await originalLoadFaultsData();
            populateOrsCodeFilter();
            loadOrsList();
        };

        window.loadFaultsData = loadFaultsData;
        window.loadOrsCatalog = loadOrsCatalog;
        window.toggleCreateSheet = toggleCreateSheet;
        window.toggleEditSheet = toggleEditSheet;
        window.openEditSheet = openEditSheet;
        window.loadOrsList = loadOrsList;
        window.debounceSearch = debounceSearch;
        `
            }} />
        </Layout>
    )
}
