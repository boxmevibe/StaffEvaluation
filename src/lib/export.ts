// Export utilities for CSV and Excel

// Convert data array to CSV string
export function toCSV(data: any[], columns?: { key: string; label: string }[]): string {
  if (!data || data.length === 0) return ''

  // Auto-detect columns from first data item
  const cols = columns || Object.keys(data[0]).map(key => ({ key, label: key }))
  
  // Header row
  const header = cols.map(c => `"${c.label}"`).join(',')
  
  // Data rows
  const rows = data.map(item => {
    return cols.map(c => {
      let val = item[c.key]
      
      // Handle nested objects
      if (typeof val === 'object' && val !== null) {
        val = JSON.stringify(val)
      }
      
      // Escape quotes and wrap in quotes
      if (val === null || val === undefined) {
        return '""'
      }
      
      return `"${String(val).replace(/"/g, '""')}"`
    }).join(',')
  })
  
  return [header, ...rows].join('\n')
}

// Download CSV file
export function downloadCSV(csvContent: string, filename: string): void {
  const BOM = '\uFEFF' // UTF-8 BOM for Excel compatibility
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export data as CSV
export function exportToCSV(
  data: any[], 
  filename: string, 
  columns?: { key: string; label: string }[]
): void {
  const csv = toCSV(data, columns)
  downloadCSV(csv, filename)
}

// Format number with thousands separator
export function formatNumber(num: number | string, locale: string = 'vi-VN'): string {
  const n = typeof num === 'string' ? parseFloat(num) : num
  return isNaN(n) ? String(num) : n.toLocaleString(locale)
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'VND'): string {
  const formats: Record<string, Intl.NumberFormatOptions> = {
    VND: { style: 'currency', currency: 'VND', minimumFractionDigits: 0 },
    THB: { style: 'currency', currency: 'THB' },
    PHP: { style: 'currency', currency: 'PHP' },
    IDR: { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 },
    MYR: { style: 'currency', currency: 'MYR' },
  }
  
  const format = formats[currency] || { style: 'currency', currency }
  return new Intl.NumberFormat('vi-VN', format).format(amount)
}

// Column definitions for common exports
export const RANKING_COLUMNS = [
  { key: 'staff_id', label: 'Mã NV' },
  { key: 'staff_name', label: 'Tên NV' },
  { key: 'pph', label: 'PPH' },
  { key: 'main_task_points', label: 'Điểm Main Task' },
  { key: 'estimated_work_hours', label: 'Giờ làm việc' },
  { key: 'ranking_score', label: 'Ranking' },
  { key: 'status', label: 'Trạng thái' },
]

export const KPI_MONTHLY_COLUMNS = [
  { key: 'staff_id', label: 'Mã NV' },
  { key: 'staff_name', label: 'Tên NV' },
  { key: 'role', label: 'Vai trò' },
  { key: 'major_kpi', label: 'Major KPI' },
  { key: 'avg_ranking_score', label: 'Avg Ranking' },
  { key: 'final_ranking_score', label: 'Final Ranking' },
  { key: 'rating_factor', label: 'Rating Factor' },
  { key: 'kpi_bonus_calculated', label: 'KPI Bonus (tính)' },
  { key: 'ors_points_total', label: 'ORS Points' },
  { key: 'ors_penalty_rate', label: 'ORS Penalty %' },
  { key: 'kpi_bonus_final', label: 'KPI Bonus (thực)' },
]

export const PAYROLL_BRIDGE_COLUMNS = [
  { key: 'staff_id', label: 'Mã NV' },
  { key: 'major_kpi', label: 'Major KPI' },
  { key: 'rating_factor', label: 'Rating Factor' },
  { key: 'kpi_bonus', label: 'KPI Bonus' },
  { key: 'penalty', label: 'Penalty' },
  { key: 'applied_to_payroll', label: 'Đã áp dụng' },
  { key: 'calculated_at', label: 'Ngày tính' },
]

export const ORS_EVENT_COLUMNS = [
  { key: 'event_date', label: 'Ngày' },
  { key: 'staff_id', label: 'Mã NV' },
  { key: 'staff_name', label: 'Tên NV' },
  { key: 'ors_code', label: 'Mã lỗi' },
  { key: 'ors_points', label: 'Điểm' },
  { key: 'description', label: 'Mô tả' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'reported_by', label: 'Người báo' },
  { key: 'reviewed_by', label: 'Người duyệt' },
]
