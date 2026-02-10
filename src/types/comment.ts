import type { BaseModel } from './common'
import type { UserModel } from './user'

export interface CommentModel extends BaseModel {
    user_id: number
    post_id: number
    parent_id?: number | null
    content: string
    user: UserModel
    reply_count: number
    replies: CommentModel[]
}

export interface CommentResponse {
    data: CommentModel[]
    meta: {
        pagination: {
            total: number
            count: number
            limit: number
            offset: number
        }
    }
}
