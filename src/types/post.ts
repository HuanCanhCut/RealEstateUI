import type { BaseModel } from './common'

export interface PostModel extends BaseModel {
    title: string
    description: string
    administrative_address: string
    sub_locality: string
    type: 'sell' | 'rent'
    images?: string
    approval_status: 'approved' | 'pending' | 'rejected'
    handover_status: 'not_delivered' | 'delivered'
    category_id: number
    user_id: number
    role: 'user' | 'agent'
}
