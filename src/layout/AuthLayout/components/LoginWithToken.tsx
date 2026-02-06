// import { useRouter } from 'next/navigation'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router'
import { signInWithPopup } from 'firebase/auth'
import { toast } from 'sonner'

import config from '~/config'
import * as authServices from '~/services/authService'

const LoginWithToken = () => {
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()

    const handleLoginWithGoogle = async () => {
        try {
            const { user }: any = await signInWithPopup(config.firebaseAuth, config.googleProvider)

            if (user) {
                const response = await authServices.loginWithGoogle(user.accessToken)

                if (response) {
                    if (!response.data.is_active) {
                        navigate(
                            `${config.routes.verify}?auth_challenge_id=${encodeURIComponent(response.meta?.auth_challenge_id || '')}&redirect_to=${window.location.origin}${config.routes.home}&from_email=${encodeURIComponent(user.email)}`,
                        )
                    } else {
                        if (searchParams.get('redirect_to')) {
                            window.location.href = searchParams.get('redirect_to') || config.routes.home
                            return
                        }

                        window.location.reload()
                    }
                }
            }
        } catch (error: any) {
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                console.error(error)
                toast.error('Đăng nhập thất bại, vui lòng thử lại hoặc liên hệ admin để xử lí.')
            }
        }
    }

    return (
        <>
            <ul className="mt-3 flex items-center justify-center gap-4">
                <li className="cursor-pointer rounded-full border border-amber-500 p-1" onClick={handleLoginWithGoogle}>
                    <img src="/static/media/google-icon.png" className="h-7 w-7" alt="" />
                </li>
            </ul>

            <span className="text-small mx-auto mt-2 mb-4 block w-full text-center text-gray-500 dark:text-gray-400">
                Hoặc đăng nhập bằng email
            </span>
        </>
    )
}

export default LoginWithToken
