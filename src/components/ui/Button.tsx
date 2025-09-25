import * as React from 'react';
import { concatClassNames } from '@lib/utils';

// Interfaces e Tipagens
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'default';
  size?: 'icon' | 'default';
  primary?: boolean;
  asChild?: boolean;
}

function getVariantClasses(variant: ButtonProps['variant'], primary?: boolean) {
  const defaultBackground = primary
    ? 'bg-slate-950 dark:bg-slate-50 text-primary-reversed'
    : 'hover:bg-slate-300/30 dark:hover:bg-slate-700/30 text-primary';
  const variants = {
    ghost: 'hover:bg-slate-300/30 dark:hover:bg-slate-700/30 text-slate-950 dark:text-slate-50',
    default: defaultBackground
  };
  return variants[variant || 'default'];
}

function getSizeClasses(size: ButtonProps['size']) {
  const sizes = {
    icon: 'h-9 w-9 p-2',
    default: 'h-10 px-4 py-2'
  };
  return sizes[size || 'default'];
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((
  { className, variant, size, primary, asChild = false, children, ...props }, ref) => {
    const baseClasses = 'cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const variantClasses = getVariantClasses(variant, primary);
    const sizeClasses = getSizeClasses(size);
    
    const buttonClasses = concatClassNames(
      baseClasses,
      variantClasses,
      sizeClasses,
      className
    );

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: buttonClasses,
        ...props
      });
    }

    return (
      <button
        className={buttonClasses}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
