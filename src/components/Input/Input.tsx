import * as React from 'react'

import { cn } from '~/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    ref?: React.Ref<HTMLInputElement>
}

const Input: React.FC<InputProps> = ({ className, type, ref, ...props }) => {
    return (
        <input
            type={type}
            className={cn(
                'focus:border-primary w-full rounded-lg border border-slate-200 bg-gray-100 p-2 outline-none',
                className,
            )}
            ref={ref}
            {...props}
        />
    )
}

export default Input
