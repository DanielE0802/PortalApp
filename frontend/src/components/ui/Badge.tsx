import { cva, type VariantProps } from "class-variance-authority";
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex items-center rounded-full text-xs font-medium border",
  {
    variants: {
      variant: {
        saved: "bg-[var(--badge-saved-bg)] text-[var(--badge-saved-text)] border-transparent",
        notSaved: "bg-muted text-muted-foreground border-border",
        id: "border-[var(--badge-id-border)] bg-transparent text-foreground",
        count: "bg-primary text-primary-foreground border-transparent",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "notSaved",
      size: "sm",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ variant, size, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    />
  );
}
