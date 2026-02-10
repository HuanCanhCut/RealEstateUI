import { calculatePricePerM2, formatVNPrice } from '~/utils/calculatePricePerM2'
import { cn } from '~/utils/cn'

interface PricePerMeterProps {
    price: number | string
    area: number | string
    className?: string
}

const PricePerMeter: React.FC<PricePerMeterProps> = ({ price, area, className }) => {
    return (
        <div className={cn('mt-1 flex items-center gap-2 text-sm text-zinc-500', className)}>
            <span className="text-lg font-bold text-red-500">{formatVNPrice(price)}</span>
            <span className="text-sm">{calculatePricePerM2(price, area).replace('triệu', 'tr')}/m²</span>
            <span className="text-sm">{area} m²</span>
        </div>
    )
}

export default PricePerMeter
