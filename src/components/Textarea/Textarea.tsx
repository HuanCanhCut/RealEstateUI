import * as React from 'react'

import { cn } from '~/utils/cn'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                'focus:border-primary placeholder:text-muted-foreground flex field-sizing-content max-h-32 min-h-8 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm',
                className,
            )}
            {...props}
        />
    )
}

export { Textarea }
