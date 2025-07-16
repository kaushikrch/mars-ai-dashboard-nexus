import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const marsButtonVariants = cva(
  "transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-glow",
        hero: "bg-gradient-performance text-primary-foreground hover:scale-105 shadow-glow",
        ghost: "hover:bg-secondary/80 text-foreground",
        outline: "border-border text-primary hover:bg-primary/5",
        mars: "bg-secondary hover:bg-secondary/80 text-foreground border border-border/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface MarsButtonProps extends Omit<ButtonProps, 'variant'>, VariantProps<typeof marsButtonVariants> {}

export const MarsButton = ({ className, variant, ...props }: MarsButtonProps) => {
  return (
    <Button
      className={cn(marsButtonVariants({ variant }), className)}
      {...props}
    />
  );
};