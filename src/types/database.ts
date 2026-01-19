// Database Types for KPI Warehouse Management System

export interface Database {
  public: {
    Tables: {
      // ==================== INPUT TABLES (Existing) ====================
      warehouse_productivity_daily: {
        Row: WarehouseProductivityDaily
        Insert: Partial<WarehouseProductivityDaily>
        Update: Partial<WarehouseProductivityDaily>
      }
      payroll_monthly: {
        Row: PayrollMonthly
        Insert: Partial<PayrollMonthly>
        Update: Partial<PayrollMonthly>
      }
      kpi_master: {
        Row: KpiMaster
        Insert: Partial<KpiMaster>
        Update: Partial<KpiMaster>
      }
      kpi_range: {
        Row: KpiRange
        Insert: Partial<KpiRange>
        Update: Partial<KpiRange>
      }

      // ==================== CONFIG TABLES (New) ====================
      role_main_task_config: {
        Row: RoleMainTaskConfig
        Insert: Omit<RoleMainTaskConfig, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<RoleMainTaskConfig>
      }
      ranking_range_config: {
        Row: RankingRangeConfig
        Insert: Omit<RankingRangeConfig, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<RankingRangeConfig>
      }
      kpi_bonus_config: {
        Row: KpiBonusConfig
        Insert: Omit<KpiBonusConfig, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<KpiBonusConfig>
      }
      ors_catalog: {
        Row: OrsCatalog
        Insert: Omit<OrsCatalog, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<OrsCatalog>
      }
      ors_milestone_config: {
        Row: OrsMilestoneConfig
        Insert: Omit<OrsMilestoneConfig, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<OrsMilestoneConfig>
      }

      // ==================== FACT/RESULT TABLES (New) ====================
      kpi_weekly_summary: {
        Row: KpiWeeklySummary
        Insert: Omit<KpiWeeklySummary, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<KpiWeeklySummary>
      }
      ranking_weekly_result: {
        Row: RankingWeeklyResult
        Insert: Omit<RankingWeeklyResult, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<RankingWeeklyResult>
      }
      ors_event: {
        Row: OrsEvent
        Insert: Omit<OrsEvent, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<OrsEvent>
      }
      ors_monthly_summary: {
        Row: OrsMonthlySummary
        Insert: Omit<OrsMonthlySummary, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<OrsMonthlySummary>
      }
      kpi_monthly_summary: {
        Row: KpiMonthlySummary
        Insert: Omit<KpiMonthlySummary, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<KpiMonthlySummary>
      }

      // ==================== OUTPUT TABLE ====================
      payroll_kpi_bridge: {
        Row: PayrollKpiBridge
        Insert: Omit<PayrollKpiBridge, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<PayrollKpiBridge>
      }
    }
  }
}

// ==================== INPUT TYPES ====================
export interface WarehouseProductivityDaily {
  id: number
  warehouse_code: string
  warehouse_name: string | null
  staff_id: string
  staff_name: string | null
  date: string // YYYY-MM-DD
  // Packing
  packing_point: number | null
  packing_quantity: number | null
  // Picking  
  picking_point: number | null
  picking_quantity: number | null
  // Handover
  handover_point: number | null
  handover_quantity: number | null
  // Putaway
  putaway_point: number | null
  putaway_quantity: number | null
  // Inspection
  inspection_point: number | null
  inspection_quantity: number | null
  // Co-inspection
  co_inspection_point: number | null
  co_inspection_quantity: number | null
  // Data entry
  data_entry_point: number | null
  data_entry_quantity: number | null
  // Unloading
  unloading_point: number | null
  unloading_cbm: number | null
  // Move
  move_point: number | null
  move_quantity: number | null
  // Cycle count
  cycle_count_point: number | null
  cycle_count_quantity: number | null
  // Relabel
  relabel_point: number | null
  relabel_quantity: number | null
  // Totals
  total_point: number | null
  created_at: string
  updated_at: string
}

export interface PayrollMonthly {
  id: number
  warehouse_code: string
  staff_id: string
  staff_name: string | null
  payroll_period: string // YYYY-MM
  role: number | null
  role_name: string | null
  work_hour: number | null
  actual_workdays: number | null
  status: string | null
  // KPI fields (to be updated by new system)
  major_kpi: number | null
  rating_factor: number | null
  kpi_bonus: number | null
  penalty: number | null
  created_at: string
  updated_at: string
}

export interface KpiMaster {
  id: number
  warehouse_code: string
  work_type: number
  reference_type: string | null
  unit: string | null
  point_type: string | null
  created_at: string
}

export interface KpiRange {
  id: number
  kpi_id: number
  start_range: number
  end_range: number
  point: number
  next_unit: number | null
}

// ==================== CONFIG TYPES ====================
export interface RoleMainTaskConfig {
  id: number
  warehouse_code: string | null // null = apply to all warehouses
  role: string
  role_id: number | null
  main_task: MainTaskType
  effective_from: string
  effective_to: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RankingRangeConfig {
  id: number
  warehouse_code: string | null
  role: string | null
  main_task: MainTaskType | null
  pph_min: number
  pph_max: number
  ranking_score: number // 1-5
  min_weekly_hours: number | null
  min_weekly_points: number | null
  effective_from: string
  effective_to: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface KpiBonusConfig {
  id: number
  warehouse_code: string | null
  country: string | null
  ranking_score_min: number
  ranking_score_max: number
  calculation_type: 'PER_POINT' | 'FIXED'
  amount_per_point: number | null
  fixed_amount: number | null
  cap_amount: number | null
  currency: string
  effective_from: string
  effective_to: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface OrsCatalog {
  id: number
  ors_code: string // Unique code like PACK-001
  job_group: JobGroup
  name: string
  description: string | null
  severity_level: SeverityLevel
  ors_points: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface OrsMilestoneConfig {
  id: number
  warehouse_code: string | null // null = global
  ors_points_from: number
  ors_points_to: number
  milestone_level: MilestoneLevel
  action_type: string
  penalty_rate: number // 0-1
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// ==================== FACT/RESULT TYPES ====================
export interface KpiWeeklySummary {
  id: number
  warehouse_code: string
  warehouse_name: string | null
  staff_id: string
  staff_name: string | null
  role: string | null
  year_week: string // YYYY-Www format
  week_start: string
  week_end: string
  payroll_period: string
  main_task: MainTaskType | null
  main_task_points: number
  main_task_quantity: number | null
  task_points_detail: TaskPointsDetail
  total_points: number
  total_quantity: number | null
  estimated_work_hours: number
  working_days: number
  pph: number // Points Per Hour
  data_status: DataStatus
  created_at: string
  updated_at: string
}

export interface RankingWeeklyResult {
  id: number
  warehouse_code: string
  staff_id: string
  staff_name: string | null
  year_week: string
  week_start: string
  week_end: string
  pph: number
  main_task_points: number
  estimated_work_hours: number
  ranking_score: number // 1-5
  ranking_config_id: number | null
  status: RankingStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrsEvent {
  id: number
  warehouse_code: string
  staff_id: string
  staff_name: string | null
  event_date: string
  event_time: string | null
  ors_code: string
  ors_points: number // Snapshot at time of creation
  description: string | null
  evidence_urls: string[] | null
  reported_by: string
  reviewed_by: string | null
  reviewed_at: string | null
  status: OrsEventStatus
  rejection_reason: string | null
  original_ors_code: string | null // If adjusted
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrsMonthlySummary {
  id: number
  warehouse_code: string
  staff_id: string
  staff_name: string | null
  payroll_period: string
  ors_points_total: number
  event_count: number
  events_detail: OrsEventDetail[]
  milestone_level: MilestoneLevel
  penalty_rate: number
  created_at: string
  updated_at: string
}

export interface KpiMonthlySummary {
  id: number
  warehouse_code: string
  warehouse_name: string | null
  staff_id: string
  staff_name: string | null
  role: string | null
  payroll_period: string
  major_kpi: number
  total_kpi_points: number
  task_points_monthly: TaskPointsDetail
  weekly_rankings: WeeklyRankingDetail[]
  avg_ranking_score: number
  final_ranking_score: number
  rating_factor: number
  kpi_bonus_calculated: number
  ors_points_total: number
  ors_penalty_rate: number
  kpi_bonus_final: number
  actual_workdays: number | null
  work_hours: number | null
  status: KpiMonthlyStatus
  created_at: string
  updated_at: string
}

// ==================== OUTPUT TYPE ====================
export interface PayrollKpiBridge {
  id: number
  warehouse_code: string
  payroll_period: string
  staff_id: string
  major_kpi: number
  rating_factor: number
  kpi_bonus: number
  work_hour_kpi_bonus: number | null
  vas_kpi_bonus: number | null
  kpi_allowance: number | null
  penalty: number | null
  calculation_version: string
  calculated_at: string
  applied_to_payroll: boolean
  applied_at: string | null
  created_at: string
  updated_at: string
}

// ==================== ENUMS & SUPPORTING TYPES ====================
export type MainTaskType = 
  | 'packing' 
  | 'picking' 
  | 'handover' 
  | 'putaway' 
  | 'inspection' 
  | 'co_inspection' 
  | 'data_entry' 
  | 'unloading' 
  | 'move' 
  | 'cycle_count' 
  | 'relabel'

export type JobGroup = 
  | 'packing' 
  | 'picking' 
  | 'handover' 
  | 'putaway' 
  | 'inspection' 
  | 'co_inspection' 
  | 'data_entry' 
  | 'unloading' 
  | 'move' 
  | 'cycle_count' 
  | 'relabel'

export type SeverityLevel = 'S1' | 'S2' | 'S3' | 'S4' | 'S5'

export type MilestoneLevel = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' | 'CRITICAL'

export type DataStatus = 'OK' | 'INSUFFICIENT_HOURS' | 'NO_DATA' | 'PARTIAL_DATA'

export type RankingStatus = 'FINAL' | 'INSUFFICIENT_DATA' | 'PENDING_REVIEW' | 'ADJUSTED'

export type OrsEventStatus = 'OPEN' | 'CONFIRMED' | 'REJECTED' | 'ADJUSTED'

export type KpiMonthlyStatus = 'DRAFT' | 'CALCULATED' | 'REVIEWED' | 'FINAL' | 'LOCKED'

export interface TaskPointsDetail {
  packing?: { points: number; quantity: number }
  picking?: { points: number; quantity: number }
  handover?: { points: number; quantity: number }
  putaway?: { points: number; quantity: number }
  inspection?: { points: number; quantity: number }
  co_inspection?: { points: number; quantity: number }
  data_entry?: { points: number; quantity: number }
  unloading?: { points: number; cbm: number }
  move?: { points: number; quantity: number }
  cycle_count?: { points: number; quantity: number }
  relabel?: { points: number; quantity: number }
}

export interface OrsEventDetail {
  event_id: number
  event_date: string
  ors_code: string
  ors_points: number
  description: string | null
}

export interface WeeklyRankingDetail {
  year_week: string
  ranking_score: number
  pph: number
  work_hours: number
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ==================== WAREHOUSE LIST ====================
export const WAREHOUSES = {
  // Vietnam
  BMVN_HCM_TP: { name: 'Boxme T.Tạo', country: 'VN', currency: 'VND' },
  BMVN_HCM_TT: { name: 'Boxme L.Minh Xuân', country: 'VN', currency: 'VND' },
  BMVN_HN_LB: { name: 'Boxme L.Biên', country: 'VN', currency: 'VND' },
  BMVN_BN_VSIP: { name: 'Boxme VSIP - B.Ninh', country: 'VN', currency: 'VND' },
  BMVN_HCM_BTN: { name: 'Boxme B.Tân', country: 'VN', currency: 'VND' },
  BMVN_HN_TT: { name: 'Boxme T.Triều', country: 'VN', currency: 'VND' },
  // Thailand
  BMTH_KRB: { name: 'Boxme Thailand', country: 'TH', currency: 'THB' },
  // Philippines
  BMPH_PDC: { name: 'PDC - ONLINE', country: 'PH', currency: 'PHP' },
  BMPH_PDC_OFF: { name: 'PDC - OFFLINE', country: 'PH', currency: 'PHP' },
  BMPH_PDC_ON_SB: { name: 'PDC - ONLINE SB', country: 'PH', currency: 'PHP' },
  BMPH_PDC_OFF_SB: { name: 'PDC - OFFLINE SB', country: 'PH', currency: 'PHP' },
  // Indonesia
  BMID_ST: { name: 'Boxme Jakarta', country: 'ID', currency: 'IDR' },
  // Malaysia
  BMMY_PJS: { name: 'Boxme Malaysia', country: 'MY', currency: 'MYR' },
} as const

export type WarehouseCode = keyof typeof WAREHOUSES

// ==================== RATING FACTOR MAPPING ====================
export const RATING_FACTOR_MAP: Record<number, number> = {
  5: 1.00,
  4: 0.95,
  3: 0.85,
  2: 0.70,
  1: 0.50,
}

// ==================== DEFAULT PPH RANKING THRESHOLDS ====================
export const DEFAULT_PPH_THRESHOLDS = [
  { pph_min: 50, pph_max: 999999, ranking_score: 5 },
  { pph_min: 40, pph_max: 49.99, ranking_score: 4 },
  { pph_min: 30, pph_max: 39.99, ranking_score: 3 },
  { pph_min: 20, pph_max: 29.99, ranking_score: 2 },
  { pph_min: 0, pph_max: 19.99, ranking_score: 1 },
]

// ==================== ORS MILESTONE DEFAULTS ====================
export const DEFAULT_ORS_MILESTONES = [
  { points_from: 0, points_to: 9, level: 'GREEN' as MilestoneLevel, penalty_rate: 0 },
  { points_from: 10, points_to: 19, level: 'YELLOW' as MilestoneLevel, penalty_rate: 0 },
  { points_from: 20, points_to: 29, level: 'ORANGE' as MilestoneLevel, penalty_rate: 0.10 },
  { points_from: 30, points_to: 39, level: 'RED' as MilestoneLevel, penalty_rate: 0.30 },
  { points_from: 40, points_to: 999999, level: 'CRITICAL' as MilestoneLevel, penalty_rate: 1.00 },
]
