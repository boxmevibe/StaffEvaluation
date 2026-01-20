import type { FC, PropsWithChildren } from 'hono/jsx'
import { MobileHeader } from './MobileHeader'
import { MobileMenu } from './MobileMenu'

interface LayoutProps extends PropsWithChildren {
  title?: string
  activeTab?: 'employee' | 'manager' | 'admin' | 'payroll'
  warehouseCode?: string
  staffId?: string
  staffName?: string
}

export const Layout: FC<LayoutProps> = ({
  children,
  title,
  activeTab,
  warehouseCode,
  staffId,
  staffName
}) => {
  return (
    <div class="min-h-screen bg-gray-50">
      {/* Mobile Header & Menu */}
      <div class="md:hidden">
        <MobileHeader />
        <MobileMenu />
      </div>

      {/* Desktop Header */}
      <header class="hidden md:block bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <a href="/" class="flex items-center">
                <i class="fas fa-warehouse text-blue-600 text-2xl mr-3"></i>
                <span class="text-xl font-bold text-gray-900">Performance</span>
              </a>
            </div>

            {/* Navigation */}
            <nav class="hidden md:flex space-x-1">
              <a
                href="/employee"
                class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'employee'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <i class="fas fa-user mr-2"></i>
                Nhân viên
              </a>
              <a
                href="/manager"
                class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'manager'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <i class="fas fa-users-cog mr-2"></i>
                Quản lý
              </a>
              <a
                href="/admin"
                class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'admin'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <i class="fas fa-cogs mr-2"></i>
                Admin
              </a>
              <a
                href="/payroll"
                class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'payroll'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <i class="fas fa-money-check-alt mr-2"></i>
                Payroll
              </a>
            </nav>

            {/* Mode Toggle & User Info */}
            <div class="flex items-center space-x-4">
              {/* Demo/Production Mode Toggle */}
              <div class="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  id="mode-demo"
                  class="px-3 py-1 text-xs font-medium rounded-md transition-colors mode-toggle-btn"
                  data-mode="demo"
                >
                  <i class="fas fa-flask mr-1"></i>
                  Demo
                </button>
                <button
                  id="mode-prod"
                  class="px-3 py-1 text-xs font-medium rounded-md transition-colors mode-toggle-btn"
                  data-mode="api"
                >
                  <i class="fas fa-database mr-1"></i>
                  Production
                </button>
              </div>

              {warehouseCode && (
                <span class="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                  <i class="fas fa-building mr-1"></i>
                  {warehouseCode}
                </span>
              )}
              {staffName && (
                <span class="text-sm text-gray-700">
                  <i class="fas fa-user-circle mr-1"></i>
                  {staffName}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Page Title */}
      {title && (
        <div class="bg-white border-b border-gray-200">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 class="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer class="bg-white border-t border-gray-200 mt-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex justify-between items-center">
            <p class="text-sm text-gray-500">
              © 2025 Boxme Perfomance Management System v2.0
            </p>
            <div id="api-mode-indicator" class="text-xs px-2 py-1 rounded bg-amber-100 text-amber-800">
              <i class="fas fa-flask mr-1"></i>
              Demo Mode
            </div>
          </div>
        </div>
      </footer>

      {/* Mode Toggle Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
        // API Mode Management
        window.API_MODE = localStorage.getItem('kpi_api_mode') || 'demo';
        window.API_BASE = window.API_MODE === 'demo' ? '/demo' : '/api';
        
        function updateModeUI() {
          const demoBtn = document.getElementById('mode-demo');
          const prodBtn = document.getElementById('mode-prod');
          const indicator = document.getElementById('api-mode-indicator');
          
          if (window.API_MODE === 'demo') {
            demoBtn.classList.add('bg-amber-500', 'text-white');
            demoBtn.classList.remove('text-gray-600');
            prodBtn.classList.remove('bg-green-500', 'text-white');
            prodBtn.classList.add('text-gray-600');
            indicator.innerHTML = '<i class="fas fa-flask mr-1"></i>Demo Mode';
            indicator.className = 'text-xs px-2 py-1 rounded bg-amber-100 text-amber-800';
          } else {
            prodBtn.classList.add('bg-green-500', 'text-white');
            prodBtn.classList.remove('text-gray-600');
            demoBtn.classList.remove('bg-amber-500', 'text-white');
            demoBtn.classList.add('text-gray-600');
            indicator.innerHTML = '<i class="fas fa-database mr-1"></i>Production Mode';
            indicator.className = 'text-xs px-2 py-1 rounded bg-green-100 text-green-800';
          }
        }
        
        document.querySelectorAll('.mode-toggle-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            window.API_MODE = mode;
            window.API_BASE = mode === 'demo' ? '/demo' : '/api';
            localStorage.setItem('kpi_api_mode', mode);
            updateModeUI();
            
            // Show notification
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
            toast.innerHTML = mode === 'demo' 
              ? '<i class="fas fa-flask mr-2"></i>Switched to Demo Mode (No database required)'
              : '<i class="fas fa-database mr-2"></i>Switched to Production Mode (Requires Supabase)';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
          });
        });
        
        // Initialize mode UI on page load
        document.addEventListener('DOMContentLoaded', updateModeUI);
        updateModeUI();
      `}} />
    </div>
  )
}

// Stat Card Component
interface StatCardProps {
  title: string
  value: string | number
  icon: string
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  subtitle?: string
  trend?: {
    value: number
    label: string
  }
}

export const StatCard: FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = 'blue',
  subtitle,
  trend
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  }

  return (
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">{title}</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p class="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p class={`text-sm mt-2 ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <i class={`fas fa-arrow-${trend.value >= 0 ? 'up' : 'down'} mr-1`}></i>
              {Math.abs(trend.value).toFixed(1)} {trend.label}
            </p>
          )}
        </div>
        <div class={`${colorClasses[color]} p-4 rounded-xl`}>
          <i class={`${icon} text-white text-2xl`}></i>
        </div>
      </div>
    </div>
  )
}

// Ranking Badge Component
interface RankingBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export const RankingBadge: FC<RankingBadgeProps> = ({
  score,
  size = 'md',
  showLabel = false
}) => {
  const labels = {
    5: 'Xuất sắc',
    4: 'Tốt',
    3: 'Đạt',
    2: 'Cải thiện',
    1: 'Chưa đạt',
  }

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  }

  return (
    <div class="flex items-center gap-2">
      <div class={`ranking-${score} ${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
        {score}
      </div>
      {showLabel && (
        <span class="text-sm font-medium text-gray-700">
          {labels[score as keyof typeof labels]}
        </span>
      )}
    </div>
  )
}

// Alert Component
interface AlertProps {
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message?: string
}

export const Alert: FC<AlertProps> = ({ type, title, message }) => {
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  const icons = {
    success: 'fa-check-circle',
    warning: 'fa-exclamation-triangle',
    error: 'fa-times-circle',
    info: 'fa-info-circle',
  }

  return (
    <div class={`${typeClasses[type]} border rounded-lg p-4`}>
      <div class="flex items-start">
        <i class={`fas ${icons[type]} text-lg mr-3 mt-0.5`}></i>
        <div>
          <h4 class="font-medium">{title}</h4>
          {message && <p class="text-sm mt-1 opacity-80">{message}</p>}
        </div>
      </div>
    </div>
  )
}

// Table Component
interface TableProps {
  headers: string[]
  children: any
}

export const Table: FC<TableProps> = ({ headers, children }) => {
  return (
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              {headers.map((header, i) => (
                <th key={i} class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Milestone Badge Component
interface MilestoneBadgeProps {
  level: string
  points?: number
}

export const MilestoneBadge: FC<MilestoneBadgeProps> = ({ level, points }) => {
  const colorClasses: Record<string, string> = {
    GREEN: 'bg-green-100 text-green-800',
    YELLOW: 'bg-yellow-100 text-yellow-800',
    ORANGE: 'bg-orange-100 text-orange-800',
    RED: 'bg-red-100 text-red-800',
    CRITICAL: 'bg-red-900 text-white',
  }

  return (
    <span class={`${colorClasses[level] || 'bg-gray-100 text-gray-800'} px-3 py-1 rounded-full text-sm font-medium`}>
      {level}
      {points !== undefined && ` (${points})`}
    </span>
  )
}
