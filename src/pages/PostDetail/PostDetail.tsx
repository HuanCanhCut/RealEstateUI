import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Clock, MapPin } from 'lucide-react'
import moment from 'moment-timezone'

import Carousel from './Carousel'
import { useMutation, useQuery } from '@tanstack/react-query'
import Button from '~/components/Button'
import { HeartIconRegular, HeartIconSolid } from '~/components/Icons/Icons'
import PricePerMeter from '~/components/Price'
import { queryClient } from '~/main'
import * as postService from '~/services/postService'
import type { APIResponse } from '~/types/common'
import type { PostModel } from '~/types/post'

const PostDetailPage = () => {
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
        if (isError) {
            navigate('/404')
        }
    }, [isError, navigate])

    const handleToggleLikePost = () => {
        mutate(post?.data.id || 0)
    }

    return (
        <div className="container mx-auto mt-6 xl:max-w-7xl">
            <div className="grid grid-cols-12">
                <div className="col-span-12 lg:col-span-7">
                    <div className="rounded-md bg-white p-6 shadow-md">
                        <Carousel slider={JSON.parse(post?.data.images || '[]')} />

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
                </div>
                <div className="col-span-12 lg:col-span-5"></div>
            </div>
        </div>
    )
}

export default PostDetailPage
