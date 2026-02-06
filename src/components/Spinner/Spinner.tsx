import { LoaderCircle } from 'lucide-react'

import { cn } from '~/utils/cn'

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
    return <LoaderCircle className={cn('size-4 animate-spin', className)} {...props} />
}

export default Spinner
