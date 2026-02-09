import { useState } from 'react'

import Button from '~/components/Button'
import { cn } from '~/utils/cn'

interface FilterItemProps {
    title: string
    type: 'price' | 'location'
    items: {
        id: number
        label: string
        value: string
    }[]
    onChoose: (type: 'price' | 'location', value: string | null) => void
}

const MAX_ITEMS = 5

const FilterItem: React.FC<FilterItemProps> = ({ title, type, items, onChoose }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [selectedItems, setSelectedItems] = useState<number | null>(null)

    const handleSelect = (id: number, value: string) => {
        if (selectedItems === id) {
            setSelectedItems(null)
            onChoose(type, null)
        } else {
            setSelectedItems(id)
            onChoose(type, value)
        }
    }

    const handleClear = () => {
        setSelectedItems(null)
        onChoose(type, null)
    }

    return (
        <div className="rounded-md bg-white p-2 shadow-md">
            <span className="text-sm font-semibold">{title}</span>

            <Button className="mt-4 w-full justify-start" variant="secondary" onClick={handleClear}>
                Xóa lọc
            </Button>

            <ul className="mt-2">
                {(!isExpanded ? items.slice(0, MAX_ITEMS) : items).map((item) => (
                    <li key={item.value}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn('w-full justify-start', {
                                'text-primary hover:text-primary': selectedItems === item.id,
                            })}
                            onClick={() => handleSelect(item.id, item.value)}
                        >
                            {item.label}
                        </Button>
                    </li>
                ))}
            </ul>

            {items.length > MAX_ITEMS && (
                <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                </Button>
            )}
        </div>
    )
}

export default FilterItem
