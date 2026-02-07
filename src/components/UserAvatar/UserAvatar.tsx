import React, { useState } from 'react'

import { cn } from '~/utils/cn'

interface Props extends React.ComponentProps<'img'> {
    src?: string
    className?: string
    fallback?: string
}

const defaultAvatar = '/static/media/fallback-client.png'

const UserAvatar = ({ src, fallback: customFallback = defaultAvatar, className, ...props }: Props) => {
    const [fallback, setFallback] = useState<string>()

    const handleError = () => {
        setFallback(defaultAvatar)
    }

    if (!src) {
        src = customFallback
    }

    return (
        <img
            src={fallback || src}
            onError={handleError}
            className={cn(
                `size-9 min-w-9 shrink-0 cursor-pointer overflow-hidden rounded-full border border-zinc-300 object-cover`,
                className,
            )}
            {...props}
        />
    )
}

export default UserAvatar
