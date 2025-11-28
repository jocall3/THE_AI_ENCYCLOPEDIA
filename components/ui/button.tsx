import React from 'react';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const buttonVariants = {
  variant: {
    default: "bg-cyan-600 text-white hover:bg-cyan-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-cyan-500 bg-transparent hover:bg-cyan-500/10 text-cyan-400",
    secondary: "bg-gray-700 text-white hover:bg-gray-600",
    ghost: "hover:bg-gray-700",
    link: "text-cyan-400 underline-offset-4 hover:underline",
  },
  size: {
    default: "h-10 py-2 px-4",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  },
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:opacity-50 disabled:pointer-events-none",
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
