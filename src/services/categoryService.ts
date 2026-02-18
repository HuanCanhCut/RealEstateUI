import type { CategoryModel } from '~/types/category'
import type { APIResponse, APIResponsePagination } from '~/types/common'
import * as request from '~/utils/axiosClient'

export const getCategories = async (
    page: number,
    per_page: number,
): Promise<APIResponsePagination<CategoryModel[]>> => {
    const response = await request.get('/categories', {
        params: {
            page,
            per_page,
        },
    })
    return response.data
}

export const createCategory = async (name: string): Promise<APIResponse<CategoryModel>> => {
    const response = await request.post('/categories', {
        name,
    })

    return response.data
}

export const updateCategory = async (id: number, name: string): Promise<APIResponse<CategoryModel>> => {
    const response = await request.patch(`/categories/${id}`, {
        name,
    })

    return response.data
}

export const deleteCategory = async (id: number): Promise<APIResponse<void>> => {
    const response = await request.del(`/categories/${id}`)

    return response.data
}
