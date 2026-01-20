import { Button } from './ui/Button'
import { cn } from '../lib/utils'

export const MobileMenu = () => {
    return (
        <>
            {/* Overlay - Hidden by default */}
            <div
                id="mobile-menu-overlay"
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 hidden"
            // onclick handler will be added via script
            />

            {/* Sheet Content - Hidden/Off-screen by default */}
            <div
                id="mobile-menu-content"
                className={cn(
                    "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
                    "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
                    "hidden" // Start hidden, JS will toggle flex/block and data-state
                )}
            >
                <div className="flex flex-col space-y-2 text-center sm:text-left">
                    <div className="flex flex-col space-y-2 mt-4">
                        <h2 className="text-lg font-semibold text-foreground">Menu</h2>
                        <p className="text-sm text-muted-foreground">Truy cập nhanh các chức năng</p>
                    </div>
                </div>

                <div className="grid gap-4 py-4">
                    <Button variant="ghost" className="justify-start" href="/">
                        <i className="fa-solid fa-house mr-2"></i> Trang chủ
                    </Button>
                    <Button variant="ghost" className="justify-start" href="/employee">
                        <i className="fa-solid fa-user mr-2"></i> Nhân viên
                    </Button>
                    <Button variant="ghost" className="justify-start" href="/manager">
                        <i className="fa-solid fa-users-gear mr-2"></i> Quản lý
                    </Button>
                    <Button variant="ghost" className="justify-start" href="/admin">
                        <i className="fa-solid fa-screwdriver-wrench mr-2"></i> Admin
                    </Button>
                    <Button variant="ghost" className="justify-start" href="/payroll">
                        <i className="fa-solid fa-money-bill mr-2"></i> Payroll
                    </Button>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                    <Button variant="outline" className="w-full" id="mobile-menu-close">
                        Đóng
                    </Button>
                </div>
            </div>

            {/* Script to handle toggle */}
            <script dangerouslySetInnerHTML={{
                __html: `
        document.addEventListener('DOMContentLoaded', () => {
          const trigger = document.getElementById('mobile-menu-trigger');
          const closeBtn = document.getElementById('mobile-menu-close');
          const overlay = document.getElementById('mobile-menu-overlay');
          const content = document.getElementById('mobile-menu-content');
          
          function toggleMenu(open) {
             if (open) {
                overlay.classList.remove('hidden');
                content.classList.remove('hidden');
                // Small delay to allow display:block to apply before animation
                setTimeout(() => {
                  overlay.setAttribute('data-state', 'open');
                  content.setAttribute('data-state', 'open');
                }, 10);
             } else {
                overlay.setAttribute('data-state', 'closed');
                content.setAttribute('data-state', 'closed');
                
                // Wait for animation to finish before hiding
                setTimeout(() => {
                   overlay.classList.add('hidden');
                   content.classList.add('hidden');
                }, 300);
             }
          }

          trigger?.addEventListener('click', () => toggleMenu(true));
          closeBtn?.addEventListener('click', () => toggleMenu(false));
          overlay?.addEventListener('click', () => toggleMenu(false));
        });
      `}} />
        </>
    )
}
