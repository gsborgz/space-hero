import * as React from 'react';
import { concatClassNames } from '@lib/utils';

// Interfaces e Tipagens
interface DropdownMenuContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

// Context e Utilitários
const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(null);

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);

  if (!context) {
    throw new Error('useDropdownMenu must be used within a DropdownMenu');
  }

  return context;
}

function getAlignClass(align: 'start' | 'center' | 'end') {
  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0'
  };
  return alignClasses[align];
}

// Components
function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      if (!target.closest('[data-dropdown-menu]')) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [open]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className='relative' data-dropdown-menu>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

function DropdownMenuTrigger({ asChild, children }: DropdownMenuTriggerProps) {
  const { open, setOpen } = useDropdownMenu();

  function handleClick() {
    setOpen(!open);
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      'aria-expanded': open,
      'aria-haspopup': 'menu'
    } as any);
  }

  return (
    <button
      type='button'
      onClick={handleClick}
      aria-expanded={open}
      aria-haspopup='menu'
    >
      {children}
    </button>
  );
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(({ children, className, align = 'start' }, ref) => {
  const { open } = useDropdownMenu();

  if (!open) return null;

  const alignClass = getAlignClass(align);

  return (
    <div
      ref={ref}
      className={concatClassNames(
        'absolute top-full mt-1 z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-400 dark:bg-slate-950 bg-slate-50 dark:text-slate-50 text-slate-950 p-1',
        alignClass,
        className
      )}
    >
      {children}
    </div>
  );
});

DropdownMenuContent.displayName = 'DropdownMenuContent';

const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(({ children, className, onClick, ...props }, ref) => {
  const { setOpen } = useDropdownMenu();

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    onClick?.(event);
    setOpen(false);
  }

  return (
    <div
      ref={ref}
      className={concatClassNames(
        'flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors text-slate-950 dark:text-slate-50 hover:bg-slate-300 dark:hover:bg-slate-700 focus:bg-slate-300 dark:focus:bg-slate-700',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
});

DropdownMenuItem.displayName = 'DropdownMenuItem';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
};
