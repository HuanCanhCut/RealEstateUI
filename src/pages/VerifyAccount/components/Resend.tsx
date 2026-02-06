import { useEffect, useState } from 'react'
import moment from 'moment-timezone'

import * as authService from '~/services/authService'
import handleApiError from '~/utils/handleApiError'

interface ResendProps {
    createdAt?: string
}

const Resend: React.FC<ResendProps> = ({ createdAt }) => {
    const [counter, setCounter] = useState(() => {
        if (!createdAt) return 0

        const nowMoment = moment.tz(new Date(), 'Asia/Ho_Chi_Minh')

        return 60 - nowMoment.diff(moment.tz(createdAt, 'Asia/Ho_Chi_Minh'), 'seconds')
    })

    useEffect(() => {
        if (counter <= 0) return

        const timer = setInterval(() => {
            setCounter((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [counter])

    const handleResendCode = async () => {
        try {
            await authService.sendVerifyChallengeCode(
                new URLSearchParams(window.location.search).get('from_email') || '',
            )

            setCounter(60)
        } catch (error) {
            handleApiError({ error })
        }
    }
    return (
        <p className="mt-4 text-center text-sm select-none">
            Không nhận được mã?{' '}
            <span className="cursor-pointer text-[#B1A9FF] select-none">
                {counter < 60 && counter > 0 ? (
                    <span>
                        Gửi lại sau <span className="font-medium">{counter}</span> giây
                    </span>
                ) : (
                    <span onClick={handleResendCode}>Gửi lại ngay</span>
                )}
            </span>
        </p>
    )
}

export default Resend
