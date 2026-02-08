import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useInfiniteQuery } from '@tanstack/react-query'
import PostItem from '~/components/PostItem'
import Spinner from '~/components/Spinner'
import { listenEvent } from '~/helpers/events'
import * as postService from '~/services/postService'
import { cn } from '~/utils/cn'

interface PostListProps {
    className?: string
}

type TabValue = 'all' | 'personal' | 'agent'

interface Tab {
    label: string
    value: TabValue
}

const PER_PAGE = 10

const PostList: React.FC<PostListProps> = ({ className }) => {
    const [activeTab, setActiveTab] = useState<TabValue>('all')
    const [categoryId, setCategoryId] = useState<number | null>(null)

    const queryKey = ['posts', activeTab, categoryId]

    const {
        data: postsData,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey,
        queryFn: async ({ pageParam = 1 }) => {
            return await postService.getPosts({
                per_page: PER_PAGE,
                page: pageParam,
                role: activeTab === 'all' ? undefined : activeTab === 'personal' ? 'personal' : 'agent',
                category_id: categoryId,
            })
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.meta.links.next) {
                return lastPage.meta.pagination.current_page + 1
            }
        },
        initialPageParam: 1,
    })

    const tabs: Tab[] = [
        {
            label: 'Tất cả',
            value: 'all',
        },
        {
            label: 'Cá nhân',
            value: 'personal',
        },
        {
            label: 'Môi giới',
            value: 'agent',
        },
    ]

    useEffect(() => {
        const remove = listenEvent('SELECT_CATEGORY', ({ category_id }) => {
            setCategoryId(category_id)
        })

        return remove
    }, [])

    const handleClickTab = (tab: TabValue) => {
        setActiveTab(tab)
    }

    return (
        <div className={cn('px-5', className)}>
            <div className="border-b border-zinc-200">
                {tabs.map((tab) => {
                    return (
                        <button
                            key={tab.value}
                            onClick={() => {
                                handleClickTab(tab.value)
                            }}
                            className={cn(
                                'hover:text-primary rounded-md border-b-3 border-transparent px-4 py-3 font-semibold hover:bg-zinc-100',
                                {
                                    'border-primary rounded-b-none': tab.value === activeTab,
                                },
                            )}
                        >
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            <InfiniteScroll
                dataLength={postsData?.pages.length || 0}
                next={fetchNextPage}
                className="mt-4 grid grid-cols-12 gap-4 overflow-hidden!"
                hasMore={hasNextPage}
                loader={
                    <div className="flex justify-center">
                        <Spinner />
                    </div>
                }
                scrollThreshold="100px"
                scrollableTarget={undefined}
            >
                {postsData?.pages
                    .flatMap((page) => page.data)
                    .map((post) => {
                        return (
                            <React.Fragment key={post.id}>
                                <PostItem
                                    post={post}
                                    key={post.id}
                                    className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3"
                                    queryKey={queryKey}
                                />
                            </React.Fragment>
                        )
                    })}
            </InfiniteScroll>
        </div>
    )
}

export default PostList
