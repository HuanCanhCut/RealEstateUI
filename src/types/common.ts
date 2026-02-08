export interface BaseModel {
    id: number
    created_at: Date
    updated_at: Date
}

export interface MetaPagination {
    pagination: {
        total: number
        count: number
        total_pages: number
        current_page: number
        per_page: number
    }
    links: {
        prev?: string
        next?: string
    }
}

export interface APIResponsePagination<T> {
    data: T
    meta: MetaPagination
}

export interface APIResponse<T> {
    data: T
}
