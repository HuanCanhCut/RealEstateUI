import { useEffect, useRef, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Eye, EyeOff } from 'lucide-react'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import Button from '~/components/Button'
import Input from '~/components/Input'
import Spinner from '~/components/Spinner/Spinner'
import config from '~/config'
import * as authServices from '~/services/authService'
import type { UserModel } from '~/types/user'

export interface FieldValue {
    email: string
    password: string
}

interface Response {
    data: UserModel
    meta?: {
        auth_challenge_id: string
    }
}

const loginSchema = z.object({
    email: z.email({ message: 'Email không hợp lệ' }),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 kí tự'),
})

const LoginPage = () => {
    const navigation = useNavigate()

    const [searchParams] = useSearchParams()

    const emailRef = useRef<HTMLInputElement | null>(null)

    const [showPassword, setShowPassword] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        control,
        formState: { isSubmitting, errors },
    } = useForm<FieldValue>({
        resolver: zodResolver(loginSchema),

        defaultValues: {
            email: '',
            password: '',
        },
    })

    const [errorMessage, setErrorMessage] = useState<string>('')

    useEffect(() => {
        if (emailRef.current) {
            emailRef.current.focus()
        }
    }, [])

    const onSubmit: SubmitHandler<FieldValue> = async (data) => {
        try {
            const response: Response = await authServices.login({
                email: data.email,
                password: data.password,
            })

            if (response) {
                if (response.data.is_active) {
                    if (searchParams.get('redirect_to')) {
                        window.location.assign(searchParams.get('redirect_to') || '/')
                        return
                    }

                    window.location.reload()
                } else {
                    navigation(
                        `${config.routes.verify}?auth_challenge_id=${encodeURIComponent(response.meta?.auth_challenge_id || '')}&redirect_to=${window.location.origin}${config.routes.home}&from_email=${encodeURIComponent(data.email)}`,
                    )
                }
                return
            }
        } catch (error: any) {
            if (error?.response?.data?.message) {
                setErrorMessage(error.response.data.message)
            } else {
                setErrorMessage('Email hoặc mật khẩu không đúng')
            }
        }
    }

    return (
        <form className="flex flex-col items-center justify-center gap-3 md:px-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-full flex-col gap-3">
                <div>
                    <Controller
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <Input id="email" autoComplete="off" placeholder="Nhập email" {...field} ref={emailRef} />
                        )}
                        rules={{
                            onChange: () => {
                                setErrorMessage('')
                            },
                        }}
                    />
                    {errors.email && <span className="text-error text-sm">{errors.email.message}</span>}
                </div>
                <div>
                    <div className="relative">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Nhập mật khẩu"
                            {...register('password', {
                                onChange: () => {
                                    setErrorMessage('')
                                },
                            })}
                        />
                        <span
                            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={16} color="#000" /> : <Eye size={16} color="#000" />}
                        </span>
                    </div>
                    {errors.password && <span className="text-error text-sm">{errors.password.message}</span>}
                </div>
                {errorMessage && <span className="text-error text-sm">{errorMessage}</span>}

                <Link
                    to={config.routes.forgotPassword}
                    className="mt-1 cursor-pointer text-sm text-gray-500 dark:text-gray-400"
                    tabIndex={-1}
                >
                    Quên mật khẩu?
                </Link>
            </div>

            <Button type="submit" variant={'default'} className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : 'Đăng nhập'}
            </Button>

            <span className="text-center text-sm text-gray-500 dark:text-gray-400">
                Bạn không có tài khoản?{' '}
                <Link to={config.routes.register} className="text-primary cursor-pointer font-semibold">
                    Đăng kí
                </Link>
            </span>
        </form>
    )
}

export default LoginPage
