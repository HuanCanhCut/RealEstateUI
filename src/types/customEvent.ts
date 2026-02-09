interface AppEvents {
    SELECT_LOCATION: {
        location: {
            province: string
            district: string
            ward: string
        }
    }
    SELECT_CATEGORY: {
        category_id: number | null
    }
    SELECT_PROVINCE: {
        province: string
    }
    SELECT_PRICE_RANGE: {
        minPrice: number | null
        maxPrice: number | null
    }
}

export type { AppEvents }
