import type { APIResponse, APIResponsePagination } from '~/types/common'
import type { PostModel } from '~/types/post'
import * as request from '~/utils/axiosClient'

export const searchPosts = async (q: string): Promise<APIResponse<PostModel[]>> => {
    const response = await request.get(`/posts/search`, {
        params: {
            q,
        },
    })

    return response.data
}

export const getPosts = async ({
    page,
    per_page,
    role,
    category_id,
    location,
    approval_status,
    min_price,
    max_price,
}: {
    page: number
    per_page: number
    role?: 'personal' | 'agent'
    category_id?: number | null
    location?: string
    approval_status?: 'approved' | 'pending' | 'rejected' | 'all'
    min_price?: number | null
    max_price?: number | null
}): Promise<APIResponsePagination<PostModel[]>> => {
    const response = await request.get(`/posts`, {
        params: {
            page,
            per_page,
            role,
            category_id,
            location,
            approval_status,
            min_price,
            max_price,
        },
    })
    return response.data
}

export const handleToggleLikePost = async ({ postId, type }: { postId: number; type: 'like' | 'unlike' }) => {
    const response = await request.post(`/posts/${postId}/${type}`)

    return response.data
}

export const getPostById = async ({ postId }: { postId: number }): Promise<APIResponse<PostModel>> => {
    const response = await request.get(`/posts/${postId}`)

    return response.data
}
