import type { CommentModel } from './comment'

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
    REPLY_COMMENT: {
        comment: CommentModel
    }

    TOGGLE_MOBILE_SIDEBAR: undefined

    TOGGLE_EDIT_PROFILE: undefined
}

export type { AppEvents }
