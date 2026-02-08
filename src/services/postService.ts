import type { APIResponse } from '~/types/common'
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
