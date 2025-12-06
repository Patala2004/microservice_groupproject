import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');


const cardVariants = cva(
    "shadow-md",
    {
      variants: {
        variant: {
          default: "rounded-xl border bg-card text-card-foreground shadow",
            "form-theme": `w-full max-w-xl
                            bg-gradient-to-br from-neutral-600 via-neutral-950 to-black
                            border border-neutral-800
                            rounded-2xl
                            shadow-xl shadow-black/40
                            px-8 pt-7 pb-3
                            flex flex-col items-center
                            backdrop-blur`
        },
      },
      defaultVariants: {
        variant: "default",
      },
    }
);

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>
>(({ className, variant, ...props }, ref) => (
    <div
        ref={ref}
        // Apply card variants here
        className={cn(cardVariants({ variant, className }))}
        {...props}
    />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    // Base padding removed to allow form component to define its own spacing
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("font-semibold leading-none tracking-tight", className)}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }