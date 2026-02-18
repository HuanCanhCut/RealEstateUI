import CategoryChart from './components/CategoryChart'
import CategoryManager from './components/CategoryManager'
import Overview from './components/Overview'

const Dashboard = () => {
    return (
        <div className="grid grid-cols-12 gap-6">
            <Overview className="border-border/70 col-span-12 rounded-md border bg-white p-[20px] lg:col-span-6 xl:col-span-3" />

            <div className="border-border/70 col-span-12 rounded-md border bg-white p-[20px] lg:col-span-6 xl:col-span-4">
                <CategoryChart />
            </div>
            <div className="border-border/70 col-span-12 rounded-md border bg-white p-[20px] lg:col-span-6 xl:col-span-4">
                <CategoryManager />
            </div>
            <div className="border-border/70 col-span-12 rounded-md border bg-white p-[20px] lg:col-span-6 xl:col-span-4">
                <CategoryManager />
            </div>
        </div>
    )
}

export default Dashboard
