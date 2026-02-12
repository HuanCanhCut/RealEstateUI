import type { APIResponse } from '~/types/common'
import type { UserModel } from '~/types/user'
import * as request from '~/utils/axiosClient'

export const getUserByNickname = async (nickname: string): Promise<APIResponse<UserModel>> => {
    const response = await request.get(`/users/${nickname}`)

    return response.data
}
