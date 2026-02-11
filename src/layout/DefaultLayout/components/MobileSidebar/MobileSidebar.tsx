import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowsUpFromLine, Heart, House, LayoutDashboard, LogOut, SquareChartGantt, X } from 'lucide-react'

import Button from '~/components/Button'
import UserAvatar from '~/components/UserAvatar/UserAvatar'
import config from '~/config'
import { listenEvent } from '~/helpers/events'
import { selectCurrentUser } from '~/redux/selector'
import { useAppSelector } from '~/redux/types'
import * as authService from '~/services/authService'
import { cn } from '~/utils/cn'

const MobileSidebar = () => {
    const navigate = useNavigate()

    const currentUser = useAppSelector(selectCurrentUser)

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        const remove = listenEvent('TOGGLE_MOBILE_SIDEBAR', () => {
            setIsSidebarOpen((prev) => !prev)
        })

        return remove
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsSidebarOpen(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    useEffect(() => {
        document.documentElement.style.overflow = isSidebarOpen ? 'hidden' : 'auto'
    }, [isSidebarOpen])

    const MENU = [
        {
            title: 'Trang chủ',
            to: config.routes.home,
            icon: <House size={16} />,
        },
    ]

    const USER_MENU = [
        ...MENU,
        {
            title: 'Quản lý bài đăng',
            to: '',
            icon: <SquareChartGantt size={16} />,
        },
        {
            title: 'Đăng tin',
            to: '',
            icon: <ArrowsUpFromLine size={16} />,
        },
        {
            title: 'Tin đã thích',
            to: '',
            icon: <Heart size={16} />,
        },
    ]

    const ADMIN_MENU = [
        {
            title: 'Dashboard',
            to: '',
            icon: <LayoutDashboard size={16} />,
        },
        ...USER_MENU,
    ]

    const MENU_LIST = () => {
        if (currentUser?.role === 'admin') {
            return ADMIN_MENU
        }

        if (currentUser?.role === 'customer') {
            return USER_MENU
        }

        return MENU
    }

    const handleLogout = () => {
        authService.logout()

        setIsSidebarOpen(false)
        navigate(0)
    }

    return (
        <div>
            <div
                className={cn(
                    'fixed top-0 bottom-0 left-0 z-60 w-full overflow-y-auto bg-white p-3 pb-16 transition duration-400 ease-in-out sm:w-90',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <Button
                    variant="ghost"
                    className="absolute top-3 right-3"
                    size="icon"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <X />
                </Button>

                {currentUser ? (
                    <div className="mt-16 flex flex-col items-center gap-3">
                        <UserAvatar src={currentUser.avatar} className="size-30" />
                        <div>
                            <p className="text-2xl font-semibold">{currentUser.full_name}</p>
                            <p className="text-sm text-zinc-500">{currentUser.phone_number}</p>

                            <Button
                                variant="secondary"
                                className="mt-4"
                                to={config.routes.profile.replace(':@nickname', `@${currentUser.nickname}`)}
                            >
                                Đi đến hồ sơ của bạn
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="mt-12 text-center text-2xl font-semibold">
                            Đăng nhập để trải nghiệm đầy đủ tính năng
                        </h2>
                        <div className="mt-6 flex items-center gap-3">
                            <Button
                                className="flex-1"
                                variant="secondary"
                                to={`${config.routes.register}?redirect=${window.location.pathname}`}
                            >
                                Đăng ký
                            </Button>
                            <Button
                                className="flex-1"
                                to={`${config.routes.login}?redirect=${window.location.pathname}`}
                            >
                                Đăng nhập
                            </Button>
                        </div>
                    </>
                )}

                <div className="mt-6 w-full">
                    {MENU_LIST().map((item) => (
                        <Link key={item.title} to={item.to}>
                            <Button variant="ghost" className="mt-2 flex w-full justify-start">
                                {item.icon}
                                {item.title}
                            </Button>
                        </Link>
                    ))}
                </div>

                <div className="absolute right-0 bottom-0 left-0 w-full px-3 py-3">
                    <Button
                        variant="secondary"
                        className="text-destructive flex w-full justify-start"
                        onClick={handleLogout}
                    >
                        <LogOut size={16} />
                        Đăng xuất
                    </Button>
                </div>
            </div>
            <div
                className={cn(
                    'fixed top-0 right-0 bottom-0 left-0 z-55 bg-black/30 transition duration-400 ease-in-out',
                    isSidebarOpen ? 'opacity-100' : 'invisible opacity-0',
                )}
                onClick={() => setIsSidebarOpen(false)}
            ></div>
        </div>
    )
}

export default MobileSidebar
