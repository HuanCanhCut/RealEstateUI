import PopperWrapper from '~/components/PopperWrapper'
import type { PostModel } from '~/types/post'
import { calculatePricePerM2 } from '~/utils/calculatePricePerM2'

interface DetailProps {
    post: PostModel
}

interface DataMapping {
    label: string
    value: string | number | undefined
    image: string
}

const Detail: React.FC<DetailProps> = ({ post }) => {
    const dataMapping: DataMapping[] = [
        {
            label: 'Tình trạng',
            value: post.handover_status === 'not_delivered' ? 'Chưa bàn giao' : 'Đã bàn giao',
            image: '/static/media/property_status.png',
        },
        {
            label: 'Loại hình nhà ở',
            value: post.category.name,
            image: '/static/media/house_type.png',
        },
        {
            label: 'Diện tích',
            value: post.detail.area,
            image: '/static/media/size.png',
        },
        {
            label: 'Giá/m²',
            value: calculatePricePerM2(post.detail.price, post.detail.area),
            image: '/static/media/price_m2.png',
        },
        {
            label: 'Hướng cửa chính',
            value: post.detail.main_door,
            image: '/static/media/direction.png',
        },
        {
            label: 'Hướng ban công',
            value: post.detail.balcony,
            image: '/static/media/balcony_direction.png',
        },
        {
            label: 'Giấy tờ pháp lý',
            value: post.detail.legal_documents,
            image: '/static/media/property_legal_document.png',
        },
        {
            label: 'Tình trạng nội thất',
            value: post.detail.interior_status,
            image: '/static/media/interior_status.png',
        },
        {
            label: 'Số phòng ngủ',
            value: post.detail.bedrooms,
            image: '/static/media/rooms.png',
        },
        {
            label: 'Số phòng vệ sinh',
            value: post.detail.bathrooms,
            image: '/static/media/toilets.png',
        },
    ]

    return (
        <>
            <PopperWrapper className="mt-6 max-w-full divide-y divide-zinc-200/60 border-none p-4">
                {dataMapping.map((item) => {
                    if (!item.value) {
                        return null
                    }

                    return (
                        <div key={item.label} className="flex items-center gap-2">
                            <div className="flex w-full items-center gap-2 py-2">
                                <img src={item.image} alt={item.label} className="size-4" />
                                <span>{item.label}</span>
                            </div>
                            <div className="flex w-full items-center gap-2 py-2">
                                <span className="font-medium">{item.value}</span>
                            </div>
                        </div>
                    )
                })}
            </PopperWrapper>

            <PopperWrapper className="mt-6 max-w-full p-4">
                <h2 className="text-xl font-bold">Mô tả chi tiết</h2>
                <p className="mt-2 whitespace-pre-wrap text-zinc-700">{post.description}</p>
            </PopperWrapper>
        </>
    )
}

export default Detail
