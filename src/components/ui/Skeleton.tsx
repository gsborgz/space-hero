import { concatClassNames } from '@lib/utils'

export default function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={concatClassNames('animate-pulse rounded-md bg-muted bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950', className)}
      {...props}
    />
  )
}
