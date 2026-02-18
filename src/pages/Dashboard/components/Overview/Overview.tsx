import { useQuery } from '@tanstack/react-query'
import * as analyticService from '~/services/analyticService'
import { cn } from '~/utils/cn'

interface OverviewProps {
    className?: string
}

const Overview: React.FC<OverviewProps> = ({ className }) => {
    const { data: overview } = useQuery({
        queryKey: ['overview'],
        queryFn: analyticService.getOverview,
    })

    const renderData = [
        {
            label: 'Tổng số bài đăng',
            value: overview?.data.total_posts,
            percent: () => {
                if (overview?.data.previous_overview.total_posts) {
                    return (
                        ((overview?.data.total_posts - overview?.data.previous_overview.total_posts) /
                            overview?.data.previous_overview.total_posts) *
                        100
                    )
                }

                return (overview?.data.total_posts || 0) * 100
            },
            direction:
                overview?.data.total_posts && overview?.data.total_posts > overview?.data.previous_overview.total_posts
                    ? '+'
                    : '-',
        },
        {
            label: 'Bài đăng đã duyệt',
            value: overview?.data.approved_posts,
            percent: () => {
                if (overview?.data.previous_overview.approved_posts) {
                    return (
                        ((overview?.data.approved_posts - overview?.data.previous_overview.approved_posts) /
                            overview?.data.previous_overview.approved_posts) *
                        100
                    )
                }
                return (overview?.data.approved_posts || 0) * 100
            },
            direction:
                overview?.data.approved_posts &&
                overview?.data.approved_posts > overview?.data.previous_overview.approved_posts
                    ? '+'
                    : '-',
        },
        {
            label: 'Bài đăng chờ duyệt',
            value: overview?.data.pending_posts,
            percent: () => {
                if (overview?.data.previous_overview.pending_posts) {
                    return (
                        ((overview?.data.pending_posts - overview?.data.previous_overview.pending_posts) /
                            overview?.data.previous_overview.pending_posts) *
                        100
                    )
                }
                return (overview?.data.pending_posts || 0) * 100
            },
            direction:
                overview?.data.pending_posts &&
                overview?.data.pending_posts > overview?.data.previous_overview.pending_posts
                    ? '+'
                    : '-',
        },
        {
            label: 'Tổng số người dùng',
            value: overview?.data.total_users,
            percent: () => {
                if (overview?.data.previous_overview.total_users) {
                    return (
                        ((overview?.data.total_users - overview?.data.previous_overview.total_users) /
                            overview?.data.previous_overview.total_users) *
                        100
                    )
                }
                return (overview?.data.total_users || 0) * 100
            },
            direction:
                overview?.data.total_users && overview?.data.total_users > overview?.data.previous_overview.total_users
                    ? '+'
                    : '-',
        },
    ]

    return (
        <>
            {renderData.map((item) => (
                <div className={cn(className)} key={item.label}>
                    <p className="text-[13px] font-medium text-gray-500">{item.label}</p>
                    <div className="flex items-end justify-between gap-2">
                        <h4 className="mt-3 text-3xl font-bold text-gray-800 dark:text-white/90">{item.value}</h4>
                        <p className="text-xs text-gray-500">
                            <span
                                className={cn(
                                    'rounded-md px-2 py-1 font-bold',
                                    item.direction === '+'
                                        ? 'bg-green-100/80 text-green-500'
                                        : 'bg-red-100/80 text-red-500',
                                )}
                            >
                                {item.direction === '+' ? '+' : ''}
                                {Number.isInteger(item.percent())
                                    ? item.percent().toString()
                                    : item.percent().toFixed(2)}
                                %
                            </span>{' '}
                            với tháng trước
                        </p>
                    </div>
                </div>
            ))}
        </>
    )
}

export default Overview
