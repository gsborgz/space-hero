import { concatClassNames } from '@lib/utils';

export default function Input({ className, type = 'text', ...props }: React.InputHTMLAttributes<HTMLInputElement> & { className?: string; type?: string }) {
  const baseClasses = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';

  return (
    <input
      type={type}
      className={concatClassNames(baseClasses, className)}
      {...props}
    />
  );
}
