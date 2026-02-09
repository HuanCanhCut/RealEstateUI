import { cn } from '~/utils/cn'

interface PricePerMeterProps {
    price: number | string
    area: number | string
    className?: string
}

const PricePerMeter: React.FC<PricePerMeterProps> = ({ price, area, className }) => {
    const formatVNPrice = (price: number | string) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price

        const billion = 1000000000
        const million = 1000000

        if (numPrice >= billion) {
            const billions = numPrice / billion

            if (billions % 1 === 0) {
                return `${billions} tỷ`
            }

            return `${billions.toFixed(1)} tỷ`
        } else {
            const millions = numPrice / million

            return `${millions} triệu`
        }
    }

    const calculatePricePerM2 = (totalPrice: number | string, area: number | string) => {
        const numPrice = typeof totalPrice === 'string' ? parseFloat(totalPrice) : totalPrice
        const numArea = typeof area === 'string' ? parseFloat(area) : area

        const pricePerM2 = numPrice / numArea

        return formatVNPrice(pricePerM2)
    }

    return (
        <div className={cn('mt-1 flex items-center gap-2 text-sm text-zinc-500', className)}>
            <span className="text-lg font-bold text-red-500">{formatVNPrice(price)}</span>
            <span className="text-sm">{calculatePricePerM2(price, area).replace('triệu', 'tr')}/m²</span>
            <span className="text-sm">{area} m²</span>
        </div>
    )
}

export default PricePerMeter
