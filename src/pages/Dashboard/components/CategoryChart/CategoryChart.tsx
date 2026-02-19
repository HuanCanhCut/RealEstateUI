import { Pie, PieChart, type PieSectorShapeProps, Sector } from 'recharts'
import { Tooltip } from 'recharts'

import { useQuery } from '@tanstack/react-query'
import * as categoryServices from '~/services/categoryService'

const stringToColor = (str: string) => {
    let hash = 0
    str.split('').forEach((char) => {
        hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })

    let color = '#'

    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff
        color += value.toString(16).padStart(2, '0')
    }
    return color
}

const MyCustomPie = (props: PieSectorShapeProps & { payload?: { name?: string } }) => {
    const color = props.payload?.name ? stringToColor(props.payload.name) : '#ccc'
    return <Sector {...props} fill={color} />
}

const CategoryChart = () => {
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryServices.getCategories(1, 10),
    })

    return (
        <div>
            {categories?.data && (
                <PieChart
                    style={{
                        width: '100%',
                        aspectRatio: 1,
                    }}
                    responsive
                >
                    <Pie
                        data={categories?.data}
                        labelLine={false}
                        dataKey={'post_count'}
                        nameKey={'name'}
                        isAnimationActive={true}
                        shape={MyCustomPie}
                    />
                    <Tooltip
                        contentStyle={{
                            padding: '4px 8px',
                            borderRadius: '8px',
                        }}
                        itemStyle={{
                            fontSize: '12px',
                        }}
                    />
                </PieChart>
            )}

            <div className="flex flex-wrap justify-center gap-4">
                {categories?.data.map((category) => {
                    return (
                        <div className="flex items-center gap-2" key={category.id}>
                            <div className="px-4 py-1" style={{ backgroundColor: stringToColor(category.name) }}></div>
                            <p>{category.name}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default CategoryChart
