import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const marsButtonVariants = cva(
  "transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow hover:shadow-mars",
        hero: "bg-gradient-performance text-primary-foreground hover:scale-105 animate-pulse-glow shadow-glow",
        ghost: "hover:bg-mars-blue-secondary/50 text-foreground",
        outline: "border-primary text-primary hover:bg-primary/10",
        mars: "bg-mars-blue-secondary hover:bg-mars-blue-secondary/90 text-foreground border border-mars-blue-secondary",
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