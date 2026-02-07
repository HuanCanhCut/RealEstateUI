import { Link } from 'react-router'
import { Menu } from 'lucide-react'

import Interaction from './components/Interaction'
import Search from './components/Search'
import LocationSelect from '~/components/LocationSelect'

const Header = () => {
    return (
        <div className="flex items-center justify-between px-4 py-2 shadow-sm sm:px-8">
            <div className="flex items-center">
                <Link to="/">
                    <img
                        src="/static/media/logo.png"
                        alt="logo"
                        className="hidden h-auto w-10 shrink-0 cursor-pointer object-cover sm:block"
                    />
                </Link>

                <Menu className="size-4 cursor-pointer sm:hidden" />

                <LocationSelect className="ml-4 hidden sm:flex" />
            </div>
            <Search />

            <Interaction />
        </div>
    )
}

export default Header
