import type { FC, PropsWithChildren } from 'hono/jsx'

// KPI Definitions và hướng dẫn
export const KPI_TOOLTIPS = {
  pph: {
    title: 'PPH - Points Per Hour',
    description: 'Số điểm sản lượng trung bình mỗi giờ làm việc',
    formula: 'PPH = Main Task Points / Giờ làm việc',
    interpretation: {
      good: '≥ 40 PPH - Năng suất tốt, đạt kỳ vọng',
      average: '30-39 PPH - Năng suất trung bình, cần duy trì',
      poor: '< 30 PPH - Cần cải thiện năng suất'
    },
    tips: [
      'Tập trung vào Main Task để tăng điểm',
      'Giảm thời gian chờ đợi giữa các tasks',
      'Học hỏi kỹ năng từ đồng nghiệp ranking cao',
      'Hỏi quản lý về cách tối ưu quy trình'
    ]
  },
  ranking: {
    title: 'Ranking Score (1-5)',
    description: 'Thứ hạng năng suất dựa trên PPH, so sánh trong kho',
    formula: 'Ranking được tính tự động từ PPH theo ngưỡng',
    levels: {
      5: { label: 'Xuất sắc', pph: '≥ 50', factor: '100%', color: 'green' },
      4: { label: 'Tốt', pph: '40-49', factor: '95%', color: 'blue' },
      3: { label: 'Đạt', pph: '30-39', factor: '85%', color: 'yellow' },
      2: { label: 'Cải thiện', pph: '20-29', factor: '70%', color: 'orange' },
      1: { label: 'Chưa đạt', pph: '< 20', factor: '50%', color: 'red' }
    },
    tips: [
      'Ranking ảnh hưởng trực tiếp đến KPI Bonus',
      'Mục tiêu: Duy trì Ranking ≥ 3',
      'Cải thiện PPH để nâng Ranking',
      'Tham khảo best practices từ người ranking 5'
    ]
  },
  mainTask: {
    title: 'Main Task Points',
    description: 'Điểm sản lượng từ công việc chính theo vai trò',
    formula: 'Tổng điểm của các đơn hàng/công việc hoàn thành trong tuần',
    taskTypes: {
      packing: 'Đóng gói đơn hàng',
      picking: 'Pick hàng từ kho',
      inspection: 'Kiểm tra chất lượng',
      handover: 'Bàn giao đơn cho shipper',
      data_entry: 'Nhập liệu hệ thống',
      putaway: 'Xếp hàng vào kệ'
    },
    tips: [
      'Ưu tiên hoàn thành Main Task trước',
      'Điểm Main Task quyết định 80% KPI',
      'Đảm bảo chất lượng để tránh ORS'
    ]
  },
  ors: {
    title: 'ORS - Operational Risk Score',
    description: 'Điểm rủi ro vận hành - ghi nhận các vi phạm, sai sót',
    formula: 'Tổng điểm ORS = Σ(Điểm mỗi vi phạm)',
    milestones: {
      GREEN: { range: '0-9', penalty: '0%', desc: 'An toàn, không phạt' },
      YELLOW: { range: '10-19', penalty: '0%', desc: 'Cảnh báo, chưa phạt' },
      ORANGE: { range: '20-29', penalty: '10%', desc: 'Trừ 10% bonus' },
      RED: { range: '30-39', penalty: '30%', desc: 'Trừ 30% bonus' },
      CRITICAL: { range: '≥40', penalty: '100%', desc: 'Mất toàn bộ bonus' }
    },
    tips: [
      'Kiểm tra kỹ trước khi hoàn thành task',
      'ORS tích lũy theo tháng, reset đầu tháng mới',
      'Báo cáo ngay khi phát hiện sai sót để giảm điểm phạt',
      'Học từ lỗi để không lặp lại'
    ]
  },
  ratingFactor: {
    title: 'Rating Factor',
    description: 'Hệ số điều chỉnh bonus dựa trên Ranking',
    formula: 'Rating Factor = % theo bảng Ranking',
    levels: {
      5: '100% (x1.00)',
      4: '95% (x0.95)',
      3: '85% (x0.85)',
      2: '70% (x0.70)',
      1: '50% (x0.50)'
    },
    tips: [
      'Rating Factor càng cao = Bonus càng nhiều',
      'Ranking 5 = Nhận 100% bonus',
      'Ranking 1 = Chỉ nhận 50% bonus'
    ]
  },
  kpiBonus: {
    title: 'KPI Bonus',
    description: 'Tiền thưởng KPI cuối tháng',
    formula: 'KPI Bonus = Major KPI × Đơn giá × Rating Factor × (1 - ORS Penalty)',
    example: 'VD: 5000 điểm × 1000đ × 0.85 × (1-0) = 4,250,000 VND',
    tips: [
      'Tăng Major KPI để tăng bonus',
      'Duy trì Ranking cao để có Rating Factor tốt',
      'Giữ ORS ở mức GREEN/YELLOW để không bị trừ'
    ]
  },
  workHours: {
    title: 'Giờ làm việc',
    description: 'Tổng số giờ làm việc thực tế trong tuần',
    formula: 'Tổng giờ check-in/check-out trong tuần',
    requirements: {
      min: '≥ 20 giờ/tuần để được tính ranking',
      standard: '40-48 giờ/tuần là tiêu chuẩn'
    },
    tips: [
      'Cần tối thiểu 20 giờ/tuần để có ranking',
      'Check-in/out đúng giờ để ghi nhận đầy đủ',
      'Làm thêm giờ hợp lý để tăng điểm'
    ]
  }
}

// Tooltip Component
interface TooltipProps extends PropsWithChildren {
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const Tooltip: FC<TooltipProps> = ({ children, content, position = 'top' }) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  return (
    <div class="relative inline-block group">
      {children}
      <div class={`absolute ${positionClasses[position]} hidden group-hover:block z-50`}>
        <div class="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 max-w-xs shadow-lg">
          {content}
        </div>
      </div>
    </div>
  )
}

// Info Icon with Tooltip
interface InfoTooltipProps {
  tooltipKey: keyof typeof KPI_TOOLTIPS
}

export const InfoTooltip: FC<InfoTooltipProps> = ({ tooltipKey }) => {
  const tooltip = KPI_TOOLTIPS[tooltipKey]
  
  return (
    <span 
      class="inline-flex items-center justify-center w-5 h-5 ml-1 text-gray-400 hover:text-blue-500 cursor-help transition-colors"
      title={`${tooltip.title}: ${tooltip.description}`}
      data-tooltip-key={tooltipKey}
    >
      <i class="fas fa-info-circle text-sm"></i>
    </span>
  )
}

// Tooltip Modal Script (to be included in pages)
export const tooltipScript = `
// KPI Tooltip Data
const KPI_TOOLTIPS = ${JSON.stringify(KPI_TOOLTIPS)};

// Create tooltip modal
function createTooltipModal() {
  if (document.getElementById('kpi-tooltip-modal')) return;
  
  const modal = document.createElement('div');
  modal.id = 'kpi-tooltip-modal';
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4';
  modal.innerHTML = \`
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
        <div class="flex justify-between items-center">
          <h3 id="tooltip-title" class="text-xl font-bold"></h3>
          <button onclick="closeTooltipModal()" class="text-white hover:text-gray-200">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>
      <div id="tooltip-content" class="p-6 overflow-y-auto max-h-[60vh]"></div>
    </div>
  \`;
  document.body.appendChild(modal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeTooltipModal();
  });
}

function showTooltipModal(key) {
  createTooltipModal();
  const tooltip = KPI_TOOLTIPS[key];
  if (!tooltip) return;
  
  document.getElementById('tooltip-title').innerHTML = \`
    <i class="fas fa-info-circle mr-2"></i>\${tooltip.title}
  \`;
  
  let content = \`
    <div class="space-y-4">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-blue-800">\${tooltip.description}</p>
      </div>
      
      <div>
        <h4 class="font-semibold text-gray-900 mb-2">📐 Công thức:</h4>
        <code class="bg-gray-100 px-3 py-2 rounded block text-sm">\${tooltip.formula}</code>
      </div>
  \`;
  
  // Interpretation/Levels
  if (tooltip.interpretation) {
    content += \`
      <div>
        <h4 class="font-semibold text-gray-900 mb-2">📊 Đánh giá:</h4>
        <div class="space-y-2">
          <div class="flex items-center p-2 bg-green-50 rounded">
            <i class="fas fa-check-circle text-green-600 mr-2"></i>
            <span class="text-green-800">\${tooltip.interpretation.good}</span>
          </div>
          <div class="flex items-center p-2 bg-yellow-50 rounded">
            <i class="fas fa-minus-circle text-yellow-600 mr-2"></i>
            <span class="text-yellow-800">\${tooltip.interpretation.average}</span>
          </div>
          <div class="flex items-center p-2 bg-red-50 rounded">
            <i class="fas fa-times-circle text-red-600 mr-2"></i>
            <span class="text-red-800">\${tooltip.interpretation.poor}</span>
          </div>
        </div>
      </div>
    \`;
  }
  
  if (tooltip.levels) {
    content += \`
      <div>
        <h4 class="font-semibold text-gray-900 mb-2">📈 Các mức:</h4>
        <div class="space-y-2">
    \`;
    Object.entries(tooltip.levels).forEach(([level, info]) => {
      if (typeof info === 'object' && info.label) {
        content += \`
          <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div class="flex items-center">
              <span class="w-8 h-8 rounded-full ranking-\${level} text-white flex items-center justify-center font-bold mr-3">\${level}</span>
              <span class="font-medium">\${info.label}</span>
            </div>
            <div class="text-right text-sm">
              <div class="text-gray-600">PPH: \${info.pph}</div>
              <div class="text-blue-600">Factor: \${info.factor}</div>
            </div>
          </div>
        \`;
      } else {
        content += \`
          <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span class="font-medium">Ranking \${level}</span>
            <span class="text-blue-600">\${info}</span>
          </div>
        \`;
      }
    });
    content += '</div></div>';
  }
  
  if (tooltip.milestones) {
    content += \`
      <div>
        <h4 class="font-semibold text-gray-900 mb-2">🚦 Các mức ORS:</h4>
        <div class="space-y-2">
    \`;
    Object.entries(tooltip.milestones).forEach(([level, info]) => {
      const colors = {
        GREEN: 'bg-green-100 text-green-800 border-green-200',
        YELLOW: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        ORANGE: 'bg-orange-100 text-orange-800 border-orange-200',
        RED: 'bg-red-100 text-red-800 border-red-200',
        CRITICAL: 'bg-red-900 text-white border-red-900'
      };
      content += \`
        <div class="flex items-center justify-between p-3 rounded border \${colors[level]}">
          <div>
            <span class="font-bold">\${level}</span>
            <span class="ml-2">(\${info.range} điểm)</span>
          </div>
          <div class="text-right">
            <div class="font-bold">Penalty: \${info.penalty}</div>
            <div class="text-sm">\${info.desc}</div>
          </div>
        </div>
      \`;
    });
    content += '</div></div>';
  }
  
  // Tips
  if (tooltip.tips && tooltip.tips.length > 0) {
    content += \`
      <div>
        <h4 class="font-semibold text-gray-900 mb-2">💡 Lời khuyên:</h4>
        <ul class="space-y-2">
          \${tooltip.tips.map(tip => \`
            <li class="flex items-start">
              <i class="fas fa-lightbulb text-yellow-500 mr-2 mt-1"></i>
              <span>\${tip}</span>
            </li>
          \`).join('')}
        </ul>
      </div>
    \`;
  }
  
  content += '</div>';
  
  document.getElementById('tooltip-content').innerHTML = content;
  document.getElementById('kpi-tooltip-modal').classList.remove('hidden');
}

function closeTooltipModal() {
  document.getElementById('kpi-tooltip-modal')?.classList.add('hidden');
}

// Attach click handlers to info icons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-tooltip-key]').forEach(el => {
    el.addEventListener('click', () => {
      showTooltipModal(el.dataset.tooltipKey);
    });
  });
});

// Also support Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeTooltipModal();
});
`
