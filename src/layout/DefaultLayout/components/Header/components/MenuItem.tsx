'use client'

import { useNavigate } from 'react-router'
import type { Instance, Props } from 'tippy.js'

import type { MenuItemType } from './Interaction'
import Button from '~/components/Button'
import { cn } from '~/utils/cn'

interface MenuItemProps {
    item: MenuItemType
    onChoose: (type: MenuItemType['type']) => void
    tippyInstanceRef: React.RefObject<Instance<Props> | null>
}

const MenuItem = ({ item, onChoose, tippyInstanceRef }: MenuItemProps) => {
    const navigate = useNavigate()

    const handleChoose = () => {
        if (item.href) {
            navigate(item.href)
            tippyInstanceRef.current?.hide()
        } else {
            onChoose(item.type)
        }
    }

    return (
        <div
            className={cn(
                'flex w-full cursor-pointer items-center justify-between gap-2 px-2 py-1 select-none hover:bg-gray-100',
                item.line ? 'border-t border-gray-300' : '',
                item.destructive ? 'text-destructive' : '',
            )}
            onClick={handleChoose}
        >
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                    <>{item.icon}</>
                </Button>
                <span className="text-base font-medium">{item.label}</span>
            </div>
        </div>
    )
}

export default MenuItem
