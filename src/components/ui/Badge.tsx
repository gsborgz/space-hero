import { concatClassNames } from '@lib/utils';

export default function Badge({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
  const baseClasses = 'inline-flex items-center px-1 md:px-3 py-1 text-xs md:text-sm font-medium rounded-full';

  return (
    <span className={concatClassNames(baseClasses, className)} onClick={onClick}>
      {children}
    </span>
  );
}
