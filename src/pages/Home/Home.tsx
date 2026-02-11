import Filter from './components/Filter'
import Posts from './components/Posts'
import SidebarFilter from './components/SidebarFilter/SidebarFilter'

const HomePage = () => {
    return (
        <div className="container mx-auto flex flex-col gap-4 py-6 xl:max-w-7xl">
            <Filter />
            <div className="mt-2 grid grid-cols-12 gap-6">
                <Posts className="order-2 col-span-12 rounded-md bg-white shadow-md md:order-1 md:col-span-7 lg:col-span-8" />
                <SidebarFilter className="order-1 col-span-12 h-fit rounded-md md:order-2 md:col-span-5 lg:col-span-4" />
            </div>
        </div>
    )
}

export default HomePage
