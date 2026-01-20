import { cn } from '../../lib/utils'
import type { PropsWithChildren } from 'hono/jsx'
import type { HtmlIntrinsicElements } from 'hono/jsx/dom'

// Helper type to allow any HTML attribute
type CardProps = PropsWithChildren<{ className?: string } & Record<string, any>>

export const Card = ({ className, children, ...props }: CardProps) => (
    <div
        className={cn(
            "rounded-lg border bg-card text-card-foreground shadow-sm",
            className
        )}
        {...props}
    >
        {children}
    </div>
)

export const CardHeader = ({ className, children, ...props }: CardProps) => (
    <div
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    >
        {children}
    </div>
)

export const CardTitle = ({ className, children, ...props }: CardProps) => (
    <h3
        className={cn(
            "text-2xl font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    >
        {children}
    </h3>
)

export const CardDescription = ({ className, children, ...props }: CardProps) => (
    <p
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    >
        {children}
    </p>
)

export const CardContent = ({ className, children, ...props }: CardProps) => (
    <div className={cn("p-6 pt-0", className)} {...props}>
        {children}
    </div>
)

export const CardFooter = ({ className, children, ...props }: CardProps) => (
    <div
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    >
        {children}
    </div>
)
