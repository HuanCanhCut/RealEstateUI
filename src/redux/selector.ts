import type { RootState } from './store'

export const getCurrentUser = (state: RootState) => state.user.currentUser
