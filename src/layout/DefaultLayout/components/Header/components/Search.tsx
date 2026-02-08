import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import TippyHeadless from 'huanpenguin-tippy-react/headless'
import type { Placement } from 'tippy.js'

import Input from '~/components/Input'
import PopperWrapper from '~/components/PopperWrapper'
import config from '~/config'
import useDebounce from '~/hooks/useDebounce'
import * as postService from '~/services/postService'
import type { PostModel } from '~/types/post'
import handleApiError from '~/utils/handleApiError'

const Search = () => {
    const [searchResult, setSearchResult] = useState<PostModel[]>([])
    const [searchValue, setSearchValue] = useState('')
    const [showResult, setShowResult] = useState(false)

    const debounceValue = useDebounce(searchValue, 500)

    useEffect(() => {
        if (!debounceValue.trim()) {
            return
        }

        const fetchSearch = async () => {
            try {
                const { data } = await postService.searchPosts(debounceValue)

                setSearchResult(data)
                setShowResult(true)
            } catch (error) {
                handleApiError({ error })
            }
        }

        fetchSearch()
    }, [debounceValue])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchValue(value)

        if (!value.trim()) {
            setSearchResult([])
            setShowResult(false)
        }
    }

    const renderResult = (attrs: {
        'data-placement': Placement
        'data-reference-hidden'?: string
        'data-escaped'?: string
    }) => {
        return (
            <PopperWrapper {...attrs} className="w-full">
                {searchResult.map((post) => (
                    <Link
                        to={`${config.routes.postDetail.replace(':id', post.id.toString())}`}
                        key={post.id}
                        className="flex cursor-pointer gap-2 rounded-sm p-2 hover:bg-gray-100/70"
                    >
                        <img
                            className="size-16 rounded-sm object-cover"
                            src={JSON.parse(post.images || '[]')[0]}
                            alt=""
                        />
                        <div>
                            <h3 className="text-base font-medium">{post.title}</h3>
                            <p className="line-clamp-1 max-w-full truncate text-sm whitespace-pre-wrap text-gray-500">
                                {post.description}
                            </p>
                            <p className="text-sm text-gray-500">{post.administrative_address}</p>
                        </div>
                    </Link>
                ))}
            </PopperWrapper>
        )
    }

    const handleClickOutside = () => {
        setShowResult(false)
    }

    const handleFocus = () => {
        setShowResult(true)
    }

    return (
        <div className="relative flex w-full max-w-[500px] items-center justify-center px-4 sm:px-8">
            <TippyHeadless
                interactive
                visible={showResult && searchResult.length > 0}
                render={renderResult}
                placement="bottom-start"
                offset={[0, 8]}
                onClickOutside={handleClickOutside}
                popperOptions={{
                    modifiers: [
                        {
                            enabled: true,
                            fn({ state }) {
                                state.styles.popper.width = `${state.rects.reference.width}px`
                            },
                            phase: 'main',
                        },
                    ],
                }}
            >
                <Input
                    type="text"
                    name="search"
                    placeholder="Tìm kiếm bất động sản"
                    className="w-full rounded-4xl px-4"
                    value={searchValue}
                    onFocus={handleFocus}
                    onChange={handleChange}
                />
            </TippyHeadless>
        </div>
    )
}

export default Search
