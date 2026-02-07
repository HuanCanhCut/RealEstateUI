'use client'

import { useNavigate } from 'react-router'

import type { MenuItemType } from './Interaction'
import Button from '~/components/Button'

interface MenuItemProps {
    item: MenuItemType
    onChoose: (type: MenuItemType['type']) => void
}

const MenuItem = ({ item, onChoose }: MenuItemProps) => {
    const navigate = useNavigate()

    const handleChoose = () => {
        if (item.href) {
            navigate(item.href)
        } else {
            onChoose(item.type)
        }
    }

    return (
        <div
            className={`flex w-full cursor-pointer items-center justify-between gap-2 px-2 py-1 select-none hover:bg-gray-100 dark:hover:bg-[#2d2d2f] ${item.line ? 'border-t border-gray-300 dark:border-zinc-700' : ''}`}
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
