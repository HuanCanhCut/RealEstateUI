import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { ChevronLeft, MapPin } from 'lucide-react'
import type { Instance, Props } from 'tippy.js'

import Button from '../Button'
import CustomTippy from '../CustomTippy/CustomTippy'
import PopperWrapper from '../PopperWrapper'
import { listenEvent, sendEvent } from '~/helpers/events'
import { cn } from '~/utils/cn'

interface LocationSelectProps {
    className?: string
}

interface Ward {
    name: string
    pre: string
}

interface District {
    name: string
    pre: string
    ward?: Ward[]
}

interface Province {
    code: string
    file_path: string
    district?: District[]
}

interface SelectData {
    type: 'province' | 'district' | 'ward' | ''
    data: {
        [key: string]: Province
    }
}

const LocationSelect: React.FC<LocationSelectProps> = ({ className }) => {
    const tippyInstance = useRef<Instance<Props> | null>(null)

    const [selectData, setSelectData] = useState<SelectData>({
        type: '',
        data: {},
    })

    const [location, setLocation] = useState<{ province: string; district: string; ward: string }>({
        province: '',
        district: '',
        ward: '',
    })

    const fields: { label: string; value: keyof typeof location }[] = [
        {
            label: 'Chọn tỉnh/thành phố',
            value: 'province',
        },
        {
            label: 'Chọn quận huyện',
            value: 'district',
        },
        {
            label: 'Chọn phường xã',
            value: 'ward',
        },
    ]

    useEffect(() => {
        const remove = listenEvent('SELECT_PROVINCE', ({ province }) => {
            setLocation((prev) => {
                return {
                    ...prev,
                    province: province,
                }
            })

            sendEvent('SELECT_LOCATION', {
                location: {
                    ...location,
                    province: province,
                },
            })
        })

        return remove
    }, [location])

    const handleSelect = async (type: keyof typeof location) => {
        switch (type) {
            case 'province':
                {
                    const { data } = await axios.get('/public/locations/index.json')

                    setSelectData({
                        type: 'province',
                        data: data,
                    })
                }

                break
            case 'district':
                {
                    setSelectData((prev) => {
                        return {
                            ...prev,
                            type: 'district',
                        }
                    })

                    if (location.province) {
                        // if district is not in the data, fetch it from the file
                        if (!selectData.data[location.province]?.district) {
                            const { data } = await axios.get(`/public/${selectData.data[location.province].file_path}`)

                            setSelectData((prev) => {
                                return {
                                    ...prev,
                                    data: {
                                        ...prev.data,
                                        [location.province]: {
                                            ...prev.data[location.province],
                                            district: data.district,
                                        },
                                    },
                                }
                            })
                        }
                    }
                }
                break
            case 'ward':
                setSelectData((prev) => {
                    return {
                        ...prev,
                        type: 'ward',
                    }
                })
                break
        }
    }

    const handleClearAll = () => {
        setLocation({
            province: '',
            district: '',
            ward: '',
        })

        tippyInstance.current?.hide()
    }

    const handleApply = () => {
        sendEvent('SELECT_LOCATION', { location })
        tippyInstance.current?.hide()
    }

    const render = () => {
        return (
            <PopperWrapper className="hidden w-100 p-4 sm:block">
                {selectData.type ? (
                    (() => {
                        let data: string[] = []

                        switch (selectData.type) {
                            case 'province':
                                data = Object.keys(selectData.data)
                                break
                            case 'district':
                                data =
                                    selectData.data[location.province]?.district?.map((item) => {
                                        return `${item.pre} ${item.name}`
                                    }) || []
                                break
                            case 'ward':
                                data =
                                    selectData.data[location.province].district
                                        ?.find((item) => {
                                            return `${item.pre} ${item.name}` === location.district
                                        })
                                        ?.ward?.map((item) => {
                                            return `${item.pre} ${item.name}`
                                        }) || []
                        }

                        return (
                            <div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setSelectData((prev) => {
                                            return {
                                                ...prev,
                                                type: '',
                                            }
                                        })
                                    }}
                                >
                                    <ChevronLeft size={24} />
                                </Button>

                                {data.sort().map((name) => {
                                    return (
                                        <Button
                                            key={name}
                                            variant="outline"
                                            className="relative mt-2 flex w-full justify-start"
                                            onClick={() => {
                                                setLocation((prev) => {
                                                    return {
                                                        ...prev,
                                                        [selectData.type]: name,
                                                    }
                                                })

                                                setSelectData((prev) => {
                                                    return {
                                                        ...prev,
                                                        type: '',
                                                    }
                                                })
                                            }}
                                        >
                                            {name}

                                            <div className="border-primary/50 absolute top-1/2 right-2 h-5 w-5 -translate-y-1/2 rounded-full border"></div>
                                        </Button>
                                    )
                                })}
                            </div>
                        )
                    })()
                ) : (
                    <>
                        <p>Tìm kiếm theo khu vực</p>
                        <div className="mt-2 flex flex-col gap-2">
                            {fields.map((field) => (
                                <Button
                                    key={field.value}
                                    variant={'outline'}
                                    className="border-primary/20! flex h-auto w-full flex-col items-start gap-0 border!"
                                    onClick={() => handleSelect(field.value)}
                                >
                                    {field.label}
                                    {location[field.value] && (
                                        <span className="text-primary">{location[field.value]}</span>
                                    )}
                                </Button>
                            ))}
                        </div>

                        <div className="mt-6 flex gap-2">
                            <Button variant={'secondary'} className="flex-1" onClick={handleClearAll}>
                                Xóa hết
                            </Button>
                            <Button className="flex-1" onClick={handleApply}>
                                Áp dụng
                            </Button>
                        </div>
                    </>
                )}
            </PopperWrapper>
        )
    }

    return (
        <CustomTippy
            renderItem={render}
            offsetY={10}
            placement="bottom-start"
            onShow={(instance) => {
                tippyInstance.current = instance
            }}
        >
            <div
                className={cn(
                    'bg-primary/20 border-primary flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2',
                    className,
                )}
            >
                <MapPin size={16} />
                <span className="hidden whitespace-nowrap select-none md:block">
                    {location.province || 'Chọn vị trí'}
                </span>
            </div>
        </CustomTippy>
    )
}

export default LocationSelect
