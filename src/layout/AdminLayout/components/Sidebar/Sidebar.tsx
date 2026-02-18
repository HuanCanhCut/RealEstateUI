import { useEffect, useState } from 'react'
import { NavLink } from 'react-router'
import { BarChart, FileText, LayoutDashboard, SquareChartGantt } from 'lucide-react'

import config from '~/config'
import { listenEvent } from '~/helpers/events'
import { cn } from '~/utils/cn'

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const remove = listenEvent('TOGGLE_MOBILE_SIDEBAR', () => {
            setIsOpen((prev) => !prev)
        })

        return remove
    }, [])

    return (
        <p>
            <div
                className={cn('fixed top-0 right-0 bottom-0 left-0 bg-black/30', {
                    'pointer-events-none opacity-0': !isOpen,
                })}
                onClick={() => {
                    setIsOpen(false)
                }}
            ></div>

            <aside
                className={cn(
                    'border-border/70 fixed top-0 bottom-0 left-0 z-10 w-72.5 -translate-x-full [overflow-y:overlay] border-r bg-white p-3 transition-all duration-300 ease-in-out md:block md:translate-x-0',
                    isOpen && 'translate-x-0',
                )}
            >
                <h2 className="p-2 text-center text-xl font-bold">ADMIN DASHBOARD</h2>

                <p className="mt-10 text-sm text-gray-500">MENU</p>

                <ul>
                    <li>
                        <NavLink
                            to={config.routes.dashboard}
                            className={({ isActive }) => {
                                return cn(
                                    'hover:bg-primary/4 mt-2 flex items-center gap-2 rounded-md px-2 py-3 text-sm font-medium select-none',
                                    isActive && 'text-primary bg-primary/6',
                                )
                            }}
                        >
                            <LayoutDashboard size={18} />
                            Trang chủ
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={config.routes.posts}
                            className={({ isActive }) => {
                                return cn(
                                    'hover:bg-primary/4 mt-2 flex items-center gap-2 rounded-md px-2 py-3 text-sm font-medium select-none',
                                    isActive && 'text-primary bg-primary/6',
                                )
                            }}
                        >
                            <SquareChartGantt size={18} />
                            Tin đăng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={config.routes.contracts}
                            className={({ isActive }) => {
                                return cn(
                                    'hover:bg-primary/4 mt-2 flex items-center gap-2 rounded-md px-2 py-3 text-sm font-medium select-none',
                                    isActive && 'text-primary bg-primary/6',
                                )
                            }}
                        >
                            <FileText size={18} />
                            Hợp đồng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={config.routes.reports}
                            className={({ isActive }) => {
                                return cn(
                                    'hover:bg-primary/4 mt-2 flex items-center gap-2 rounded-md px-2 py-3 text-sm font-medium select-none',
                                    isActive && 'text-primary bg-primary/6',
                                )
                            }}
                        >
                            <BarChart size={18} />
                            Báo cáo
                        </NavLink>
                    </li>
                </ul>
            </aside>
        </p>
    )
}

export default Sidebar
