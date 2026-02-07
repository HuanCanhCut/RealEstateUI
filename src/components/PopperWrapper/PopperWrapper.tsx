import { cn } from '~/utils/cn'

interface PopperWrapperProps {
    children: React.ReactNode
    className?: string
}

const PopperWrapper = ({ children, className = '' }: PopperWrapperProps) => {
    return (
        <div
            className={cn(
                'max-h-[calc(100dvh-40px)] max-w-[calc(100vw-40px)] [overflow:overlay] rounded-md border border-gray-300 bg-white p-1 shadow-md shadow-zinc-700/10 sm:max-h-[calc(100dvh-100px)]',
                className,
            )}
        >
            {children}
        </div>
    )
}

export default PopperWrapper
