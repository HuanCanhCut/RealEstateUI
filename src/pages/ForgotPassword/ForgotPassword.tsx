'use client'
import { useEffect, useRef, useState } from 'react'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import SendVerifyCode from './components/SendVerifyCode'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '~/components/Button'
import Input from '~/components/Input'
import Spinner from '~/components/Spinner'
import config from '~/config'
import * as authServices from '~/services/authService'

export interface FieldValue {
    email: string
    password: string
    code: string
}

const forgotPasswordSchema = z.object({
    email: z.email('Email không hợp lệ'),
    code: z.string().length(6, 'Mã xác minh phải có 6 kí tự'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 kí tự'),
})

const ForgotPasswordForm = () => {
    const navigate = useNavigate()

    const emailRef = useRef<HTMLInputElement | null>(null)

    const [showPassword, setShowPassword] = useState<boolean>(false)

    const { search } = useLocation()

    const {
        handleSubmit,
        control,
        register,
        formState: { isSubmitting, errors },
    } = useForm<FieldValue>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
            password: '',
            code: '',
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
            await authServices.resetPassword({
                email: data.email,
                password: data.password,
                code: data.code,
            })

            toast.success('Đổi mật khẩu thành công')

            navigate(`${config.routes.login}${search}`)
        } catch (error: any) {
            if (error?.response?.data?.message) {
                setErrorMessage(error.response.data.message)
            } else {
                setErrorMessage('Có lỗi xảy ra, vui lòng thử lại sau hoặc liên hệ admin để xử lí.')
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

                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Nhập mã xác minh"
                        {...register('code', {
                            onChange: () => {
                                setErrorMessage('')
                            },
                        })}
                    />
                    <SendVerifyCode emailRef={emailRef} />
                </div>

                <div>
                    <div className="relative">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Nhập mật khẩu mới"
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
            </div>

            <Button type="submit" variant={'default'} className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : 'Cập nhật'}
            </Button>

            <span className="text-center text-sm text-gray-500 dark:text-gray-400">
                Quay lại trang đăng nhập?{' '}
                <Link to={`${config.routes.login}${search}`} className="text-primary cursor-pointer font-semibold">
                    Đăng nhập
                </Link>
            </span>
        </form>
    )
}

export default ForgotPasswordForm
