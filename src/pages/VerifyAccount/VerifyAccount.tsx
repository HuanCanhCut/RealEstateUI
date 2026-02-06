'use client'

import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { OTPInput } from 'input-otp'
import { toast } from 'sonner'

import Resend from './components/Resend'
import { FakeDash, Slot } from '~/components/InputOTP/InputOTP'
import config from '~/config'
import * as authService from '~/services/authService'
import handleApiError from '~/utils/handleApiError'

const VerifyPage = () => {
    const [isVerified, setIsVerified] = useState<boolean>(false)

    const inputRef = useRef<HTMLInputElement>(null)

    const navigate = useNavigate()

    const [searchParams] = useSearchParams()
    const fromEmail = searchParams.get('from_email')

    const [value, setValue] = useState<string>('')

    const [authChallengePayload, setAuthChallengePayload] = useState<{
        auth_challenge_id: string
        created_at: string
    } | null>(null)

    const handleChange = (value: string) => {
        if (!Number.isNaN(Number(value))) {
            setValue(value)
        }
    }

    const handleComplete = async (value: string) => {
        try {
            const response = await authService.verifyAccount({
                email: new URLSearchParams(window.location.search).get('from_email') || '',
                code: value,
            })

            if (response) {
                toast.success('Xác thực tài khoản thành công')

                setTimeout(() => {
                    window.location.href = searchParams.get('redirect_to') || config.routes.home
                }, 1000)
            }
        } catch (error) {
            handleApiError({ error })
        }
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    useEffect(() => {
        ;(async () => {
            try {
                // validate auth_challenge_id
                const urlSearchPr = new URLSearchParams(window.location.search)

                const authChallengeId = urlSearchPr.get('auth_challenge_id')
                const fromEmail = urlSearchPr.get('from_email')

                if (!authChallengeId || !fromEmail) {
                    navigate(config.routes.login)
                    return
                }

                const { data } = await authService.verifyAuthChallengeId({
                    authChallengeId,
                    fromEmail: fromEmail || '',
                })

                setAuthChallengePayload(data)
                setIsVerified(true)
            } catch (error) {
                setIsVerified(false)
                handleApiError({ error })
                navigate(config.routes.login)
            }
        })()
    }, [navigate])

    return (
        <div className="flex-center h-dvh w-dvw flex-col gap-4 bg-black/95 text-white">
            <img
                src="/static/media/logo.png"
                className="h-auto w-[35px] min-w-[35px] shrink-0 cursor-pointer sm:w-[40px]"
                alt="logo"
            />
            <h2 className="font-medium">Xác minh email của bạn</h2>

            <div className="rounded-2xl bg-zinc-800 p-8">
                {!isVerified ? (
                    <p className="flex items-center gap-2">Đang xác thực Auth Challenge ID... </p>
                ) : (
                    <>
                        <p>Nhập mã được gửi đến</p>
                        <span className="font-medium">{fromEmail}</span>
                    </>
                )}

                <OTPInput
                    inputMode="numeric"
                    onChange={handleChange}
                    onComplete={handleComplete}
                    value={value}
                    ref={inputRef}
                    maxLength={6}
                    containerClassName="group flex mt-4 items-center has-[:disabled]:opacity-30"
                    render={({ slots }) => (
                        <>
                            <div className="flex">
                                {slots.slice(0, 3).map((slot, idx) => (
                                    <Slot key={idx} {...slot} />
                                ))}
                            </div>

                            <FakeDash />

                            <div className="flex">
                                {slots.slice(3).map((slot, idx) => (
                                    <Slot key={idx} {...slot} />
                                ))}
                            </div>
                        </>
                    )}
                />

                <Resend createdAt={authChallengePayload?.created_at} />
            </div>
        </div>
    )
}

export default VerifyPage
