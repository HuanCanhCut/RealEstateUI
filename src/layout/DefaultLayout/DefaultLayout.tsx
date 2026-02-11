import { Outlet } from 'react-router'

import Header from './components/Header'
import MobileSidebar from './components/MobileSidebar'

const DefaultLayout = () => {
    return (
        <div className="min-h-dvh bg-zinc-100">
            <MobileSidebar />
            <Header />
            <div className="pt-(--header-height)">
                <Outlet />
            </div>
        </div>
    )
}

export default DefaultLayout
