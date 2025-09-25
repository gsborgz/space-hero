import { concatClassNames } from '@lib/utils';

export default function Separator({ className }: { className?: string }) {
  return (
    <hr className={concatClassNames('my-4 border-gray-200 dark:border-gray-700', className)} />
  );
}
