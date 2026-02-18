import { Pie } from 'react-chartjs-2'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'

import { useQuery } from '@tanstack/react-query'
import * as categoryServices from '~/services/categoryService'

ChartJS.register(ArcElement, Tooltip, Legend)

const CategoryChart = () => {
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryServices.getCategories(1, 10),
    })

    function stringToColor(str: string) {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash)
        }
        const hue = Math.abs(hash % 360)
        return `hsl(${hue}, 70%, 60%)`
    }

    const data = {
        labels: categories?.data.map((category) => category.name) || [],
        datasets: [
            {
                label: 'Số bài đăng',
                data: categories?.data.map((category) => category.post_count) || [],
                backgroundColor: categories?.data.map((category) => stringToColor(category.name)) || [],
                borderWidth: 1,
            },
        ],
    }

    return (
        <div>
            <Pie
                data={data}
                options={{
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                    },
                    responsive: true,
                }}
            />
        </div>
    )
}

export default CategoryChart
