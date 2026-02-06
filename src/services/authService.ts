import type { AxiosResponse } from 'axios'

import type { UserResponse } from '~/types/user'
import * as request from '~/utils/axiosClient'

interface RegisterProps {
    fullname: string
    email: string
    password: string
}

interface RegisterResponse extends UserResponse {
    meta: {
        auth_challenge_id: string
    }
}

export const register = async ({ fullname, email, password }: RegisterProps): Promise<RegisterResponse> => {
    const response = await request.post('/auth/register', {
        fullname,
        email,
        password,
    })

    return response.data
}

export const login = async ({ email, password }: Omit<RegisterProps, 'fullname'>): Promise<UserResponse> => {
    const response = await request.post('/auth/login', {
        email,
        password,
    })

    return response.data
}

export const logout = async (): Promise<AxiosResponse<void>> => {
    return await request.post('/auth/logout')
}

export const loginWithGoogle = async (token: string): Promise<UserResponse> => {
    const response = await request.post('/auth/loginwithtoken', {
        token,
    })

    return response.data
}

export const sendResetPassCode = async (email: string): Promise<AxiosResponse<void>> => {
    return await request.post('/auth/forgot-password', {
        email,
    })
}

export const resetPassword = async ({
    email,
    password,
    code,
}: {
    email: string
    password: string
    code: string
}): Promise<AxiosResponse<void>> => {
    return await request.post('/auth/reset-password', {
        email,
        password,
        code,
    })
}

export const verifyAuthChallengeId = async ({
    authChallengeId,
    fromEmail,
}: {
    authChallengeId: string
    fromEmail: string
}): Promise<{ data: { auth_challenge_id: string; created_at: string } }> => {
    const response = await request.get(`/auth/verification/challenge/${authChallengeId}`, {
        params: {
            email: fromEmail,
        },
    })

    return response.data
}

export const sendVerifyChallengeCode = async (email: string): Promise<AxiosResponse<void>> => {
    return await request.post('/auth/verification/send', {
        email,
    })
}

export const verifyAccount = async ({
    email,
    code,
}: {
    email: string
    code: string
}): Promise<AxiosResponse<{ message: string }>> => {
    const res = await request.post('/auth/verification/verify', {
        email,
        code,
    })

    return res.data
}
