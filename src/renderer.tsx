import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html lang="vi">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'KPI Warehouse Management System'}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <style>{`
          .fade-in { animation: fadeIn 0.3s ease-in; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .slide-up { animation: slideUp 0.3s ease-out; }
          @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          .ranking-5 { background: linear-gradient(135deg, #10b981, #059669); }
          .ranking-4 { background: linear-gradient(135deg, #3b82f6, #2563eb); }
          .ranking-3 { background: linear-gradient(135deg, #f59e0b, #d97706); }
          .ranking-2 { background: linear-gradient(135deg, #f97316, #ea580c); }
          .ranking-1 { background: linear-gradient(135deg, #ef4444, #dc2626); }
        `}</style>
      </head>
      <body class="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
})
