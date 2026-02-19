import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Tippy from 'huanpenguin-tippy-react'
import { Check, Hourglass, Trash, X } from 'lucide-react'
import moment from 'moment'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import Button from '~/components/Button'
import Input from '~/components/Input'
import Spinner from '~/components/Spinner'
import * as categoryService from '~/services/categoryService'
import * as postService from '~/services/postService'
import { formatVNPrice } from '~/utils/calculatePricePerM2'
import { cn } from '~/utils/cn'

const PER_PAGE = 15

const PostManagerPage = () => {
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            return categoryService.getCategories(1, 100)
        },
    })

    const [currentApproval, setCurrentApproval] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
    const [currentType, setCurrentType] = useState<'all' | 'sell' | 'rent'>('all')
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined)

    const {
        data: postsData,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ['posts', currentApproval, currentType, selectedCategory],
        queryFn: async ({ pageParam = 1 }) => {
            return await postService.getPosts({
                page: pageParam,
                per_page: PER_PAGE,
                category_id: selectedCategory,
                approval_status: currentApproval,
            })
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.meta.pagination.current_page < lastPage.meta.pagination.total_pages) {
                return lastPage.meta.pagination.current_page + 1
            }
            return undefined
        },
        initialPageParam: 1,
    })

    return (
        <>
            <div className="flex flex-col gap-2 lg:flex-row">
                <Input placeholder="Tìm kiếm theo tiêu đề, địa chỉ" className="lg:max-w-100" />

                <select className="border-border h-10.5 rounded-sm border px-2 outline-none">
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Đang chờ duyệt</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="rejected">Bị từ chối</option>
                </select>

                <select className="border-border h-10.5 rounded-sm border px-2 outline-none">
                    <option value="all">Tất cả các loại</option>
                    <option value="pending">Cần bán</option>
                    <option value="approved">Cho thuê</option>
                </select>

                <select
                    className="border-border h-10.5 rounded-sm border px-2 outline-none"
                    onChange={(e) => {
                        setSelectedCategory(Number(e.target.value))
                    }}
                >
                    <option>Tất cả danh mục</option>
                    {categories?.data.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <InfiniteScroll
                dataLength={postsData?.pages.flatMap((page) => page.data).length || 0}
                next={fetchNextPage}
                className="overflow-hidden! overflow-x-auto!"
                hasMore={hasNextPage}
                loader={
                    <div className="flex justify-center">
                        <Spinner />
                    </div>
                }
                scrollThreshold="100px"
                scrollableTarget={undefined}
            >
                <table className="mt-8 w-full min-w-200">
                    <thead className="border-border border-b">
                        <tr className="[&_th]:font-normal">
                            <th className="w-[5%]">
                                <input type="checkbox" />
                            </th>
                            <th className="w-[35%]">Tiêu đề</th>
                            <th className="w-[15%]">Loại</th>
                            <th className="w-[12%]">Giá</th>
                            <th className="w-[10%]">Trạng thái</th>
                            <th className="w-[10%]">Ngày đăng</th>
                            <th className="w-[13%]">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postsData?.pages
                            .flatMap((page) => page.data)
                            .map((post) => {
                                return (
                                    <React.Fragment key={post.id}>
                                        <tr className="[&_td]:px-4 [&_td]:py-2 [&_td]:text-center">
                                            <td>
                                                <input type="checkbox" />
                                            </td>
                                            <td>
                                                <p className="line-clamp-2 text-left font-medium">{post.title}</p>
                                                <p className="line-clamp-2 text-left text-sm text-zinc-500">
                                                    {post.administrative_address}
                                                </p>
                                            </td>
                                            <td>
                                                <p
                                                    className={cn('rounded-md px-2 py-1 text-sm font-semibold', {
                                                        'bg-[#E3F2FD] text-[#2196f3]': post.type === 'sell',
                                                        'bg-[#E8F5E9] text-[#4CAF50]': post.type === 'rent',
                                                    })}
                                                >
                                                    {post.type === 'sell' ? 'Bán' : 'Cho thuê'} - {post.category.name}
                                                </p>
                                            </td>
                                            <td>
                                                <span className="text-lg font-bold text-red-500">
                                                    {formatVNPrice(post.detail.price)}
                                                </span>
                                            </td>
                                            <td>
                                                <p
                                                    className={cn('rounded-md px-2 py-1 text-sm font-semibold', {
                                                        'bg-[#e8f5e9] text-[#4caf50]':
                                                            post.approval_status === 'approved',
                                                        'bg-[#fff3e0] text-[#ff9800]':
                                                            post.approval_status === 'pending',
                                                        'bg-[#ffebee] text-[#f44336]':
                                                            post.approval_status === 'rejected',
                                                    })}
                                                >
                                                    {post.approval_status}
                                                </p>
                                            </td>
                                            <td>
                                                <span className="text-sm font-semibold text-zinc-700">
                                                    {moment
                                                        .tz(post.created_at, 'Asia/Ho_Chi_Minh')
                                                        .format('DD/MM/YYYY')}
                                                </span>
                                            </td>
                                            <td className="flex justify-center gap-2">
                                                <Tippy content="Duyệt bài" delay={[200, 100]}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="bg-[#e8f5e9] text-[#4caf50] hover:bg-[#e8f5e9]/90 hover:text-[#4ca]/80"
                                                    >
                                                        <Check className="size-4" />
                                                    </Button>
                                                </Tippy>
                                                <Tippy content="Chờ duyệt" delay={[200, 100]}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="bg-[#45abffec] text-white hover:bg-[#45abffec]/90 hover:text-white"
                                                    >
                                                        <Hourglass className="size-4" />
                                                    </Button>
                                                </Tippy>
                                                <Tippy content="Từ chối" delay={[200, 100]}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="bg-[#f44336ec] text-white hover:bg-[#f44336ec]/90 hover:text-white"
                                                    >
                                                        <X className="size-4" />
                                                    </Button>
                                                </Tippy>
                                                <Tippy content="Xóa" delay={[200, 100]}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="bg-[#607d8b99] text-white hover:bg-[#607d8b99]/90 hover:text-white"
                                                    >
                                                        <Trash className="size-4" />
                                                    </Button>
                                                </Tippy>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                )
                            })}
                    </tbody>
                </table>
            </InfiniteScroll>
        </>
    )
}

export default PostManagerPage
