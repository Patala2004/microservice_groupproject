import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');


const buttonVariants = cva(
    // REMOVED 'rounded-md' from base to ensure size variants take precedence
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive:
                    "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
                outline:
                    "border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
                error_outline:
                    "border border-destructive bg-background text-red-500 border-red-500 cursor-pointer hover:text-white hover:bg-red-400",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost:
                    "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
                link: "text-primary underline-offset-4 hover:underline",
                "gradient-fire":
                    "text-white bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 font-bold " +
                    "shadow-lg shadow-red-900/40 hover:shadow-red-900/60 " +
                    "hover:from-rose-500 hover:via-red-500 hover:to-orange-400 " +
                    "hover:-translate-y-[2px] rounded-xl",
                "outline-soft-red":
                    "bg-white border-red-600/40 text-red-700 dark:text-red-400 font-semibold " +
                    "hover:bg-gray-300 hover:text-red-800 " +
                    "hover:-translate-y-[2px] shadow-sm rounded-xl",
                "profile-button":
                    "flex items-center gap-2 h-auto text-sm font-medium " +
                    "px-3 py-1 !rounded-full " +
                    "bg-neutral-100 dark:bg-neutral-900 " +
                    "border border-neutral-200 dark:border-neutral-800 " +
                    "hover:bg-neutral-200 dark:hover:bg-neutral-800 " +
                    "shadow-sm",
                "logout":
                    "text-white bg-red-800 hover:bg-red-700 font-bold " +
                    "shadow-lg shadow-red-900/40 hover:shadow-red-900/60 " +
                    "hover:-translate-y-[2px] rounded-xl",
                "delete":
                    "bg-red-600 text-white hover:bg-red-500 font-semibold " +
                    "shadow-md shadow-red-900/30 hover:shadow-red-900/50 " +
                    "hover:-translate-y-[2px] rounded-lg",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3 rounded-md",
                sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5 rounded-md",
                lg: "h-10 px-6 has-[>svg]:px-4 rounded-md",
                icon: "size-9 rounded-md",

                "main-button": "h-12 text-xl w-full px-6 has-[>svg]:px-4 rounded-xl",
                "secondary-button":
                    "h-10 text-lg w-full px-5 has-[>svg]:px-3.5 rounded-xl",
                "full-width": "w-full h-12 text-xl px-5 mt-2 has-[>svg]:px-3.5 rounded-xl",

            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

function Button({
                    className,
                    variant,
                    size,
                    asChild = false,
                    ...props
                }: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
    asChild?: boolean
}) {
    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
}

export { Button, buttonVariants }