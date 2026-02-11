import { Link } from 'react-router'
import { Menu } from 'lucide-react'

import Interaction from './components/Interaction'
import Search from './components/Search'
import Button from '~/components/Button'
import LocationSelect from '~/components/LocationSelect'
import { sendEvent } from '~/helpers/events'

const Header = () => {
    const handleToggleSidebar = () => {
        sendEvent('TOGGLE_MOBILE_SIDEBAR')
    }

    return (
        <div className="fixed top-0 right-0 left-0 z-50 flex h-(--header-height) items-center justify-between border-b border-zinc-300 bg-white px-4 py-2 sm:px-8">
            <div className="flex items-center">
                <Link to="/">
                    <img
                        src="/static/media/logo.png"
                        alt="logo"
                        className="hidden h-auto w-10 min-w-10 shrink-0 cursor-pointer object-cover sm:block"
                    />
                </Link>

                <Button variant="ghost" size="icon" onClick={handleToggleSidebar}>
                    <Menu className="size-4 cursor-pointer sm:hidden" />
                </Button>

                <LocationSelect className="ml-4 hidden sm:flex" />
            </div>
            <Search />

            <Interaction />
        </div>
    )
}

export default Header
