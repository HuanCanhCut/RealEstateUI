import { useState } from 'react'
import { useForm } from 'react-hook-form'
import ReactModal from 'react-modal'
import { CameraIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import Button from '~/components/Button'
import Input from '~/components/Input'
import PopperWrapper from '~/components/PopperWrapper'
import Spinner from '~/components/Spinner'
import UserAvatar from '~/components/UserAvatar/UserAvatar'
import { setCurrentUser } from '~/redux/reducers/authSlice'
import { selectCurrentUser } from '~/redux/selector'
import { useAppDispatch, useAppSelector } from '~/redux/types'
import * as meService from '~/services/meService'
import handleApiError from '~/utils/handleApiError'
import uploadToCloudinary from '~/utils/uploadToCloudinary'

interface EditProfileProps {
    isOpen: boolean
    onClose: () => void
}

const editProfileSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, { message: 'Tên đầy đủ không được bỏ trống' })
        .refine((value) => value.split(/\s+/).length >= 2, {
            message: 'Tên đầy đủ phải có ít nhất 2 từ',
        }),
    phoneNumber: z
        .string()
        .min(1, { message: 'Số điện thoại không được bỏ trống' })
        .length(10, 'Số điện thoại phải có 10 kí tự')
        .regex(/^(0)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ'),
    address: z.string().min(1, { message: 'Địa chỉ không được bỏ trống' }),
})

type FieldValue = z.infer<typeof editProfileSchema>

const EditProfile: React.FC<EditProfileProps> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch()

    const currentUser = useAppSelector(selectCurrentUser)

    const [avatar, setAvatar] = useState<(File & { preview?: string }) | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<FieldValue>({
        mode: 'onChange',
        defaultValues: {
            fullName: currentUser?.full_name,
            phoneNumber: currentUser?.phone_number || '',
            address: currentUser?.address,
        },
        resolver: zodResolver(editProfileSchema),
    })

    const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] as File & { preview?: string }

        if (avatar?.preview) {
            // remove old blob
            URL.revokeObjectURL(avatar.preview)
        }

        if (file) {
            const blob = URL.createObjectURL(file)

            file.preview = blob

            setAvatar(file)
        }
    }

    const handleUpdateProfile = async (data: FieldValue) => {
        if (!currentUser) {
            return
        }

        if (!isDirty && !avatar) {
            toast.info('Không có thay đổi nào để lưu')

            return
        }

        const toastId = toast.loading('Đang cập nhật hồ sơ')

        try {
            let avatarUrl = currentUser.avatar

            if (avatar) {
                const result = await uploadToCloudinary({
                    file: avatar,
                    folder: `real_estate/user/avatar`,
                    type: 'image',
                    toastId: toastId.toString(),
                })

                if (result) {
                    avatarUrl = result.secure_url
                }
            }

            const [firstName, ...lastName] = data.fullName.split(' ')

            const response = await meService.updateCurrentUser({
                firstName,
                lastName: lastName.join(' '),
                avatar: avatarUrl,
                phoneNumber: data.phoneNumber,
                address: data.address,
            })

            if (response) {
                toast.success('Cập nhật hồ sơ thành công', {
                    id: toastId,
                })

                dispatch(setCurrentUser({ ...currentUser, ...response.data }))
            }
        } catch (error) {
            handleApiError({ error, toastId: toastId })
        }
    }

    return (
        <ReactModal
            isOpen={isOpen}
            ariaHideApp={false}
            overlayClassName="overlay"
            closeTimeoutMS={200}
            className="modal"
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            onRequestClose={onClose}
            onAfterClose={() => {
                if (avatar?.preview) {
                    URL.revokeObjectURL(avatar.preview)
                }

                reset()

                setAvatar(null)
            }}
        >
            <PopperWrapper className="relative max-w-[425px] p-8">
                <form onSubmit={handleSubmit(handleUpdateProfile)} className="w-full">
                    <h2 className="text-lg leading-none font-semibold">Cập nhật hồ sơ</h2>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Chỉnh sửa thông tin cá nhân của bạn tại đây. Nhấn lưu khi hoàn tất.
                    </p>

                    <Button variant="ghost" size="icon-sm" className="absolute top-3 right-3" onClick={onClose}>
                        <XIcon className="size-4" />
                    </Button>

                    <div className="mt-4 flex w-full items-center justify-center">
                        <div className="relative">
                            <UserAvatar src={avatar?.preview || currentUser?.avatar} className="size-36" />
                            <label
                                htmlFor="avatar"
                                className="bg-primary-foreground absolute right-2 bottom-0 z-10 cursor-pointer rounded-full p-2"
                            >
                                <CameraIcon className="size-4" />
                            </label>

                            <input type="file" name="avatar" id="avatar" hidden onChange={handleChangeAvatar} />
                        </div>
                    </div>
                    <div className="mt-6">
                        <div>
                            <label className="ml-0.5 text-sm font-semibold">Tên đầy đủ</label>
                            <Input
                                className="mt-0.5 bg-transparent px-3 py-2.5 text-sm"
                                placeholder="Họ và tên của bạn"
                                {...register('fullName')}
                            />
                            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
                        </div>
                        <div className="mt-3">
                            <label className="ml-0.5 text-sm font-semibold">Số điện thoại</label>
                            <Input
                                className="mt-0.5 bg-transparent px-3 py-2.5 text-sm"
                                placeholder="Số điện thoại của bạn"
                                {...register('phoneNumber')}
                            />
                            {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
                        </div>
                        <div className="mt-3">
                            <label className="ml-0.5 text-sm font-semibold">Địa chỉ</label>
                            <Input
                                className="mt-0.5 bg-transparent px-3 py-2.5 text-sm"
                                placeholder="Địa chỉ của bạn"
                                {...register('address')}
                            />
                            {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" onClick={onClose} variant={'outline'}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Spinner /> : 'Lưu thông tin'}
                        </Button>
                    </div>
                </form>
            </PopperWrapper>
        </ReactModal>
    )
}

export default EditProfile
