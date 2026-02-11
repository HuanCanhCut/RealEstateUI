import { useRef } from 'react'
import { Copy, EllipsisIcon, Trash } from 'lucide-react'
import { toast } from 'sonner'
import type { Instance, Props } from 'tippy.js'

import { type InfiniteData, useMutation } from '@tanstack/react-query'
import Button from '~/components/Button'
import CustomTippy from '~/components/CustomTippy/CustomTippy'
import PopperWrapper from '~/components/PopperWrapper'
import UserAvatar from '~/components/UserAvatar/UserAvatar'
import { sendEvent } from '~/helpers/events'
import { queryClient } from '~/lib/queryClient'
import * as commentService from '~/services/commentService'
import type { CommentModel, CommentResponse } from '~/types/comment'
import { cn } from '~/utils/cn'

interface CommentProps {
    comment: CommentModel
    level: number
    postId: number
}

const CommentItem: React.FC<CommentProps> = ({ comment, level = 0, postId }) => {
    const tippyInstanceRef = useRef<Instance<Props> | null>(null)

    const { mutate } = useMutation({
        mutationFn: (commentId: number) => {
            return commentService.getComments({
                postId,
                parentId: commentId,
                limit: 10,
                offset: 0,
            })
        },
        onSuccess: (replies, commentId) => {
            queryClient.setQueryData(
                ['comments', postId],
                (old: InfiniteData<CommentResponse, unknown> | undefined) => {
                    if (!old) return old

                    const addRepliesToComment = (comments: CommentModel[]) => {
                        return comments.map((comment: CommentModel): CommentModel => {
                            if (comment.id === commentId) {
                                return { ...comment, replies: [...(comment.replies || []), ...(replies.data || [])] }
                            }

                            if (comment?.replies && comment?.replies.length > 0) {
                                return { ...comment, replies: addRepliesToComment(comment.replies) }
                            }

                            return comment
                        })
                    }

                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            data: addRepliesToComment(page.data),
                        })),
                    }
                },
            )
        },
    })

    const handleShowReplies = () => {
        mutate(comment.id)
    }

    const handleCopyComment = () => {
        navigator.clipboard.writeText(comment.content)
        toast.success('Đã sao chép tin nhắn')
        tippyInstanceRef.current?.hide()
    }

    const renderActions = () => {
        return (
            <PopperWrapper className="w-full">
                <Button className="w-full" variant="ghost" onClick={handleCopyComment}>
                    <Copy size={14} />
                    Sao chép
                </Button>
                <Button className="w-full text-red-500 hover:text-red-500" variant="ghost">
                    <Trash size={14} />
                    Xóa
                </Button>
            </PopperWrapper>
        )
    }

    const handleReply = () => {
        sendEvent('REPLY_COMMENT', { comment })

        if (!comment.replies && comment.reply_count > 0) {
            handleShowReplies()
        }
    }

    return (
        <div
            className={cn('pt-1', {
                'ml-6': level > 0,
                'border-l border-zinc-200 pl-2': level > 0,
            })}
        >
            <div className="flex gap-2">
                <UserAvatar src={comment.user.avatar} className="mt-1 size-10" />
                <div className="flex flex-col">
                    <div className="w-fit rounded-md bg-slate-100/80 px-2 py-1">
                        <p className="text-sm font-semibold">{comment.user.full_name}</p>
                        <p className="text-base font-normal text-zinc-800">{comment.content}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <p
                            className="ml-2 cursor-pointer text-sm text-zinc-500 select-none hover:underline"
                            onClick={handleReply}
                        >
                            Trả lời
                        </p>
                        <CustomTippy
                            renderItem={renderActions}
                            placement="bottom-start"
                            onShow={(instance) => {
                                tippyInstanceRef.current = instance
                            }}
                        >
                            <Button variant="ghost" size="icon">
                                <EllipsisIcon className="size-4 cursor-pointer text-zinc-500" />
                            </Button>
                        </CustomTippy>
                    </div>

                    {comment.reply_count > 0 && (comment.replies?.length || 0) < comment.reply_count && (
                        <p
                            className="hover:text-primary cursor-pointer text-sm text-zinc-500 select-none hover:underline"
                            onClick={handleShowReplies}
                        >
                            Xem thêm {comment.reply_count - (comment.replies?.length || 0)} bình luận
                        </p>
                    )}
                </div>
            </div>

            {comment.replies &&
                comment.replies.map((reply) => (
                    <CommentItem key={reply.id} comment={reply} level={level + 1} postId={postId} />
                ))}
        </div>
    )
}

export default CommentItem
