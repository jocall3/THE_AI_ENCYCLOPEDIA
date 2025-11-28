import React from 'react';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("inline-flex items-center rounded-full border border-cyan-500/50 px-2.5 py-0.5 text-xs font-semibold text-cyan-300 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}
      {...props}
    />
  );
}

export { Badge };
