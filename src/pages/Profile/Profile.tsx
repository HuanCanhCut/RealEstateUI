import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useParams, useSearchParams } from 'react-router'
import { AppWindowMac, Clock, CloudUpload, Heart, Phone } from 'lucide-react'
import moment from 'moment'

import EditProfile from '../../components/EditProfile'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import Button from '~/components/Button'
import PopperWrapper from '~/components/PopperWrapper'
import PostItem from '~/components/PostItem'
import Spinner from '~/components/Spinner'
import UserAvatar from '~/components/UserAvatar/UserAvatar'
import { selectCurrentUser } from '~/redux/selector'
import { useAppSelector } from '~/redux/types'
import * as postService from '~/services/postService'
import * as userService from '~/services/userService'
import { cn } from '~/utils/cn'

type TabValue = 'posts' | 'liked' | 'pending' | 'rejected'

interface Tabs {
    icon: React.ReactNode
    label: string
    value: TabValue
    isShow?: boolean
}

const PER_PAGE = 10

const Profile = () => {
    const { nickname } = useParams()

    const [searchParams] = useSearchParams()

    const [activeTab, setActiveTab] = useState<TabValue>((searchParams.get('tab') as TabValue) || 'posts')

    const [isOpenModal, setIsOpenModal] = useState(false)

    const currentUser = useAppSelector(selectCurrentUser)

    const { data: user } = useQuery({
        queryKey: ['user', nickname],
        queryFn: () => userService.getUserByNickname(nickname?.slice(1) as string),
        enabled: !!nickname,
    })

    const queryKey = ['posts', nickname as string, activeTab]

    const {
        data: posts,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey,
        queryFn: async ({ pageParam = 1 }) => {
            switch (activeTab) {
                case 'posts':
                case 'liked':
                    return postService.getUserPosts({
                        userId: user?.data.id ?? 0,
                        page: pageParam as number,
                        per_page: PER_PAGE,
                        favorite: activeTab === 'liked' ? 'true' : undefined,
                    })
                case 'pending':
                case 'rejected':
                    return postService.getUserPostApproval({
                        type: activeTab,
                        page: pageParam,
                        per_page: PER_PAGE,
                    })
                default:
                    return postService.getUserPosts({
                        userId: user?.data.id ?? 0,
                        page: pageParam as number,
                        per_page: PER_PAGE,
                        favorite: activeTab === 'liked' ? 'true' : undefined,
                    })
            }
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.meta.pagination.current_page < lastPage.meta.pagination.total_pages) {
                return lastPage.meta.pagination.current_page + 1
            }
        },
        initialPageParam: 1,
        enabled: !!user?.data.id,
    })

    const tabs: Tabs[] = [
        {
            icon: <AppWindowMac size={16} />,
            label: 'Bài viết',
            value: 'posts',
        },
        {
            icon: <Heart size={16} />,
            label: 'Đang chờ duyệt',
            value: 'pending',
            isShow: currentUser?.id === user?.data.id,
        },
        {
            icon: <Heart size={16} />,
            label: 'Bị từ chối',
            value: 'rejected',
            isShow: currentUser?.id === user?.data.id,
        },
        {
            icon: <Heart size={16} />,
            label: 'Tin đã thích',
            value: 'liked',
            isShow: currentUser?.id === user?.data.id,
        },
    ]

    return (
        <div className="container mx-auto mt-8 max-w-7xl">
            <EditProfile isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} />

            <div className="grid grid-cols-12">
                <div className="col-span-12 md:col-span-3">
                    <PopperWrapper className="w-full max-w-full p-8 shadow-sm">
                        <div className="flex flex-col items-center">
                            <UserAvatar
                                src={user?.data.id === currentUser?.id ? currentUser?.avatar : user?.data.avatar}
                                className="size-32"
                            />

                            <p className="mt-4 text-xl font-bold">{user?.data.full_name}</p>
                            <p className="mt-1 text-sm text-zinc-500">{`@${user?.data.nickname}`}</p>
                        </div>

                        <div className="mt-4 flex flex-col gap-1">
                            <p className="flex items-center gap-2 text-sm">
                                <Phone size={14} />
                                {user?.data.phone_number || 'Không có số điện thoại'}
                            </p>
                            <p className="flex items-center gap-2 text-sm">
                                <Clock size={14} />
                                Tham gia từ {moment.tz(user?.data.created_at, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
                            </p>
                            <p className="flex items-center gap-2 text-sm">
                                <CloudUpload size={14} />
                                <span>
                                    Đã đăng <span className="font-bold">{user?.data.post_count} </span> bài
                                </span>
                            </p>
                        </div>

                        {currentUser?.id === user?.data.id && (
                            <Button variant="secondary" className="mt-8 w-full" onClick={() => setIsOpenModal(true)}>
                                Chỉnh sửa hồ sơ
                            </Button>
                        )}
                    </PopperWrapper>
                </div>
                <div className="col-span-12 md:col-span-9">
                    <div className="px-4">
                        <div className="flex w-full rounded-md bg-zinc-200 p-1">
                            {tabs.map((tab) => {
                                return (
                                    <Button
                                        key={tab.value}
                                        variant="secondary"
                                        size="icon-sm"
                                        className={cn(
                                            'flex-1 cursor-pointer bg-transparent font-semibold hover:bg-transparent',
                                            {
                                                'bg-white hover:bg-white': activeTab === tab.value,
                                                hidden: tab.isShow === false,
                                            },
                                        )}
                                        onClick={() => setActiveTab(tab.value)}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </Button>
                                )
                            })}
                        </div>

                        <InfiniteScroll
                            dataLength={posts?.pages.flatMap((page) => page.data).length || 0}
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
                            {posts?.pages
                                .flatMap((page) => page.data)
                                .map((post) => {
                                    return (
                                        <React.Fragment key={post.id}>
                                            <PostItem
                                                post={post}
                                                key={post.id}
                                                className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3"
                                                queryKey={queryKey}
                                                showLike={activeTab !== 'pending' && activeTab !== 'rejected'}
                                            />
                                        </React.Fragment>
                                    )
                                })}
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
