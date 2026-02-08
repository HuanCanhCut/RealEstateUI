import type { CategoryModel } from '~/types/category'
import type { APIResponsePagination } from '~/types/common'
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
