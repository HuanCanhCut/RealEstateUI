import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'

import { useQuery } from '@tanstack/react-query'
import * as analyticService from '~/services/analyticService'

const UserChart = () => {
    const { data: userStats } = useQuery({
        queryKey: ['userStats'],
        queryFn: analyticService.getUsersMonthlyRegistrations,
    })

    return (
        <LineChart
            style={{
                width: '100%',
                maxWidth: '700px',
                height: '100%',
                maxHeight: '70vh',
                aspectRatio: 1.618,
            }}
            responsive
            data={userStats?.data}
            margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 5,
            }}
        >
            <XAxis
                dataKey="month"
                tickFormatter={(value) => `${value}/${userStats?.data?.find((item) => item.month === value)?.year}`}
            />
            <YAxis dataKey="count" />
            <Tooltip
                labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) {
                        const { year, month } = payload[0].payload
                        return `Tháng ${month}/${year}`
                    }
                    return label
                }}
                formatter={(value) => [`${value} người`, 'Đăng ký']}
            />
            <Legend />
            <Line
                type="monotone"
                dataKey="count"
                stroke="#ff2056"
                name="Người dùng đăng ký trong 3 tháng"
                activeDot={{ r: 6 }}
            />
        </LineChart>
    )
}

export default UserChart
