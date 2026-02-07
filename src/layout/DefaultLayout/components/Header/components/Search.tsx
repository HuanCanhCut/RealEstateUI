import Input from '~/components/Input'

const Search = () => {
    return (
        <div className="flex w-full max-w-[500px] items-center justify-center px-4 sm:px-8">
            <Input type="text" name="search" placeholder="Tìm kiếm bất động sản" className="w-full rounded-4xl px-4" />
        </div>
    )
}

export default Search
