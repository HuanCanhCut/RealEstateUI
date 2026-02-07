'use client'

import { memo, type RefObject, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import * as authService from '~/services/authService'
import handleApiError from '~/utils/handleApiError'

interface Props {
    emailRef: RefObject<HTMLInputElement | null>
}

const SendVerifyCode: React.FC<Props> = ({ emailRef }) => {
    const [sendSuccess, setSendSuccess] = useState(false)
    const [counter, setCounter] = useState(60)

    const timerId = useRef<any>(null)

    useEffect(() => {
        if (!sendSuccess) return

        timerId.current = setInterval(() => {
            setCounter((prev) => {
                return prev - 1
            })
        }, 1000)
    }, [sendSuccess])

    useEffect(() => {
        if (counter === 0) {
            clearInterval(timerId.current)

            requestIdleCallback(() => {
                setCounter(60)
                setSendSuccess(false)
            })
        }
    }, [counter])

    const handleSendCode = async () => {
        try {
            if (sendSuccess) return

            if (!emailRef.current?.value) {
                toast.error('Email không được bỏ trống')
                return
            }

            if (!/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(emailRef.current?.value)) {
                toast.error('Email không đúng định dạng')
                return
            }

            const response = await authService.sendResetPassCode(emailRef.current?.value)

            if (response) {
                toast.success(
                    'Mã xác nhận đã được gửi đến email của bạn, nếu không thấy hãy kiểm tra thư rác hoặc spam',
                    {
                        duration: 4000,
                    },
                )

                setSendSuccess(true)
            }
        } catch (error: any) {
            handleApiError({ error })
        }
    }

    return (
        <button
            type="button"
            className="bg-primary min-w-16 rounded-md px-2 text-sm font-medium text-white"
            onClick={handleSendCode}
        >
            {sendSuccess ? (
                <span className="flex h-full items-center justify-center text-lg leading-0">{counter}</span>
            ) : (
                'Gửi mã'
            )}
        </button>
    )
}

export default memo(SendVerifyCode)
