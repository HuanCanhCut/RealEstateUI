import { Outlet } from 'react-router'
import { Menu } from 'lucide-react'

import Interaction from '../DefaultLayout/components/Header/components/Interaction'
import Sidebar from './components/Sidebar'
import Button from '~/components/Button'
import { sendEvent } from '~/helpers/events'
import { selectCurrentUser } from '~/redux/selector'
import { useAppSelector } from '~/redux/types'

const AdminLayout = () => {
    const currentUser = useAppSelector(selectCurrentUser)

    const handleToggleSidebar = () => {
        sendEvent('TOGGLE_MOBILE_SIDEBAR')
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex min-h-dvh w-full flex-col">
                <header className="border-border/70 flex w-full justify-between border-b bg-white p-4">
                    <Button variant={'ghost'} size={'icon'} onClick={handleToggleSidebar}>
                        <Menu size={18} />
                    </Button>

                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{currentUser?.full_name}</p>
                        <Interaction />
                    </div>
                </header>
                <main className="flex-1 bg-[rgb(249_250_251)] md:ml-72.5">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
