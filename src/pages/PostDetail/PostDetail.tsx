import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Clock, MapPin } from 'lucide-react'
import moment from 'moment-timezone'
import { toast } from 'sonner'

import Carousel from './Carousel'
import Comment from './Comment'
import Detail from './Detail'
import { useMutation, useQuery } from '@tanstack/react-query'
import Button from '~/components/Button'
import ConfirmModal from '~/components/ConfirmModal'
import { HeartIconRegular, HeartIconSolid } from '~/components/Icons/Icons'
import PopperWrapper from '~/components/PopperWrapper'
import PricePerMeter from '~/components/Price'
import UserAvatar from '~/components/UserAvatar/UserAvatar'
import config from '~/config'
import socket from '~/helpers/socket'
import { queryClient } from '~/lib/queryClient'
import { selectCurrentUser } from '~/redux/selector'
import { useAppSelector } from '~/redux/types'
import * as postService from '~/services/postService'
import type { APIResponse } from '~/types/common'
import type { PostModel } from '~/types/post'
import handleApiError from '~/utils/handleApiError'

const PostDetailPage = () => {
    const currentUser = useAppSelector(selectCurrentUser)
    const [isOpenModal, setIsOpenModal] = useState(false)

    const { id } = useParams()
    const navigate = useNavigate()

    const { data: post, isError } = useQuery({
        queryKey: ['post', id],
        queryFn: () => postService.getPostById({ postId: Number(id) }),
    })

    const { mutate } = useMutation({
        mutationFn: (postId: number) => {
            return postService.handleToggleLikePost({
                postId,
                type: post?.data.is_liked ? 'unlike' : 'like',
            })
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['post', id] })

            const previousData = queryClient.getQueryData(['post', id])

            queryClient.setQueryData(['post', id], (old: APIResponse<PostModel> | undefined) => {
                if (!old) return old

                return {
                    ...old,
                    data: {
                        ...old.data,
                        is_liked: !old.data.is_liked,
                    },
                }
            })

            return { previousData }
        },
        onError(_, __, onMutateResult) {
            queryClient.setQueryData(['post', id], onMutateResult?.previousData)
        },
    })

    useEffect(() => {
        socket.emit('JOIN_POST_COMMENTS', { post_id: Number(id) })

        return () => {
            socket.emit('LEAVE_POST_COMMENTS', { post_id: Number(id) })
        }
    }, [id])

    useEffect(() => {
        if (isError) {
            navigate('/404')
        }
    }, [isError, navigate])

    const handleToggleLikePost = () => {
        mutate(post?.data.id || 0)
    }

    const handleDeletePost = () => {
        try {
            postService.deletePost({ postId: Number(id) })

            toast.success('Xóa bài đăng thành công')

            navigate(config.routes.home)
        } catch (error) {
            handleApiError({ error })
        }
    }

    return (
        <div className="container mx-auto py-6 xl:max-w-7xl">
            <ConfirmModal
                isOpen={isOpenModal}
                title="Bạn có chắc chắn?"
                content="Việc xóa bài đăng này sẽ không thể khôi phục lại"
                confirmFn={handleDeletePost}
                cancelFn={() => {
                    setIsOpenModal(false)
                }}
            />

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-7">
                    <div className="rounded-md bg-white p-6 shadow-md">
                        <Carousel slider={post?.data.images || []} />

                        <div className="mt-4 flex items-start justify-between">
                            <div>
                                <h2 className="font-bold">{post?.data.title}</h2>

                                <p>
                                    {post?.data.detail.bedrooms}PN • {post?.data.category?.name}
                                </p>

                                <PricePerMeter
                                    price={post?.data.detail.price || 0}
                                    area={post?.data.detail.area || 0}
                                    className="mt-2 text-black"
                                />

                                <p className="mt-2 flex items-center gap-2 text-zinc-500">
                                    <MapPin size={16} className="mt-0.5" />
                                    {post?.data.administrative_address}
                                </p>

                                <p className="mt-1 flex items-center gap-2 text-zinc-500">
                                    <Clock size={16} />
                                    {moment.tz(post?.data.created_at, 'Asia/Ho_Chi_Minh').locale('vi-VN').fromNow()}
                                </p>
                            </div>
                            <Button
                                variant={'outline'}
                                className="rounded-full border border-slate-300"
                                onClick={handleToggleLikePost}
                            >
                                Lưu
                                {post?.data.is_liked ? (
                                    <HeartIconRegular className="fill-red-500" />
                                ) : (
                                    <HeartIconSolid className="fill-black" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {post?.data && <Detail post={post.data} />}
                </div>

                <div className="col-span-12 lg:col-span-5">
                    <div className="sticky top-[calc(var(--header-height)+24px)] flex h-full max-h-[calc(100dvh-var(--header-height)-48px)] flex-col">
                        <PopperWrapper className="max-w-full rounded-md p-4">
                            {post?.data.user_id === currentUser?.id ? (
                                <div className="max-w-full">
                                    <h3 className="text-lg font-bold">Quản lý bài viết</h3>
                                    <div className="mt-4 flex max-w-full gap-3">
                                        <Button
                                            variant={'secondary'}
                                            className="flex-1"
                                            onClick={() => {
                                                setIsOpenModal(true)
                                            }}
                                        >
                                            Xóa
                                        </Button>
                                        <Button
                                            variant={'default'}
                                            className="flex-1"
                                            to={`${config.routes.createPost}?mode=edit&postId=${id}`}
                                        >
                                            Chỉnh sửa
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex gap-3">
                                        <UserAvatar src={post?.data.user.avatar} className="size-12" />
                                        <div>
                                            <p className="text-lg font-semibold">{post?.data.user.full_name}</p>
                                            <p className="text-sm text-zinc-500">
                                                {post?.data.role === 'personal' ? 'Cá nhân' : 'Môi giới'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-3 text-sm text-zinc-500">
                                        <span>{post?.data.user.post_count} tin đăng</span>
                                        <span>
                                            {moment
                                                .tz(post?.data.user.created_at, 'Asia/Ho_Chi_Minh')
                                                .fromNow()
                                                .replace('trước', '')}{' '}
                                            trên <span className="text-primary font-semibold">RealEstate</span>
                                        </span>
                                    </div>

                                    <div className="mt-4 flex gap-3">
                                        <Button
                                            className="border-primary/50 text-primary hover:text-primary flex-1 border"
                                            variant={'outline'}
                                        >
                                            Ký hợp đồng online
                                        </Button>
                                        <Button className="border-primary/50 flex-1 border" variant={'default'}>
                                            {post?.data.user.phone_number || 'Không có số điện thoại'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </PopperWrapper>

                        <Comment className="mt-4 flex-1" postId={Number(id)} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostDetailPage
