import { createSlice } from '@reduxjs/toolkit'

interface UserModel {
    id: string
    name: string
    email: string
}

const initialState: {
    currentUser: UserModel | null
} = {
    currentUser: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: (state, { payload }: { payload: UserModel | null }) => {
            state.currentUser = payload
        },
    },
})

export const { setCurrentUser } = userSlice.actions

export default userSlice.reducer
