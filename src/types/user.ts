import type { BaseModel } from './common'

export interface UserModel extends BaseModel {
    first_name: string
    last_name: string
    full_name?: string
    nickname: string
    email?: string
    avatar?: string
    role: 'admin' | 'customer' | 'agent'
    address: string
    phone_number?: string
    is_active: boolean
    is_blocked: boolean
    post_count?: number
}

export interface UserResponse {
    data: UserModel
    meta?: {
        auth_challenge_id: string
    }
}
