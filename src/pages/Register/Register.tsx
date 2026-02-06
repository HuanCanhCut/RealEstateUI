'use client'
import { useEffect, useRef, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import Button from '~/components/Button'
import Input from '~/components/Input'
import Spinner from '~/components/Spinner/Spinner'
import config from '~/config'
import * as authServices from '~/services/authService'

export interface FieldValue {
    fullname: string
    email: string
    password: string
}

const registerSchema = z.object({
    fullname: z
        .string()
        .min(1, 'Tên không được bỏ trống')
        .refine((value) => value.split(' ').length >= 2, 'Tên phải có ít nhất 2 từ'),
    email: z.email({ message: 'Email không hợp lệ' }),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 kí tự'),
})

const RegisterPage = () => {
    const navigate = useNavigate()
    const fullnameRef = useRef<HTMLInputElement | null>(null)
    const { search } = useLocation()
    const [searchParams] = useSearchParams()

    const [showPassword, setShowPassword] = useState<boolean>(false)

    const {
        handleSubmit,
        register,
        control,
        formState: { isSubmitting, errors },
    } = useForm<FieldValue>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullname: '',
            email: '',
            password: '',
        },
    })

    const [errorMessage, setErrorMessage] = useState<string>('')

    useEffect(() => {
        if (fullnameRef.current) {
            fullnameRef.current.focus()
        }
    }, [])

    const onSubmit: SubmitHandler<FieldValue> = async (data) => {
        try {
            const res = await authServices.register({
                fullname: data.fullname,
                email: data.email,
                password: data.password,
            })

            navigate(
                `${config.routes.verify}?auth_challenge_id=${encodeURIComponent(res.meta.auth_challenge_id)}&redirect_to=${searchParams.get('redirect_to') || config.routes.home}&from_email=${encodeURIComponent(data.email)}`,
            )
        } catch (error: any) {
            if (error?.response?.data?.message) {
                if (error.response.status === 409) {
                    setErrorMessage('Tài khoản đã tồn tại, vui lòng thử lại.')
                    return
                }

                setErrorMessage(error.response.data.message)
            } else {
                toast.error('Đăng kí thất bại, vui lòng thử lại hoặc liên hệ admin để xử lí.')
            }
        }
    }

    return (
        <form className="flex flex-col items-center justify-center gap-3 md:px-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-full flex-col gap-3">
                <div>
                    <Controller
                        control={control}
                        name="fullname"
                        render={({ field }) => (
                            <Input
                                id="fullname"
                                autoComplete="off"
                                placeholder="Nhập tên của bạn"
                                {...field}
                                ref={fullnameRef}
                            />
                        )}
                        rules={{
                            onChange: () => {
                                setErrorMessage('')
                            },
                        }}
                    />
                    {errors.fullname && <span className="text-error text-sm">{errors.fullname.message}</span>}
                </div>
                <div>
                    <Input
                        type="text"
                        placeholder="Nhập email"
                        {...register('email', {
                            onChange: () => {
                                setErrorMessage('')
                            },
                        })}
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
                {isSubmitting ? <Spinner /> : 'Đăng kí'}
            </Button>

            <span className="text-center text-sm text-gray-500 dark:text-gray-400">
                Bạn đã có tài khoản?{' '}
                <Link to={`${config.routes.login}${search}`} className="text-primary cursor-pointer font-semibold">
                    Đăng nhập
                </Link>
            </span>
        </form>
    )
}

export default RegisterPage
