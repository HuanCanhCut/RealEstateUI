import Filter from './components/Filter'
import Posts from './components/Posts'

const HomePage = () => {
    return (
        <div className="container mx-auto flex flex-col gap-4 py-6 xl:max-w-7xl">
            <Filter />
            <div className="mt-2 grid grid-cols-12 gap-6">
                <Posts className="col-span-12 rounded-md bg-white shadow-md md:col-span-7 lg:col-span-8" />
                <div className="hidden h-full md:col-span-5 md:block lg:col-span-4">Sidebar</div>
            </div>
        </div>
    )
}

export default HomePage
