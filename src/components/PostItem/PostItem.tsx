import type React from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

import Button from '../Button'
import { HeartIconRegular, HeartIconSolid } from '../Icons/Icons'
import PricePerMeter from '../Price'
import { type InfiniteData, useMutation } from '@tanstack/react-query'
import config from '~/config'
import { queryClient } from '~/lib/queryClient'
import * as postService from '~/services/postService'
import type { APIResponsePagination } from '~/types/common'
import type { PostModel } from '~/types/post'
import { cn } from '~/utils/cn'

interface PostItemProps {
    post: PostModel
    className?: string
    queryKey: (string | number | null)[]
}

const AnimatedLink = motion.create(Link)

const PostItem: React.FC<PostItemProps> = ({ post, className, queryKey }) => {
    const { mutate: toggleLikePost } = useMutation({
        mutationFn: (postId: number) => {
            return postService.handleToggleLikePost({ postId, type: post.is_liked ? 'unlike' : 'like' })
        },
        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey })

            const previousData = queryClient.getQueryData(queryKey)

            queryClient.setQueryData(
                queryKey,
                (old: InfiniteData<APIResponsePagination<PostModel[]>, unknown> | undefined) => {
                    if (!old) return old

                    return {
                        ...old,
                        pages: old.pages.map((page) => {
                            return {
                                ...page,
                                data: page.data.map((post) => {
                                    if (post.id === postId) {
                                        return {
                                            ...post,
                                            is_liked: !post.is_liked,
                                        }
                                    }

                                    return post
                                }),
                            }
                        }),
                    }
                },
            )

            return { previousData }
        },
        onError(_, __, onMutateResult) {
            queryClient.setQueryData(queryKey, onMutateResult?.previousData)
        },
    })

    const handleToggleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        toggleLikePost(post.id)
    }

    return (
        <AnimatedLink
            to={config.routes.postDetail.replace(':id', post.id.toString())}
            className={cn(
                'relative max-w-full cursor-pointer overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_5px_10px_rgba(0,0,0,0.2)]',
                className,
            )}
            transition={{ duration: 0.4 }}
            initial={{ opacity: 0.5, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <img className="aspect-square w-full rounded-lg object-cover" src={JSON.parse(post.images)[0]} alt="" />

            <div className="p-2">
                <h2 className="mt-1 line-clamp-2 h-12 overflow-hidden text-base leading-6 font-normal whitespace-pre-wrap">
                    {post.title}
                </h2>

                <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
                    <span>{post.detail.bedrooms} PN</span>
                    <span>{post.category.name}</span>
                </div>

                <PricePerMeter price={post.detail.price} area={post.detail.area} />

                <div className="mt-1 flex gap-2 text-zinc-500">
                    <MapPin size={16} className="mt-[2px]" />
                    <span className="text-sm">{post.administrative_address}</span>
                </div>
            </div>

            <Button
                variant="ghost"
                size="icon"
                className="flex-center absolute top-2 right-2 rounded-full hover:bg-slate-50/30"
                onClick={handleToggleLike}
            >
                {post.is_liked ? (
                    <HeartIconRegular className="fill-red-500" />
                ) : (
                    <HeartIconSolid className="fill-white" />
                )}
            </Button>
        </AnimatedLink>
    )
}

export default PostItem
