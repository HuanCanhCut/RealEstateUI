import type React from 'react'
import Tippy from 'huanpenguin-tippy-react'
import { Check, Hourglass, Trash, X } from 'lucide-react'
import moment from 'moment'

import { type InfiniteData, useMutation } from '@tanstack/react-query'
import Button from '~/components/Button'
import { queryClient } from '~/lib/queryClient'
import * as postService from '~/services/postService'
import type { APIResponsePagination } from '~/types/common'
import type { PostModel } from '~/types/post'
import { formatVNPrice } from '~/utils/calculatePricePerM2'
import { cn } from '~/utils/cn'

interface PostItemProps {
    queryKey: (string | number | undefined)[]
    postChecked: number[]
    post: PostModel
    setPostChecked: React.Dispatch<React.SetStateAction<number[]>>
}

const PostItem: React.FC<PostItemProps> = ({ queryKey, postChecked, post, setPostChecked }) => {
    const { mutate } = useMutation({
        mutationFn: ({ postId, type }: { postId: number; type: 'delete' | 'approve' | 'reject' | 'pending' }) => {
            switch (type) {
                case 'delete':
                    return postService.deletePost({ postId })
                case 'approve':
                    return postService.approvePost({ postId })
                case 'reject':
                    return postService.rejectPost({ postId })
                case 'pending':
                    return postService.pendingPost({ postId })
            }
        },
        onMutate: async ({ postId, type }: { postId: number; type: 'delete' | 'approve' | 'reject' | 'pending' }) => {
            await queryClient.cancelQueries({ queryKey })

            const previousData = queryClient.getQueryData(queryKey)

            const mappingType = {
                delete: 'delete',
                approve: 'approved',
                reject: 'rejected',
                pending: 'pending',
            }

            queryClient.setQueryData(
                queryKey,
                (old: InfiniteData<APIResponsePagination<PostModel[]>, unknown> | undefined) => {
                    if (!old) {
                        return old
                    }

                    if (type === 'delete') {
                        return {
                            ...old,
                            pages: old.pages.map((page) => {
                                return {
                                    ...page,
                                    data: page.data.filter((post) => post.id !== postId),
                                }
                            }),
                        }
                    } else {
                        return {
                            ...old,
                            pages: old.pages.map((page) => {
                                return {
                                    ...page,
                                    data: page.data.map((post) => {
                                        if (post.id === postId) {
                                            return {
                                                ...post,
                                                approval_status: mappingType[type],
                                            }
                                        }

                                        return post
                                    }),
                                }
                            }),
                        }
                    }
                },
            )

            return { previousData }
        },
        onError(_, __, onMutateResult) {
            queryClient.setQueryData(queryKey, onMutateResult?.previousData)
        },
    })

    return (
        <tr className="[&_td]:px-4 [&_td]:py-2 [&_td]:text-center">
            <td>
                <input
                    type="checkbox"
                    checked={postChecked.includes(post.id)}
                    onChange={(e) => {
                        setPostChecked((prev) => {
                            if (e.target.checked) {
                                return [...prev, post.id]
                            }
                            return prev.filter((id) => id !== post.id)
                        })
                    }}
                />
            </td>
            <td>
                <p className="line-clamp-2 text-left font-medium">{post.title}</p>
                <p className="line-clamp-2 text-left text-sm text-zinc-500">{post.administrative_address}</p>
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
                <span className="text-lg font-bold text-red-500">{formatVNPrice(post.detail.price)}</span>
            </td>
            <td>
                <p
                    className={cn('rounded-md px-2 py-1 text-sm font-semibold', {
                        'bg-[#e8f5e9] text-[#4caf50]': post.approval_status === 'approved',
                        'bg-[#fff3e0] text-[#ff9800]': post.approval_status === 'pending',
                        'bg-[#ffebee] text-[#f44336]': post.approval_status === 'rejected',
                    })}
                >
                    {post.approval_status}
                </p>
            </td>
            <td>
                <span className="text-sm font-semibold text-zinc-700">
                    {moment.tz(post.created_at, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
                </span>
            </td>
            <td className="flex justify-center gap-2">
                <Tippy content="Duyệt bài" delay={[200, 100]}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="bg-[#e8f5e9] text-[#4caf50] hover:bg-[#e8f5e9]/90 hover:text-[#4ca]/80"
                        onClick={() => mutate({ postId: post.id, type: 'approve' })}
                    >
                        <Check className="size-4" />
                    </Button>
                </Tippy>
                <Tippy content="Chờ duyệt" delay={[200, 100]}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="bg-[#45abffec] text-white hover:bg-[#45abffec]/90 hover:text-white"
                        onClick={() => mutate({ postId: post.id, type: 'pending' })}
                    >
                        <Hourglass className="size-4" />
                    </Button>
                </Tippy>
                <Tippy content="Từ chối" delay={[200, 100]}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="bg-[#f44336ec] text-white hover:bg-[#f44336ec]/90 hover:text-white"
                        onClick={() => mutate({ postId: post.id, type: 'reject' })}
                    >
                        <X className="size-4" />
                    </Button>
                </Tippy>
                <Tippy content="Xóa" delay={[200, 100]}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="bg-[#607d8b99] text-white hover:bg-[#607d8b99]/90 hover:text-white"
                        onClick={() => mutate({ postId: post.id, type: 'delete' })}
                    >
                        <Trash className="size-4" />
                    </Button>
                </Tippy>
            </td>
        </tr>
    )
}

export default PostItem
