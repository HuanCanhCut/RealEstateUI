import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Send } from 'lucide-react'

import Button from '~/components/Button'
import { Textarea } from '~/components/Textarea/Textarea'
import config from '~/config'
import { listenEvent } from '~/helpers/events'
import socket from '~/helpers/socket'
import { selectCurrentUser } from '~/redux/selector'
import { useAppSelector } from '~/redux/types'
import type { CommentModel } from '~/types/comment'

const CommentComposer = () => {
    const [replyComment, setReplyComment] = useState<CommentModel | null>(null)

    const { id: postId } = useParams()

    const currentUser = useAppSelector(selectCurrentUser)

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleEmitComment = () => {
        if (textareaRef.current?.value.trim()) {
            socket.emit('NEW_COMMENT', {
                content: textareaRef.current.value.trim(),
                post_id: Number(postId),
                parent_id: replyComment?.id,
            })

            textareaRef.current!.value = ''

            setReplyComment(null)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()

            handleEmitComment()
        }
    }

    useEffect(() => {
        const remove = listenEvent('REPLY_COMMENT', ({ comment }) => {
            setReplyComment(comment)

            textareaRef.current?.focus()
        })

        return remove
    }, [])

    return (
        <div className="border-primary/20 flex gap-4 border-t p-4 pt-2">
            {currentUser ? (
                <div className="w-full">
                    {replyComment && (
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm">
                                    Đang trả lời: <span className="font-semibold">{replyComment.user.full_name}</span>
                                </p>
                                <p className="line-clamp-1 w-full max-w-full truncate text-sm whitespace-pre-wrap text-zinc-600">
                                    {replyComment.content}
                                </p>
                            </div>
                            <Button
                                className=""
                                variant="ghost"
                                size={'icon'}
                                onClick={() => {
                                    setReplyComment(null)
                                }}
                            >
                                Hủy
                            </Button>
                        </div>
                    )}

                    <div className="mt-2 flex w-full gap-4">
                        <Textarea placeholder="Aa" onKeyDown={handleKeyDown} ref={textareaRef} />

                        <Button size={'icon'} onClick={handleEmitComment}>
                            <Send />
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="w-full text-center">
                    Bạn cần đăng nhập để bình luận.{' '}
                    <Link
                        to={`${config.routes.login}?redirect_to=${window.location.pathname}`}
                        className="text-primary"
                    >
                        Đăng nhập
                    </Link>
                </p>
            )}
        </div>
    )
}

export default CommentComposer
