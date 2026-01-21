import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { WAREHOUSES } from '../types/database'

export const LeaderboardPage: FC = () => {
    const warehouses = Object.entries(WAREHOUSES)

    return (
        <Layout title="Bảng xếp hạng" activeTab="leaderboard">
            {/* Page Header */}
            <div class="mb-4">
                <p class="text-sm text-gray-500">Xem xếp hạng năng suất nhân viên theo tuần.</p>
            </div>

            {/* Filter Section */}
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Kho</label>
                        <select
                            id="warehouseCode"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px] focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Chọn kho (để xem Top 10 của kho)</option>
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
                    <div class="flex items-end">
                        <button
                            onclick="loadLeaderboardData()"
                            id="btn-load"
                            class="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 min-h-[44px]"
                        >
                            <i class="fas fa-sync-alt mr-2"></i>
                            Tải dữ liệu
                        </button>
                    </div>
                </div>
            </div>

            {/* Full Ranking Table */}
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
                    <div>
                        <h3 class="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                            <i class="fas fa-list-ol text-purple-600"></i>
                            Bảng xếp hạng đầy đủ
                        </h3>
                        <p class="text-sm text-gray-500">Xem chi tiết xếp hạng tất cả nhân viên.</p>
                    </div>
                    <button
                        onclick="exportRankingCSV()"
                        class="bg-green-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-green-700 text-sm min-h-[44px]"
                    >
                        <i class="fas fa-file-csv mr-2"></i>
                        Xuất file CSV
                    </button>
                </div>

                {/* Mobile Card View */}
                <div id="full-ranking-cards" class="md:hidden space-y-2">
                    <p class="text-gray-500 text-center py-4">Chọn kho và tuần để xem dữ liệu</p>
                </div>

                {/* Desktop Table View */}
                <div class="hidden md:block overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">#</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Mã NV</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Tên</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">PPH</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Điểm nhiệm vụ</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Giờ làm</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Xếp hạng</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody id="full-ranking-body" class="divide-y divide-gray-200">
                            <tr><td colSpan={8} class="px-4 py-8 text-center text-gray-500">Chọn kho và tuần để xem dữ liệu</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <script dangerouslySetInnerHTML={{
                __html: `
        // Using window.API_BASE from Layout;
        let rankingData = []; // Store ranking data for export

        // Set default dates
        const now = new Date();
        const year = now.getFullYear();
        const onejan = new Date(year, 0, 1);
        const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        document.getElementById('yearWeek').value = year + '-W' + String(week).padStart(2, '0');

        async function loadLeaderboardData() {
          const warehouseCode = document.getElementById('warehouseCode').value;
          const yearWeek = document.getElementById('yearWeek').value;

          if (!warehouseCode) {
            alert('Vui lòng chọn Warehouse');
            return;
          }

          try {
            // Load ranking
            const rankRes = await axios.get(window.API_BASE + '/manager/ranking?warehouseCode=' + warehouseCode + '&yearWeek=' + yearWeek + '&limit=100');
            const rankings = rankRes.data.data || [];
            rankingData = rankings; // Store for export

            const rankStars = { 5: '5\u2b50', 4: '4\u2b50', 3: '3\u2b50', 2: '2\u2b50', 1: '1\u2b50' };

            // Full ranking - Desktop Table
            document.getElementById('full-ranking-body').innerHTML = rankings.map((r, i) => {
              const colors = { 5: 'bg-green-500', 4: 'bg-blue-500', 3: 'bg-yellow-500', 2: 'bg-orange-500', 1: 'bg-red-500' };
              const statusLabels = { FINAL: '\u0110\u1ee7 d\u1eef li\u1ec7u', INSUFFICIENT_DATA: 'Thi\u1ebfu d\u1eef li\u1ec7u', PENDING_REVIEW: 'Ch\u1edd duy\u1ec7t' };
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
                  <td class="px-4 py-2 \${statusColors[r.status] || ''} text-sm">\${statusLabels[r.status] || r.status}</td>
                </tr>
              \`;
            }).join('') || '<tr><td colspan="8" class="px-4 py-8 text-center text-gray-500">Kh\u00f4ng c\u00f3 d\u1eef li\u1ec7u</td></tr>';

            // Full ranking - Mobile Cards
            document.getElementById('full-ranking-cards').innerHTML = rankings.map((r, i) => {
              const bgColors = { 5: 'border-l-green-500', 4: 'border-l-blue-500', 3: 'border-l-yellow-500', 2: 'border-l-orange-500', 1: 'border-l-red-500' };
              const statusLabels = { FINAL: '\u0110\u1ee7 d\u1eef li\u1ec7u', INSUFFICIENT_DATA: 'Thi\u1ebfu d\u1eef li\u1ec7u', PENDING_REVIEW: 'Ch\u1edd duy\u1ec7t' };
              return \`
                <div class="p-3 bg-white border border-gray-200 rounded-lg border-l-4 \${bgColors[r.ranking_score]}">
                  <div class="flex justify-between items-start">
                    <div>
                      <span class="text-xs text-gray-400">#\${i + 1}</span>
                      <span class="font-medium ml-1">\${r.staff_name || r.staff_id}</span>
                      <div class="text-xs text-gray-500 font-mono">\${r.staff_id}</div>
                    </div>
                    <span class="text-sm font-bold">\${rankStars[r.ranking_score]}</span>
                  </div>
                  <div class="mt-2 text-xs text-gray-600 flex flex-wrap gap-x-3">
                    <span>PPH: <span class="font-bold text-blue-600">\${r.pph.toFixed(2)}</span></span>
                    <span>\u0110i\u1ec3m: <span class="font-bold">\${r.main_task_points.toLocaleString()}</span></span>
                    <span>Gi\u1edd: \${r.estimated_work_hours.toFixed(1)}h</span>
                  </div>
                  <div class="mt-1 text-xs text-gray-500">\${statusLabels[r.status] || r.status}</div>
                </div>
              \`;
            }).join('') || '<p class="text-gray-500 text-center py-4">Kh\u00f4ng c\u00f3 d\u1eef li\u1ec7u</p>';
          
          } catch (error) {
            console.error('Error loading data:', error);
            alert('Không thể tải dữ liệu: ' + error.message);
          }
        }

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
        `
            }} />
        </Layout>
    )
}
