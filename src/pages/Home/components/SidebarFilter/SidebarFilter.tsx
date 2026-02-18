import axios from 'axios'

import FilterItem from './FilterItem'
import { useQuery } from '@tanstack/react-query'
import { sendEvent } from '~/helpers/events'
import { cn } from '~/utils/cn'

interface SidebarFilterProps {
    className?: string
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({ className }) => {
    const { data: provinces } = useQuery({
        queryKey: ['provinces'],
        queryFn: async () => {
            const { data } = await axios.get('/locations/index.json')
            return Object.keys(data).map((province, index) => ({
                id: index + 1,
                label: province,
                value: province,
            }))
        },
    })

    const filterPrices = [
        {
            id: 1,
            label: 'Giá dưới 1 tỷ',
            value: '0-1000000000',
        },
        {
            id: 2,
            label: 'Giá 1 - 2 tỷ',
            value: '1000000000-2000000000',
        },
        {
            id: 3,
            label: 'Giá 2 - 3 tỷ',
            value: '2000000000-3000000000',
        },
        {
            id: 4,
            label: 'Giá 3 - 5 tỷ',
            value: '3000000000-5000000000',
        },
        {
            id: 5,
            label: 'Giá 5 - 7 tỷ',
            value: '5000000000-7000000000',
        },
        {
            id: 6,
            label: 'Giá 7 - 10 tỷ',
            value: '7000000000-10000000000',
        },
        {
            id: 7,
            label: 'Giá 10 - 15 tỷ',
            value: '10000000000-15000000000',
        },
        {
            id: 8,
            label: 'Giá 15 - 20 tỷ',
            value: '15000000000-20000000000',
        },
        {
            id: 9,
            label: 'Giá 20 - 30 tỷ',
            value: '20000000000-30000000000',
        },
        {
            id: 10,
            label: 'Giá trên 30 tỷ',
            value: '30000000000',
        },
    ]

    const handleChooseFilterOption = (type: 'price' | 'location', value: string | null) => {
        switch (type) {
            case 'price':
                {
                    const minPrice = value?.split('-')[0]
                    const maxPrice = value?.split('-')[1]

                    sendEvent('SELECT_PRICE_RANGE', {
                        minPrice: minPrice ? Number(minPrice) : null,
                        maxPrice: maxPrice ? Number(maxPrice) : null,
                    })
                }
                break
            case 'location':
                sendEvent('SELECT_PROVINCE', { province: value || '' })
                break
        }
    }

    return (
        <div className={cn('flex flex-col gap-6', className)}>
            <FilterItem
                title="Lọc theo khoảng giá"
                items={filterPrices}
                type="price"
                onChoose={handleChooseFilterOption}
            />

            {provinces && (
                <FilterItem
                    title="Lọc theo tỉnh/thành phố"
                    items={provinces}
                    type="location"
                    onChoose={handleChooseFilterOption}
                />
            )}
        </div>
    )
}

export default SidebarFilter
