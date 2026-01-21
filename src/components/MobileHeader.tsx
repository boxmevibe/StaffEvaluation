import { Button } from './ui/Button'

export const MobileHeader = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center gap-4 px-4">
                {/* Hamburger Trigger - Large touch target (48x48 min) */}
                <Button variant="ghost" size="icon" className="md:hidden w-10 h-10 -ml-2" id="mobile-menu-trigger">
                    <i className="fa-solid fa-bars text-xl"></i>
                    <span className="sr-only">Mở Menu</span>
                </Button>

                <a href="/" className="flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    <span className="font-bold text-lg tracking-tight">Performance</span>
                </a>
            </div>
        </header>
    )
}

