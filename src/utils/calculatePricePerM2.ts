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

export { calculatePricePerM2, formatVNPrice }
