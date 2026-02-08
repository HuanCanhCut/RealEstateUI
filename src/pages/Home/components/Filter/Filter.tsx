import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import Button from '~/components/Button'
import { sendEvent } from '~/helpers/events'
import { getCategories } from '~/services/categoryService'

const Filter = () => {
    const [categoryActive, setCategoryActive] = useState<number | null>(null)

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories(1, 10),
    })

    const handleSelectCategory = (id: number) => {
        if (id === categoryActive) {
            setCategoryActive(null)

            sendEvent('SELECT_CATEGORY', { category_id: null })

            return
        }

        setCategoryActive(id)

        sendEvent('SELECT_CATEGORY', { category_id: id })
    }

    return (
        <div className="rounded-md bg-white p-4 shadow-md">
            <h3 className="text-base font-semibold">Mua bán bất động sản giá tốt</h3>
            <div className="mt-4 flex gap-2">
                {categories?.data.map((category) => {
                    return (
                        <Button
                            key={category.id}
                            variant={category.id === categoryActive ? 'default' : 'secondary'}
                            onClick={() => {
                                handleSelectCategory(category.id)
                            }}
                        >
                            {category.name}
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}

export default Filter
