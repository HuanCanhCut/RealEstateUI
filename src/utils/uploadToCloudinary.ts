import { toast } from 'sonner'

import * as cloudinaryService from '~/services/cloudinary'

const uploadToCloudinary = async ({
    file,
    folder,
    type,
    toastId,
}: {
    file: File
    folder: string
    type: string
    toastId?: string
}) => {
    try {
        const { data: signatureResult } = await cloudinaryService.createCloudinarySignature({
            folder: folder,
        })

        const formData = new FormData()
        formData.append('file', file)
        formData.append('api_key', signatureResult.api_key)
        formData.append('timestamp', `${signatureResult.timestamp}`)
        formData.append('signature', signatureResult.signature)
        formData.append('folder', signatureResult.folder)

        // Upload to Cloudinary
        const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${signatureResult.cloud_name}/${type}/upload`,
            {
                method: 'POST',
                body: formData,
            },
        )

        return await uploadResponse.json()
    } catch (_) {
        toast.error('Lỗi khi tải lên ảnh', {
            id: toastId?.toString(),
        })

        return null
    }
}

export default uploadToCloudinary
