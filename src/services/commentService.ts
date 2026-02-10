import type { CommentResponse } from '~/types/comment'
import request from '~/utils/axiosClient'

export const getComments = async ({
    postId,
    parentId,
    limit,
    offset,
}: {
    postId: number
    parentId?: number | null
    limit: number
    offset: number
}): Promise<CommentResponse> => {
    const response = await request.get(`/comments`, {
        params: {
            post_id: postId,
            parent_id: parentId,
            limit,
            offset,
        },
    })
    return response.data
}
