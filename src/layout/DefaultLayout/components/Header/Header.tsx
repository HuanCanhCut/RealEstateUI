import Interaction from './components/Interaction'
import Search from './components/Search'

const Header = () => {
    return (
        <div className="flex items-center justify-between px-8 py-2 shadow-sm">
            <img
                src="/static/media/logo.png"
                alt="logo"
                className="h-auto w-8.75 min-w-8.75 shrink-0 cursor-pointer object-cover sm:w-10"
            />

            <Search />

            <Interaction />
        </div>
    )
}

export default Header
