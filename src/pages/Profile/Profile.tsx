import { useState } from 'react'
import { useParams } from 'react-router'
import { Clock, CloudUpload, Phone } from 'lucide-react'
import moment from 'moment'

import EditProfile from './components/EditProfile'
import { useQuery } from '@tanstack/react-query'
import Button from '~/components/Button'
import PopperWrapper from '~/components/PopperWrapper'
import UserAvatar from '~/components/UserAvatar/UserAvatar'
import { selectCurrentUser } from '~/redux/selector'
import { useAppSelector } from '~/redux/types'
import * as userService from '~/services/userService'

const Profile = () => {
    const { nickname } = useParams()

    const [isOpenModal, setIsOpenModal] = useState(false)

    const currentUser = useAppSelector(selectCurrentUser)

    const { data: user } = useQuery({
        queryKey: ['user', nickname],
        queryFn: () => userService.getUserByNickname(nickname?.slice(1) as string),
        enabled: !!nickname,
    })

    return (
        <div className="container mx-auto mt-8 max-w-7xl">
            <EditProfile isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} />

            <div className="grid grid-cols-12">
                <div className="col-span-12 md:col-span-3">
                    <PopperWrapper className="w-full max-w-full p-8 shadow-sm">
                        <div className="flex flex-col items-center">
                            <UserAvatar
                                src={user?.data.id === currentUser?.id ? currentUser?.avatar : user?.data.avatar}
                                className="size-32"
                            />

                            <p className="mt-4 text-xl font-bold">{user?.data.full_name}</p>
                            <p className="mt-1 text-sm text-zinc-500">{`@${user?.data.nickname}`}</p>
                        </div>

                        <div className="mt-4 flex flex-col gap-1">
                            <p className="flex items-center gap-2 text-sm">
                                <Phone size={14} />
                                {user?.data.phone_number || 'Không có số điện thoại'}
                            </p>
                            <p className="flex items-center gap-2 text-sm">
                                <Clock size={14} />
                                Tham gia từ {moment.tz(user?.data.created_at, 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
                            </p>
                            <p className="flex items-center gap-2 text-sm">
                                <CloudUpload size={14} />
                                <span>
                                    Đã đăng <span className="font-bold">{user?.data.post_count} </span> bài
                                </span>
                            </p>
                        </div>

                        {currentUser?.id === user?.data.id && (
                            <Button variant="secondary" className="mt-8 w-full" onClick={() => setIsOpenModal(true)}>
                                Chỉnh sửa hồ sơ
                            </Button>
                        )}
                    </PopperWrapper>
                </div>
                <div className="col-span-12 md:col-span-9"></div>
            </div>
        </div>
    )
}

export default Profile
