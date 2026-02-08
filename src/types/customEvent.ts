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
}

export type { AppEvents }
