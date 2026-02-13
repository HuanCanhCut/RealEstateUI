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

export const deletePost = async ({ postId }: { postId: number }) => {
    const response = await request.del(`/posts/${postId}`)

    return response.data
}

interface CreatePostParams {
    title: string
    description: string
    administrative_address: string
    sub_locality: string
    type: 'sell' | 'rent'
    images: string[]
    category_id: number
    role: 'personal' | 'agent'

    post_detail: {
        bedrooms: number
        bathrooms: number
        balcony: string
        main_door: string
        legal_documents: string
        interior_status: string
        area: number
        price: number
        deposit: number
    }
}

export const createPost = async (data: CreatePostParams) => {
    const response = await request.post(`/posts`, data)

    return response.data
}

export const getUserPosts = async ({
    userId,
    page,
    per_page,
    favorite,
}: {
    userId: number
    page: number
    per_page: number
    favorite?: string
}): Promise<APIResponsePagination<PostModel[]>> => {
    const response = await request.get(`/users/${userId}/posts`, {
        params: {
            page,
            per_page,
            favorite,
        },
    })
    return response.data
}

export const getUserPostApproval = async ({
    type,
    page,
    per_page,
}: {
    type: 'pending' | 'rejected'
    page: number
    per_page: number
}) => {
    const response = await request.get(`/users/posts/${type}`, {
        params: {
            page,
            per_page,
        },
    })

    return response.data
}
