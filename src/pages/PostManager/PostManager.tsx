import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import PostItem from './components/PostItem'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import Input from '~/components/Input'
import Spinner from '~/components/Spinner'
import * as categoryService from '~/services/categoryService'
import * as postService from '~/services/postService'

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
    const [postChecked, setPostChecked] = useState<number[]>([])

    const queryKey = ['posts', currentApproval, currentType, selectedCategory]

    const {
        data: postsData,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey,
        queryFn: async ({ pageParam = 1 }) => {
            return await postService.getPosts({
                page: pageParam,
                per_page: PER_PAGE,
                category_id: selectedCategory,
                approval_status: currentApproval,
                type: currentType === 'all' ? undefined : currentType,
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

                <select
                    className="border-border h-10.5 rounded-sm border px-2 outline-none"
                    onChange={(e) => {
                        setCurrentApproval(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')
                    }}
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Đang chờ duyệt</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="rejected">Bị từ chối</option>
                </select>

                <select
                    className="border-border h-10.5 rounded-sm border px-2 outline-none"
                    onChange={(e) => {
                        setCurrentType(e.target.value as 'all' | 'sell' | 'rent')
                    }}
                >
                    <option value="all">Tất cả các loại</option>
                    <option value="sell">Cần bán</option>
                    <option value="rent">Cho thuê</option>
                </select>

                <select
                    className="border-border h-10.5 rounded-sm border px-2 outline-none"
                    onChange={(e) => {
                        setSelectedCategory(() => {
                            if (e.target.value === 'all') {
                                return undefined
                            }

                            return Number(e.target.value)
                        })
                    }}
                >
                    <option value="all">Tất cả danh mục</option>
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
                                <input
                                    type="checkbox"
                                    checked={
                                        postChecked.length === postsData?.pages.flatMap((page) => page.data).length
                                    }
                                    onChange={(e) => {
                                        setPostChecked(() => {
                                            if (e.target.checked) {
                                                return (
                                                    postsData?.pages
                                                        .flatMap((page) => page.data)
                                                        .map((post) => post.id) || []
                                                )
                                            }
                                            return []
                                        })
                                    }}
                                />
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
                                        <PostItem
                                            queryKey={queryKey}
                                            postChecked={postChecked}
                                            post={post}
                                            setPostChecked={setPostChecked}
                                        />
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
