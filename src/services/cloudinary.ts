import * as request from '~/utils/axiosClient'

export const createCloudinarySignature = async ({ folder }: { folder: string }) => {
    const response = await request.post('/cloudinary/signature', {
        folder,
    })
    return response.data
}
