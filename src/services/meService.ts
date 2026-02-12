import * as request from '~/utils/axiosClient'

export const getCurrentUser = async () => {
    const response = await request.get('/auth/me')

    return response.data
}

export const updateCurrentUser = async ({
    firstName,
    lastName,
    phoneNumber,
    address,
    avatar,
}: {
    firstName: string
    lastName: string
    phoneNumber: string
    address: string
    avatar?: string
}) => {
    const response = await request.patch('/users/me', {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        address,
        avatar,
    })

    return response.data
}
