import React, { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { toast } from 'sonner'

import CommentComposer from './CommentComposer'
import CommentItem from './CommentItem'
import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import PopperWrapper from '~/components/PopperWrapper'
import Spinner from '~/components/Spinner'
import socket from '~/helpers/socket'
import { queryClient } from '~/lib/queryClient'
import * as commentService from '~/services/commentService'
import type { CommentModel, CommentResponse } from '~/types/comment'
import type { SocketMeta } from '~/types/socket'
import { cn } from '~/utils/cn'

interface CommentProps {
    className?: string
    postId: number
}

const LIMIT = 15

const Comment: React.FC<CommentProps> = ({ className, postId }) => {
    const {
        data: comments,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ['comments', postId],
        queryFn: async ({ pageParam = 0 }) => {
            return await commentService.getComments({
                postId,
                limit: LIMIT,
                offset: pageParam,
                parentId: null,
            })
        },
        getNextPageParam: (lastPage, allPages) => {
            const total = lastPage.meta.pagination.total

            const loadedCount = allPages.reduce((sum, page) => sum + page.data.length, 0)

            return loadedCount < total ? loadedCount : undefined
        },
        initialPageParam: 0,
    })

    useEffect(() => {
        const socketHandler = ({ data, meta }: { data: CommentModel | null; meta: SocketMeta }) => {
            if (!meta.success) {
                toast.error(meta.error)
                return
            }

            if (!data) {
                return
            }

            queryClient.setQueryData(
                ['comments', postId],
                (old: InfiniteData<CommentResponse, unknown> | undefined) => {
                    if (!old) {
                        return old
                    }

                    // root comment
                    if (!data.parent_id) {
                        return {
                            ...old,
                            pages: old.pages.map(
                                (page, i): CommentResponse => ({
                                    ...page,
                                    data: i === 0 ? [data, ...page.data] : page.data,
                                    meta: {
                                        ...page.meta,
                                        pagination: {
                                            ...page.meta.pagination,
                                            total: page.meta.pagination.total + 1,
                                        },
                                        total_comments: page.meta.total_comments + 1,
                                    },
                                }),
                            ),
                        }
                    } else {
                        const addComment = (comments: CommentModel[]) => {
                            return comments.map((comment: CommentModel): CommentModel => {
                                if (comment.id === data.parent_id) {
                                    if (comment.replies) {
                                        return {
                                            ...comment,
                                            reply_count: comment.reply_count + 1,
                                            replies: comment.replies ? [data, ...comment.replies] : [data],
                                        }
                                    } else {
                                        return {
                                            ...comment,
                                            reply_count: comment.reply_count + 1,
                                        }
                                    }
                                }

                                if (comment.replies && comment.replies.length > 0) {
                                    return { ...comment, replies: addComment(comment.replies) }
                                }

                                return comment
                            })
                        }

                        // reply comment
                        return {
                            ...old,
                            pages: old.pages.map((page: CommentResponse): CommentResponse => {
                                return {
                                    ...page,
                                    data: addComment(page.data),
                                    meta: {
                                        ...page.meta,
                                        pagination: {
                                            ...page.meta.pagination,
                                            total: page.meta.pagination.total + 1,
                                        },
                                    },
                                }
                            }),
                        }
                    }
                },
            )
        }

        socket.on('NEW_COMMENT', socketHandler)

        return () => {
            socket.off('NEW_COMMENT', socketHandler)
        }
    }, [postId])

    useEffect(() => {
        const socketHandler = ({ data, meta }: { data: { comment_id: number }; meta: SocketMeta }) => {
            if (!meta.success) {
                toast.error(meta.error)
                return
            }

            queryClient.setQueryData(
                ['comments', postId],
                (old: InfiniteData<CommentResponse, unknown> | undefined) => {
                    if (!old) {
                        return old
                    }

                    const removeComment = (comments: CommentModel[]): CommentModel[] => {
                        return comments
                            .map((comment): CommentModel | null => {
                                if (comment.id === data.comment_id) {
                                    return null
                                }

                                if (comment.replies && comment.replies.length > 0) {
                                    return {
                                        ...comment,
                                        reply_count: comment.reply_count === 0 ? 0 : comment.reply_count - 1,
                                        replies: removeComment(comment.replies),
                                    }
                                }

                                return comment
                            })
                            .filter((comment): comment is CommentModel => comment !== null)
                    }

                    return {
                        ...old,
                        pages: old.pages.map((page: CommentResponse): CommentResponse => {
                            return {
                                ...page,
                                data: removeComment(page.data),
                                meta: {
                                    pagination: {
                                        ...page.meta.pagination,
                                        total: page.meta.pagination.total - 1,
                                    },
                                    total_comments: page.meta.total_comments - 1,
                                },
                            }
                        }),
                    }
                },
            )
        }

        socket.on('DELETED_COMMENT', socketHandler)

        return () => {
            socket.off('DELETED_COMMENT', socketHandler)
        }
    }, [postId])

    return (
        <PopperWrapper className={cn('flex max-w-full flex-col p-0', className)}>
            <div className="border-primary/10 w-full border-b p-2">
                <p className="text-primary text-center text-sm font-semibold">
                    Bình luận ({comments?.pages[0].meta.total_comments})
                </p>
            </div>

            <div className="flex-1 overflow-y-auto" id="comment-scrollable">
                <InfiniteScroll
                    dataLength={comments?.pages.flatMap((page) => page.data).length || 0}
                    next={fetchNextPage}
                    className="overflow-hidden! p-3 pt-0"
                    hasMore={hasNextPage}
                    loader={
                        <div className="flex justify-center">
                            <Spinner />
                        </div>
                    }
                    scrollThreshold="100px"
                    scrollableTarget="comment-scrollable"
                >
                    {comments?.pages
                        .flatMap((page) => page.data)
                        .map((comment) => {
                            return (
                                <React.Fragment key={comment.id}>
                                    <CommentItem comment={comment} level={0} postId={postId} />
                                </React.Fragment>
                            )
                        })}
                </InfiniteScroll>
            </div>

            <CommentComposer />
        </PopperWrapper>
    )
}

export default Comment
