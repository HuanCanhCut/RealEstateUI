import type React from 'react'

import { cn } from '~/utils/cn'

interface PopperWrapperProps extends React.ComponentProps<'div'> {
    children: React.ReactNode
    className?: string
}

const PopperWrapper = ({ children, className = '', ...props }: PopperWrapperProps) => {
    return (
        <div
            className={cn(
                'max-h-[calc(100dvh-40px)] max-w-[calc(100dvw-40px)] [overflow:overlay] rounded-md border border-gray-300 bg-white p-1 shadow-md shadow-zinc-700/10 sm:max-h-[calc(100dvh-100px)]',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export default PopperWrapper
