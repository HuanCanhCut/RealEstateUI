import React, { useRef } from 'react'
import { useNavigate } from 'react-router'
import { LogOutIcon, UserIcon } from 'lucide-react'
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
        {
            type: 'profile',
            icon: <UserIcon />,
            href: `${config.routes.userProfile.replace(':nickname', `@${currentUser?.nickname || ''}`)}`,
            label: 'Hồ sơ cá nhân',
        },
        {
            line: true,
            type: 'logout',
            icon: <LogOutIcon />,
            label: 'Đăng xuất',
        },
    ]

    return (
        <>
            {currentUser ? (
                <CustomTippy
                    renderItem={() => (
                        <PopperWrapper className="max-w-[280px] min-w-[280px] p-0 text-sm">
                            <section>
                                {userMenu.map((item: MenuItemType, index: number) => (
                                    <React.Fragment key={index}>
                                        <MenuItem item={item} onChoose={handleChoose} />
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
            ) : (
                <div className="flex items-center gap-2">
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
