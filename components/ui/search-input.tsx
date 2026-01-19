import { Search } from 'lucide-react'
import { Input } from './input'
import { cn } from '@/lib/utils'

interface SearchInputProps extends React.ComponentProps<typeof Input> {
  containerClassName?: string
}

export function SearchInput({ containerClassName, className, ...props }: SearchInputProps) {
  return (
    <div className={cn('relative', containerClassName)}>
      <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input className={cn('pl-9', className)} {...props} />
    </div>
  )
}
