// Utility functions for KPI Warehouse Management System

/**
 * Get ISO week string from date (YYYY-Www format)
 */
export function getISOWeekString(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`
}

/**
 * Get week start date (Monday) from ISO week string
 */
export function getWeekStartDate(yearWeek: string): Date {
  const [year, week] = yearWeek.split('-W').map(Number)
  const jan4 = new Date(year, 0, 4)
  const dayOfWeek = jan4.getDay() || 7
  const monday = new Date(jan4)
  monday.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7)
  return monday
}

/**
 * Get week end date (Sunday) from ISO week string
 */
export function getWeekEndDate(yearWeek: string): Date {
  const weekStart = getWeekStartDate(yearWeek)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  return weekEnd
}

/**
 * Get payroll period (YYYY-MM) from date
 */
export function getPayrollPeriod(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
}

/**
 * Get current ISO week string
 */
export function getCurrentWeek(): string {
  return getISOWeekString(new Date())
}

/**
 * Get previous ISO week string
 */
export function getPreviousWeek(currentWeek?: string): string {
  const weekStart = currentWeek ? getWeekStartDate(currentWeek) : new Date()
  const prevWeekDate = new Date(weekStart)
  prevWeekDate.setDate(prevWeekDate.getDate() - 7)
  return getISOWeekString(prevWeekDate)
}

/**
 * Get all weeks in a payroll period
 */
export function getWeeksInPeriod(payrollPeriod: string): string[] {
  const [year, month] = payrollPeriod.split('-').map(Number)
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)
  
  const weeks: string[] = []
  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    const weekStr = getISOWeekString(currentDate)
    if (!weeks.includes(weekStr)) {
      weeks.push(weekStr)
    }
    currentDate.setDate(currentDate.getDate() + 7)
  }
  
  return weeks
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Get rating factor from ranking score
 */
export function getRatingFactor(rankingScore: number): number {
  const map: Record<number, number> = {
    5: 1.00,
    4: 0.95,
    3: 0.85,
    2: 0.70,
    1: 0.50,
  }
  return map[rankingScore] ?? 0.85
}

/**
 * Get ranking score from PPH using default thresholds
 */
export function getDefaultRankingScore(pph: number): number {
  if (pph >= 50) return 5
  if (pph >= 40) return 4
  if (pph >= 30) return 3
  if (pph >= 20) return 2
  return 1
}

/**
 * Get milestone level from ORS points
 */
export function getMilestoneLevel(orsPoints: number): {
  level: string
  penaltyRate: number
  action: string
} {
  if (orsPoints >= 40) return { level: 'CRITICAL', penaltyRate: 1.00, action: 'DISCIPLINARY' }
  if (orsPoints >= 30) return { level: 'RED', penaltyRate: 0.30, action: 'HR_REVIEW' }
  if (orsPoints >= 20) return { level: 'ORANGE', penaltyRate: 0.10, action: 'TRAINING_REQUIRED' }
  if (orsPoints >= 10) return { level: 'YELLOW', penaltyRate: 0.00, action: 'WARNING' }
  return { level: 'GREEN', penaltyRate: 0.00, action: 'NO_ACTION' }
}

/**
 * Calculate PPH (Points Per Hour)
 */
export function calculatePPH(points: number, hours: number): number {
  if (hours <= 0) return 0
  return Math.round((points / hours) * 100) / 100
}

/**
 * Get country code from warehouse code
 */
export function getCountryFromWarehouse(warehouseCode: string): string {
  if (warehouseCode.startsWith('BMVN')) return 'VN'
  if (warehouseCode.startsWith('BMTH')) return 'TH'
  if (warehouseCode.startsWith('BMPH')) return 'PH'
  if (warehouseCode.startsWith('BMID')) return 'ID'
  if (warehouseCode.startsWith('BMMY')) return 'MY'
  return 'VN' // Default
}

/**
 * Format number with locale
 */
export function formatNumber(num: number, locale = 'vi-VN'): string {
  return new Intl.NumberFormat(locale).format(num)
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency = 'VND'): string {
  const locale = currency === 'VND' ? 'vi-VN' : 'en-US'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Get ranking label
 */
export function getRankingLabel(score: number): string {
  const labels: Record<number, string> = {
    5: 'Xuất sắc',
    4: 'Tốt',
    3: 'Đạt yêu cầu',
    2: 'Cần cải thiện',
    1: 'Chưa đạt',
  }
  return labels[score] ?? 'Không xác định'
}

/**
 * Get milestone color class
 */
export function getMilestoneColorClass(level: string): string {
  const colors: Record<string, string> = {
    GREEN: 'bg-green-100 text-green-800',
    YELLOW: 'bg-yellow-100 text-yellow-800',
    ORANGE: 'bg-orange-100 text-orange-800',
    RED: 'bg-red-100 text-red-800',
    CRITICAL: 'bg-red-900 text-white',
  }
  return colors[level] ?? 'bg-gray-100 text-gray-800'
}

/**
 * Get severity badge class
 */
export function getSeverityBadgeClass(severity: string): string {
  const colors: Record<string, string> = {
    S1: 'bg-blue-100 text-blue-800',
    S2: 'bg-yellow-100 text-yellow-800',
    S3: 'bg-orange-100 text-orange-800',
    S4: 'bg-red-100 text-red-800',
    S5: 'bg-red-900 text-white',
  }
  return colors[severity] ?? 'bg-gray-100 text-gray-800'
}

/**
 * Task columns in warehouse_productivity_daily
 */
export const TASK_COLUMNS = {
  packing: { point: 'packing_point', quantity: 'packing_quantity' },
  picking: { point: 'picking_point', quantity: 'picking_quantity' },
  handover: { point: 'handover_point', quantity: 'handover_quantity' },
  putaway: { point: 'putaway_point', quantity: 'putaway_quantity' },
  inspection: { point: 'inspection_point', quantity: 'inspection_quantity' },
  co_inspection: { point: 'co_inspection_point', quantity: 'co_inspection_quantity' },
  data_entry: { point: 'data_entry_point', quantity: 'data_entry_quantity' },
  unloading: { point: 'unloading_point', quantity: 'unloading_cbm' },
  move: { point: 'move_point', quantity: 'move_quantity' },
  cycle_count: { point: 'cycle_count_point', quantity: 'cycle_count_quantity' },
  relabel: { point: 'relabel_point', quantity: 'relabel_quantity' },
} as const

export type TaskType = keyof typeof TASK_COLUMNS
