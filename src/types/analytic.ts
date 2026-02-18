export interface Overview {
    total_posts: number
    approved_posts: number
    pending_posts: number
    total_users: number
    previous_overview: Omit<Overview, 'previous_overview'>
}
