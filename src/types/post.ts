import type { CategoryModel } from './category'
import type { BaseModel } from './common'
import type { UserModel } from './user'

export interface PostDetailModel {
    post_id: number
    bedrooms?: number
    bathrooms?: number
    balcony?: string
    main_door?: string
    legal_documents?: string
    interior_status?: string
    area: number
    price: number
    deposit: number
}
export interface PostModel extends BaseModel {
    title: string
    description: string
    administrative_address: string
    sub_locality: string
    type: 'sell' | 'rent'
    images: string
    approval_status: 'approved' | 'pending' | 'rejected'
    handover_status: 'not_delivered' | 'delivered'
    category_id: number
    user_id: number
    role: 'personal' | 'agent'
    is_liked?: boolean
    detail: PostDetailModel
    category: CategoryModel
    user: UserModel
}
