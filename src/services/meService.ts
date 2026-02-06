import * as request from '~/utils/axiosClient'

export const getCurrentUser = async () => {
    const response = await request.get('/auth/me')

    return response.data
}
