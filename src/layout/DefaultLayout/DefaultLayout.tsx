import { Outlet } from 'react-router'

import Header from './components/Header'

const DefaultLayout = () => {
    return (
        <div className="min-h-dvh bg-zinc-100">
            <Header />
            <div className="pt-(--header-height)">
                <Outlet />
            </div>
        </div>
    )
}

export default DefaultLayout
