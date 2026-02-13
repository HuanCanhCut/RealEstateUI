import React, { useRef } from 'react'
import { useNavigate } from 'react-router'
import { Heart, LayoutDashboard, LogOutIcon, UserIcon } from 'lucide-react'
import type { Instance, Props } from 'tippy.js'

import MenuItem from './MenuItem'
import Button from '~/components/Button'
import CustomTippy from '~/components/CustomTippy/CustomTippy'
import PopperWrapper from '~/components/PopperWrapper'
import UserAvatar from '~/components/UserAvatar/UserAvatar'
import config from '~/config'
import { setCurrentUser } from '~/redux/reducers/authSlice'
import { selectCurrentUser } from '~/redux/selector'
import { useAppDispatch, useAppSelector } from '~/redux/types'
import * as authService from '~/services/authService'

export interface MenuItemType {
    type: string
    icon: React.ReactNode
    label: string
    line?: boolean
    href?: string
    destructive?: boolean
}

const Interaction = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const tippyInstanceRef = useRef<Instance<Props>>(null)

    const currentUser = useAppSelector(selectCurrentUser)

    const handleChoose = async (type: MenuItemType['type']) => {
        switch (type) {
            case 'logout':
                tippyInstanceRef.current?.hide()
                await authService.logout()

                dispatch(setCurrentUser(null))

                navigate(0)
                break
        }
    }

    const userMenu: MenuItemType[] = [
        currentUser?.role === 'admin' && {
            type: 'admin',
            icon: <LayoutDashboard size={18} />,
            href: config.routes.dashboard,
            label: 'Dashboard',
        },
        {
            type: 'profile',
            icon: <UserIcon size={18} />,
            href: `${config.routes.userProfile.replace(':nickname', `@${currentUser?.nickname || ''}`)}`,
            label: 'Hồ sơ cá nhân',
        },
        {
            type: 'postsLiked',
            icon: <Heart size={18} />,
            href: `${config.routes.profile.replace(':@nickname', `@${currentUser?.nickname || ''}`)}?tab=liked`,
            label: 'Tin đã thích',
        },
        {
            line: true,
            type: 'logout',
            icon: <LogOutIcon size={18} />,
            label: 'Đăng xuất',
            destructive: true,
        },
    ].filter(Boolean) as MenuItemType[]

    return (
        <>
            {currentUser ? (
                <div className="flex items-center gap-2">
                    <Button variant={'default'} className="hidden md:flex">
                        Quản lý tin đăng
                    </Button>
                    <Button variant={'secondary'} className="hidden md:flex" to={config.routes.createPost}>
                        Đăng tin
                    </Button>

                    <CustomTippy
                        renderItem={() => (
                            <PopperWrapper className="max-w-70 min-w-70 p-0 text-sm">
                                <section>
                                    {userMenu.map((item: MenuItemType, index: number) => (
                                        <React.Fragment key={index}>
                                            <MenuItem
                                                item={item}
                                                onChoose={handleChoose}
                                                tippyInstanceRef={tippyInstanceRef}
                                            />
                                        </React.Fragment>
                                    ))}
                                </section>
                            </PopperWrapper>
                        )}
                        onShow={(instance) => {
                            tippyInstanceRef.current = instance
                        }}
                        placement="bottom-start"
                        offsetY={10}
                        timeDelayOpen={50}
                        timeDelayClose={250}
                    >
                        <UserAvatar src={currentUser.avatar} />
                    </CustomTippy>
                </div>
            ) : (
                <div className="hidden items-center gap-2 sm:flex">
                    <Button
                        variant={'outline'}
                        to={`${config.routes.register}?redirect_to=${window.location.pathname}`}
                    >
                        Đăng ký
                    </Button>
                    <Button variant={'default'} to={`${config.routes.login}?redirect_to=${window.location.pathname}`}>
                        Đăng nhập
                    </Button>
                </div>
            )}
        </>
    )
}

export default Interaction
