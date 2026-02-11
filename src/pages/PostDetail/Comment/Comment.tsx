import React, { useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import CommentComposer from './CommentComposer'
import CommentItem from './CommentItem'
import { useInfiniteQuery } from '@tanstack/react-query'
import PopperWrapper from '~/components/PopperWrapper'
import Spinner from '~/components/Spinner'
import * as commentService from '~/services/commentService'
import { cn } from '~/utils/cn'

interface CommentProps {
    className?: string
    postId: number
}

const LIMIT = 15

const Comment: React.FC<CommentProps> = ({ className, postId }) => {
    const offset = useRef<number>(LIMIT)

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
        getNextPageParam: (lastPage) => {
            const total = lastPage.meta.pagination.total
            const currentOffset = lastPage.meta.pagination.offset + LIMIT

            return currentOffset < total ? offset.current + LIMIT : undefined
        },
        initialPageParam: 0,
    })

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
