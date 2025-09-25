import * as React from 'react'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { concatClassNames } from '@lib/utils'

interface SelectContextType {
  value?: any
  onValueChange?: (value: any) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  disabled?: boolean
  valueLabels: Map<string, string>
  setValueLabel: (value: string, label: string) => void
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined)

const useSelectContext = () => {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error('Select components must be used within a Select')
  }
  return context
}

interface SelectProps {
  options?: { value: any; label: string }[]
  children?: React.ReactNode
  onValueChange?: (value: any) => void
  defaultValue?: any
  value?: any
  disabled?: boolean
  placeholder?: string
}

const Select = ({ children, value, onValueChange, disabled, defaultValue, options, placeholder }: SelectProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [open, setOpen] = React.useState(false)
  const [valueLabels, setValueLabels] = React.useState<Map<string, string>>(new Map())

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const handleValueChange = React.useCallback((newValue: any) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
    setOpen(false)
  }, [isControlled, onValueChange])

  const setValueLabel = React.useCallback((value: string, label: string) => {
    setValueLabels(prev => new Map(prev).set(value, label))
  }, [])

  const contextValue = React.useMemo(() => ({
    value: currentValue,
    onValueChange: handleValueChange,
    open,
    onOpenChange: setOpen,
    disabled,
    valueLabels,
    setValueLabel
  }), [currentValue, handleValueChange, open, disabled, valueLabels, setValueLabel])

  // Se options são fornecidas, renderiza um select completo
  if (options) {
    const selectedOption = options.find(option => {
      // Comparação mais robusta para objetos complexos
      if (typeof option.value === 'object' && typeof currentValue === 'object') {
        return JSON.stringify(option.value) === JSON.stringify(currentValue)
      }
      return option.value === currentValue
    })

    return (
      <SelectContext.Provider value={contextValue}>
        <div className="relative">
          <SelectTrigger>
            <SelectValue placeholder={placeholder}>
              {selectedOption?.label || placeholder || 'Select an option...'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {options.map((option, index) => (
              <SelectItem key={index} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </div>
      </SelectContext.Provider>
    )
  }

  // Caso contrário, usa children (forma composta)
  return (
    <SelectContext.Provider value={contextValue}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectGroup = ({ children }: { children: React.ReactNode }) => (
  <div role="group">
    {children}
  </div>
)

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string; children?: React.ReactNode }
>(({ className, placeholder, children, ...props }, ref) => {
  const { value, valueLabels } = useSelectContext()
  
  const displayValue = React.useMemo(() => {
    if (!value) return undefined
    
    const valueKey = typeof value === 'object' ? JSON.stringify(value) : String(value)
    return valueLabels.get(valueKey) || valueKey
  }, [value, valueLabels])
  
  return (
    <span
      ref={ref}
      className={concatClassNames('line-clamp-1', className)}
      {...props}
    >
      {children || displayValue || placeholder}
    </span>
  )
})
SelectValue.displayName = 'SelectValue'

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { open, onOpenChange, disabled } = useSelectContext()

  const handleClick = () => {
    if (!disabled) {
      onOpenChange(!open)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <button
      ref={ref}
      type="button"
      className={concatClassNames(
        'flex h-10 w-full items-center cursor-pointer justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-expanded={open}
      aria-haspopup="listbox"
      {...props}
    >
      {children}
      <ChevronDown className='h-4 w-4 opacity-50' />
    </button>
  )
})
SelectTrigger.displayName = 'SelectTrigger'

const SelectScrollUpButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={concatClassNames(
      'flex cursor-default items-center justify-center py-1',
      className
    )}
    {...props}
  >
    <ChevronUp className='h-4 w-4' />
  </button>
))
SelectScrollUpButton.displayName = 'SelectScrollUpButton'

const SelectScrollDownButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={concatClassNames(
      'flex cursor-default items-center justify-center py-1',
      className
    )}
    {...props}
  >
    <ChevronDown className='h-4 w-4' />
  </button>
))
SelectScrollDownButton.displayName = 'SelectScrollDownButton'

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { position?: 'item-aligned' | 'popper' }
>(({ className, children, position = 'popper', ...props }, ref) => {
  const { open, onOpenChange } = useSelectContext()
  const contentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        onOpenChange(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div
      ref={contentRef}
      className={concatClassNames(
        'absolute z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border dark:bg-slate-950 bg-slate-50 dark:text-slate-50 text-slate-950 shadow-md animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' && 'top-full mt-1',
        className
      )}
      role="listbox"
      {...props}
    >
      <div className="p-1 max-h-80 overflow-auto">
        {children}
      </div>
    </div>
  )
})
SelectContent.displayName = 'SelectContent'

const SelectLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={concatClassNames('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
    {...props}
  />
))
SelectLabel.displayName = 'SelectLabel'

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: any; disabled?: boolean, isMultiple?: boolean }
>(({ className, children, value, disabled, isMultiple, ...props }, ref) => {
  const { value: selectedValue, onValueChange, setValueLabel } = useSelectContext()
  
  // Comparação mais robusta para objetos complexos
  const isSelected = React.useMemo(() => {
    if (typeof value === 'object' && typeof selectedValue === 'object') {
      return JSON.stringify(value) === JSON.stringify(selectedValue)
    }
    return selectedValue === value
  }, [selectedValue, value])

  // Registra a label para este valor no contexto
  React.useEffect(() => {
    const valueKey = typeof value === 'object' ? JSON.stringify(value) : String(value)
    let label = valueKey
    if (typeof children === 'string') {
      label = children
    } else if (React.isValidElement(children)) {
      // Tenta extrair texto dos children
      const extractText = (element: React.ReactNode): string => {
        if (typeof element === 'string') return element
        if (typeof element === 'number') return element.toString()
        if (React.isValidElement(element) && element.props) {
          return extractText((element.props as any).children) || valueKey
        }
        return valueKey
      }
      label = extractText(children)
    }
    setValueLabel(valueKey, label)
  }, [value, children, setValueLabel])

  const handleClick = () => {
    if (!disabled) {
      onValueChange?.(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={isSelected}
      className={concatClassNames(
        'relative flex w-full cursor-pointer select-none items-center rounded-sm p-2 text-sm outline-none text-slate-950 dark:text-slate-50 hover:bg-slate-300 dark:hover:bg-slate-700 focus:bg-slate-300 dark:focus:bg-slate-700',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {isMultiple && (
        <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
          {isSelected && <Check className='h-4 w-4' />}
        </span>
      )}
      {children}
    </div>
  )
})
SelectItem.displayName = 'SelectItem'

const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={concatClassNames('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
))
SelectSeparator.displayName = 'SelectSeparator'

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
