import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { WAREHOUSES } from '../types/database'

export const RecoveryPage: FC = () => {
    const warehouses = Object.entries(WAREHOUSES)

    return (
        <Layout title="Phục hồi điểm ORS" activeTab="recovery">
            <div class="mb-4">
                <p class="text-sm text-gray-500">Gán Recovery để nhân viên học tập và cải thiện điểm xếp hạng.</p>
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
                    z-index: 100; /* Increased Z-Index */
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

            {/* Filter Section */}
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
                <div class="flex flex-col md:flex-row gap-4 items-end">
                    <div class="w-full md:w-64">
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
                    <div class="flex gap-2 w-full md:w-auto">
                        <button
                            onclick="loadRecoveryData()"
                            class="flex-1 md:flex-none bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 min-h-[44px]"
                        >
                            <i class="fas fa-sync-alt mr-2"></i>Tải dữ liệu
                        </button>
                        <button
                            onclick="toggleCreateSheet(true)"
                            class="flex-1 md:flex-none bg-green-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-green-700 min-h-[44px]"
                        >
                            <i class="fas fa-plus mr-2"></i>Tạo mới
                        </button>
                    </div>
                </div>
            </div>

            {/* Recovery Stats */}
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div class="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                    <p class="text-2xl font-bold text-blue-600" id="recovery-assigned">0</p>
                    <p class="text-xs text-gray-600">Đã gán</p>
                </div>
                <div class="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-100">
                    <p class="text-2xl font-bold text-yellow-600" id="recovery-in-progress">0</p>
                    <p class="text-xs text-gray-600">Đang thực hiện</p>
                </div>
                <div class="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                    <p class="text-2xl font-bold text-green-600" id="recovery-completed">0</p>
                    <p class="text-xs text-gray-600">Hoàn thành</p>
                </div>
                <div class="bg-purple-50 rounded-lg p-3 text-center border border-purple-100">
                    <p class="text-2xl font-bold text-purple-600" id="recovery-applied-points">0</p>
                    <p class="text-xs text-gray-600">Điểm đã áp dụng</p>
                </div>
            </div>

            {/* Two Column Layout: Form & List */}
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Col: Removed - now in Bottom Sheet */}

                {/* Right Col: List */}
                <div class="lg:col-span-3">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 min-h-[600px]">
                        <div class="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-4">
                            <h4 class="font-bold text-gray-900 flex items-center gap-2">
                                <i class="fas fa-list text-blue-600"></i>
                                Danh sách yêu cầu phục hồi điểm
                            </h4>
                            <div class="flex gap-2">
                                <select id="recovery-status-filter" onchange="filterRecoveryTickets()" class="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="ASSIGNED">Đã gán</option>
                                    <option value="IN_PROGRESS">Đang thực hiện</option>
                                    <option value="COMPLETED">Hoàn thành</option>
                                    <option value="FAILED">Không đạt</option>
                                </select>
                                <button onclick="exportRecoveryCsv()" class="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 text-sm">
                                    <i class="fas fa-download"></i> CSV
                                </button>
                            </div>
                        </div>

                        {/* Mobile Cards */}
                        <div id="recovery-tickets-cards" class="md:hidden space-y-2">
                            <p class="text-gray-500 text-center py-4">Chọn kho và tải dữ liệu để xem</p>
                        </div>

                        {/* Desktop Table */}
                        <div class="hidden md:block overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Ticket</th>
                                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Nhân viên</th>
                                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Recovery</th>
                                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Điểm</th>
                                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Trạng thái</th>
                                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody id="recovery-tickets-body" class="divide-y divide-gray-200">
                                    <tr><td colSpan={6} class="px-4 py-8 text-center text-gray-500">Chọn kho và tải dữ liệu để xem</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* Bottom Sheet for Create */}
                <div id="bottom-sheet-overlay" class="bottom-sheet-overlay" onclick="toggleCreateSheet(false)"></div>
                <div id="create-bottom-sheet" class="bottom-sheet">
                    <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl md:rounded-tl-xl md:rounded-tr-none">
                        <h3 class="font-bold text-lg text-gray-900 flex items-center gap-2">
                            <i class="fas fa-plus-circle text-green-600"></i>
                            Ghi nhận hồi phục điểm
                        </h3>
                        <button onclick="toggleCreateSheet(false)" class="text-gray-500 hover:text-gray-700 p-2">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <div class="p-4 md:p-6 overflow-y-auto pb-24">
                        <form id="create-recovery-form" class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div class="autocomplete-wrapper">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Nhân viên *</label>
                                    <input type="text" id="recovery-staff-search" required class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]" placeholder="Nhập tên hoặc mã NV" autocomplete="off" />
                                    <input type="hidden" id="recovery-staff-id" />
                                    <input type="hidden" id="recovery-staff-name" />
                                    <div id="staff-suggestions" class="autocomplete-suggestions"></div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Mã NV</label>
                                    <input type="text" id="recovery-staff-id-display" disabled class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px] text-gray-500" />
                                </div>
                            </div>

                            <div class="autocomplete-wrapper">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Recovery Package *</label>
                                <input type="text" id="recovery-package-search" required class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]" placeholder="Tìm gói Recovery..." autocomplete="off" />
                                <input type="hidden" id="recovery-catalog" />
                                <div id="package-suggestions" class="autocomplete-suggestions"></div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Ngày tạo (Created Date)</label>
                                <input type="date" id="recovery-created-date" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]" />
                                <p class="text-xs text-gray-500 mt-1">Sẽ lưu là ngày gán (Assigned At)</p>
                            </div>
                            <div class="autocomplete-wrapper">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Người gán *</label>
                                <input type="text" id="recovery-assigned-by-search" required class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]" placeholder="Tìm tên người gán" autocomplete="off" />
                                <div id="assignee-suggestions" class="autocomplete-suggestions"></div>
                            </div>

                            {/* Sticky Footer Action in Mobile */}
                            <div class="pt-6 md:pt-4 sticky bottom-0 bg-white md:bg-transparent pb-4 md:pb-0 border-t md:border-t-0 mt-4 md:mt-0">
                                <button type="submit" class="w-full bg-green-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-green-700 shadow-md flex justify-center items-center gap-2 text-lg">
                                    <i class="fas fa-ticket-alt"></i>
                                    Tạo yêu cầu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>

            <script dangerouslySetInnerHTML={{
                __html: `
        // Using window.API_BASE from Layout;
        let recoveryCatalog = [];
        let recoveryTickets = [];
        
        console.log('[Recovery] Script initialized');

        function toggleCreateSheet(open) {
            console.log('[Recovery] toggleCreateSheet called with:', open);
            
            const warehouseCode = document.getElementById('warehouseCode').value;
            console.log('[Recovery] warehouseCode:', warehouseCode);
            
            if (open && !warehouseCode) {
                console.log('[Recovery] No warehouse selected, showing alert');
                alert('Vui lòng chọn Warehouse trước khi tạo phiếu!');
                // Focus on warehouse select if possible, but it is on main page.
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
            console.log('[Recovery] overlay:', overlay, 'sheet:', sheet);
            
            if (open) {
                console.log('[Recovery] Opening sheet...');
                overlay.classList.remove('hidden');
                // Small delay to allow display:block to apply before opacity transition
                requestAnimationFrame(() => {
                    overlay.classList.add('open');
                    sheet.classList.add('open');
                    console.log('[Recovery] Sheet opened');
                });
            } else {
                console.log('[Recovery] Closing sheet...');
                overlay.classList.remove('open');
                sheet.classList.remove('open');
                setTimeout(() => {
                   if(!overlay.classList.contains('open')) overlay.classList.add('hidden');
                }, 300);
            }
        }

        // Load Recovery Catalog on page load
        async function loadRecoveryCatalog() {
          try {
            const res = await axios.get(window.API_BASE + '/recovery/catalog');
            recoveryCatalog = res.data.data || [];
            const select = document.getElementById('recovery-catalog');
            
            // Group by difficulty
            // Logic moved to Autocomplete source
            /*
            const difficulties = ['EASY', 'MEDIUM', 'HARD', 'VERY_HARD'];
            const diffLabels = { EASY: 'Dễ', MEDIUM: 'Trung bình', HARD: 'Khó', VERY_HARD: 'Rất khó' };
            */
          } catch (e) {
            console.error('Failed to load recovery catalog:', e);
          }
        }
        document.addEventListener('DOMContentLoaded', () => {
          loadRecoveryCatalog();
        });

        // Load Recovery Data
        async function loadRecoveryData() {
          const warehouseCode = document.getElementById('warehouseCode').value;
          if (!warehouseCode) {
            alert('Vui lòng chọn Warehouse trước');
            return;
          }

          try {
            // Load stats
            const statsRes = await axios.get(window.API_BASE + '/recovery/stats?warehouseCode=' + warehouseCode);
            const stats = statsRes.data.data;
            
            document.getElementById('recovery-assigned').textContent = stats.byStatus.ASSIGNED || 0;
            document.getElementById('recovery-in-progress').textContent = stats.byStatus.IN_PROGRESS || 0;
            document.getElementById('recovery-completed').textContent = stats.byStatus.COMPLETED || 0;
            document.getElementById('recovery-applied-points').textContent = stats.appliedRecoveryPoints || 0;

            // Load tickets
            const ticketsRes = await axios.get(window.API_BASE + '/recovery/tickets?warehouseCode=' + warehouseCode + '&limit=100');
            recoveryTickets = ticketsRes.data.data || [];
            
            renderRecoveryTickets(recoveryTickets);
          } catch (error) {
            console.error('Error loading recovery data:', error);
            alert('Không thể tải dữ liệu Recovery: ' + error.message);
          }
        }

        function filterRecoveryTickets() {
          const statusFilter = document.getElementById('recovery-status-filter').value;
          const filtered = statusFilter 
            ? recoveryTickets.filter(t => t.status === statusFilter)
            : recoveryTickets;
          renderRecoveryTickets(filtered);
        }

        function exportRecoveryCsv() {
          if (!recoveryTickets || recoveryTickets.length === 0) {
            alert('Chưa có dữ liệu để xuất! Vui lòng tải dữ liệu trước.');
            return;
          }

          const headers = [
            'Ticket Code', 'Warehouse', 'Staff ID', 'Staff Name', 
            'Recovery Package', 'Type', 'Points', 'Status', 
            'Assigned By', 'Assigned At', 'Deadline', 
            'Completed At', 'Applied To ORS'
          ];

          const rows = recoveryTickets.map(t => [
            t.ticket_code,
            t.warehouse_code,
            t.staff_id,
            t.staff_name || '',
            t.ors_recovery_catalog?.title || t.recovery_code,
            t.recovery_type,
            t.ors_reward,
            t.status,
            t.assigned_by,
            new Date(t.assigned_at).toLocaleDateString(),
            t.deadline_at ? new Date(t.deadline_at).toLocaleDateString() : '',
            t.completed_at ? new Date(t.completed_at).toLocaleDateString() : '',
            t.ors_applied ? 'Yes' : 'No'
          ]);

          const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(','))
          ].join('\\n');

          const blob = new Blob(['\\uFEFF' + csvContent], {type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const timestamp = new Date().toISOString().slice(0,10);

          link.href = url;
          link.setAttribute('download', 'recovery_tickets_' + timestamp + '.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }

        function renderRecoveryTickets(tickets) {
          const statusLabels = {
            ASSIGNED: 'Đã gán',
            IN_PROGRESS: 'Đang thực hiện',
            COMPLETED: 'Hoàn thành',
            FAILED: 'Không đạt',
            EXPIRED: 'Hết hạn',
            CANCELLED: 'Đã hủy'
          };
          const statusColors = {
            ASSIGNED: 'bg-blue-100 text-blue-800',
            IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
            COMPLETED: 'bg-green-100 text-green-800',
            FAILED: 'bg-red-100 text-red-800',
            EXPIRED: 'bg-gray-100 text-gray-800',
            CANCELLED: 'bg-gray-100 text-gray-800'
          };

          // Desktop Table
          document.getElementById('recovery-tickets-body').innerHTML = tickets.length > 0
            ? tickets.map(t => {
                const catalog = t.ors_recovery_catalog || { };
                let actions = '';

                if (t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS') {
                  actions = '<button onclick="completeRecovery(' + t.id + ')" class="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 mr-1"><i class="fas fa-check mr-1"></i>Hoàn thành</button>';
                  actions += '<button onclick="failRecovery(' + t.id + ')" class="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"><i class="fas fa-times mr-1"></i>Không đạt</button>';
                } else if (t.status === 'COMPLETED' && !t.ors_applied) {
                  // We need to ask for payroll period to apply, so maybe just show a button that triggers a modal or prompt
                  // For simplicity, we might remove the apply button or make it simple
                  actions = '<span class="text-green-600 text-xs">Đã hoàn thành</span>';
                } else if (t.ors_applied) {
                  actions = '<span class="text-green-600 text-xs"><i class="fas fa-check-circle mr-1"></i>Đã tính điểm</span>';
                }

                return \`<tr class="hover:bg-gray-50">
                  <td class="px-3 py-2"><span class="font-mono text-xs">\${t.ticket_code}</span></td>
                  <td class="px-3 py-2">
                    <a href="/employee?staffId=\${t.staff_id}&warehouseCode=\${t.warehouse_code || warehouseCode}" target="_blank" class="block hover:bg-blue-50 -m-1 p-1 rounded transition-colors group">
                      <div class="font-medium text-gray-900 group-hover:text-blue-600">\${t.staff_name || t.staff_id}</div>
                      <div class="text-xs text-gray-500 group-hover:text-blue-400">\${t.staff_id}</div>
                    </a>
                  </td>
                  <td class="px-3 py-2 max-w-[200px]"><div class="truncate text-sm">\${catalog.title || t.recovery_code}</div></td>
                  <td class="px-3 py-2"><span class="font-bold text-green-600">+\${t.ors_reward}</span></td>
                  <td class="px-3 py-2"><span class="\${statusColors[t.status]} px-2 py-0.5 rounded-full text-xs">\${statusLabels[t.status]}</span></td>
                  <td class="px-3 py-2">\${actions}</td>
                </tr>\`;
              }).join('')
            : '<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">Chưa có Recovery Ticket nào</td></tr>';

          // Mobile Cards
          document.getElementById('recovery-tickets-cards').innerHTML = tickets.length > 0
            ? tickets.map(t => {
                const catalog = t.ors_recovery_catalog || { };
                return \`<div class="p-3 bg-white border border-gray-200 rounded-lg">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <span class="font-mono text-xs text-gray-500">\${t.ticket_code}</span>
                      <a href="/employee?staffId=\${t.staff_id}&warehouseCode=\${t.warehouse_code || document.getElementById('warehouseCode').value}" target="_blank" class="font-medium block text-gray-900 hover:text-blue-600 hover:underline">
                        \${t.staff_name || t.staff_id}
                      </a>
                    </div>
                    <span class="\${statusColors[t.status]} px-2 py-0.5 rounded-full text-xs">\${statusLabels[t.status]}</span>
                  </div>
                  <div class="text-sm text-gray-600 mb-2">\${catalog.title || t.recovery_code}</div>
                  <div class="text-sm"><span class="font-bold text-green-600">+\${t.ors_reward} pts</span></div>
                </div>\`;
              }).join('')
            : '<p class="text-gray-500 text-center py-4">Chưa có Recovery Ticket nào</p>';
        }

        // Create Recovery Ticket
        document.getElementById('create-recovery-form').addEventListener('submit', async (e) => {
          e.preventDefault();

          const warehouseCode = document.getElementById('warehouseCode').value;
          if (!warehouseCode) {
            alert('Vui lòng chọn Warehouse trước');
            return;
          }

          const staffId = document.getElementById('recovery-staff-id').value;
          const packageId = document.getElementById('recovery-catalog').value;
          const assignedBy = document.getElementById('recovery-assigned-by-search').value;

          if (!staffId) { alert('Vui lòng chọn Nhân viên từ danh sách gợi ý'); return; }
          if (!packageId) { alert('Vui lòng chọn Recovery Package từ danh sách gợi ý'); return; }

          const data = {
            warehouse_code: warehouseCode,
            staff_id: staffId,
            staff_name: document.getElementById('recovery-staff-name').value || null,
            recovery_catalog_id: parseInt(packageId),
            // Use created date as assigned_at, deadline is null/calculated by backend or manual update later if needed
            assigned_at: document.getElementById('recovery-created-date').value ? new Date(document.getElementById('recovery-created-date').value).toISOString() : new Date().toISOString(),
            assigned_by: assignedBy
          };

            try {
              await axios.post(window.API_BASE + '/recovery/tickets', data);
              alert('Đã tạo Recovery Ticket thành công!');
              document.getElementById('create-recovery-form').reset();
              // Reset hidden fields
              document.getElementById('recovery-staff-id').value = '';
              document.getElementById('recovery-staff-name').value = '';
              document.getElementById('recovery-catalog').value = '';
              document.getElementById('recovery-staff-id-display').value = '';
              
              // Reset date to today
              document.getElementById('recovery-created-date').value = new Date().toISOString().slice(0, 10);
              
              toggleCreateSheet(false);
              loadRecoveryData();
            } catch (error) {
              alert('Lỗi: ' + (error.response?.data?.error || error.message));
            }
          });

        // ==================== AUTOCOMPLETE LOGIC ====================
        class Autocomplete {
            constructor(inputId, suggestionsId, onSelect, onSearch) {
                this.input = document.getElementById(inputId);
                
                // Move suggestions container to body to avoid overflow clipping issues in Bottom Sheet
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
                
                // Hide on scroll/resize logic to prevent floating detached
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
                
                // Position Fixed Calculation
                const rect = this.input.getBoundingClientRect();
                this.suggestions.style.position = 'fixed';
                this.suggestions.style.top = rect.bottom + 'px';
                this.suggestions.style.left = rect.left + 'px';
                this.suggestions.style.width = rect.width + 'px';
                this.suggestions.style.zIndex = '9999';
                this.suggestions.style.maxHeight = '250px';
                this.suggestions.style.overflowY = 'auto';
                this.suggestions.style.backgroundColor = 'white';
                this.suggestions.style.border = '1px solid #ddd';
                this.suggestions.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                
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
            new Autocomplete('recovery-staff-search', 'staff-suggestions', 
                (data) => {
                    // On select
                    document.getElementById('recovery-staff-id').value = data.staff_id;
                    document.getElementById('recovery-staff-name').value = data.staff_name;
                    document.getElementById('recovery-staff-id-display').value = data.staff_id;
                },
                async (query) => {
                    // On search
                    console.log('[Recovery] Staff autocomplete search:', query);
                    const warehouseCode = document.getElementById('warehouseCode').value;
                    if (!warehouseCode) {
                        console.log('[Recovery] No warehouse selected for staff search');
                        return [];
                    }
                    try {
                        const res = await axios.get(window.API_BASE + \`/staff/search?warehouseCode=\${warehouseCode}&q=\${encodeURIComponent(query)}\`);
                        console.log('[Recovery] Staff search results:', res.data.data);
                        return res.data.data.map(s => ({
                            displayText: s.staff_name || s.staff_id,
                            html: \`<strong>\${s.staff_name || 'N/A'}</strong><span>\${s.staff_id} - \${s.role_name || 'User'}</span>\`,
                            data: s
                        }));
                    } catch (e) { 
                        console.error('[Recovery] Staff search error:', e); 
                        return []; 
                    }
                }
            );

            // Package Autocomplete
            new Autocomplete('recovery-package-search', 'package-suggestions',
                (data) => {
                    document.getElementById('recovery-catalog').value = data.id;
                },
                async (query) => {
                    // Local search in loaded recoveryCatalog
                    const q = query.toLowerCase();
                    const filtered = recoveryCatalog.filter(c => 
                        c.title.toLowerCase().includes(q) || 
                        c.ors_code?.toLowerCase().includes(q) ||
                        c.difficulty.toLowerCase().includes(q)
                    );
                    return filtered.map(c => ({
                        displayText: c.title,
                        html: \`<strong>\${c.title}</strong><span>\${c.difficulty} - +\${c.ors_reward} pts</span>\`,
                        data: c
                    }));
                }
            );

            // Assignee Autocomplete (Reuse Staff API but without ID hidden logic, just text)
            new Autocomplete('recovery-assigned-by-search', 'assignee-suggestions',
                (data) => {
                   // Just keep the text in the input
                },
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

            // Set default date
             document.getElementById('recovery-created-date').value = new Date().toISOString().slice(0, 10);
        });

        // Complete Recovery
        window.completeRecovery = async function(ticketId) {
          const notes = prompt('Ghi chú hoàn thành (tùy chọn):');
          const confirmedBy = prompt('Người xác nhận:');
          if (!confirmedBy) return;

          try {
            await axios.put(window.API_BASE + '/recovery/tickets/' + ticketId + '/status', {
              status: 'COMPLETED',
              completion_notes: notes,
              confirmed_by: confirmedBy
            });
            alert('Đã đánh dấu hoàn thành!');
            loadRecoveryData();
          } catch (error) {
            alert('Lỗi: ' + error.message);
          }
        }

        // Fail Recovery
        window.failRecovery = async function(ticketId) {
          const notes = prompt('Lý do không đạt:');
          const confirmedBy = prompt('Người xác nhận:');
          if (!confirmedBy) return;

          try {
            await axios.put(window.API_BASE + '/recovery/tickets/' + ticketId + '/status', {
              status: 'FAILED',
              completion_notes: notes,
              confirmed_by: confirmedBy
            });
            alert('Đã đánh dấu không đạt.');
            loadRecoveryData();
          } catch (error) {
            alert('Lỗi: ' + error.message);
          }
        }
        window.loadRecoveryData = loadRecoveryData;
        window.filterRecoveryTickets = filterRecoveryTickets;
        window.exportRecoveryCsv = exportRecoveryCsv;
        window.toggleCreateSheet = toggleCreateSheet;
        `
            }} />
        </Layout>
    )
}
