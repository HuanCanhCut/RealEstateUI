import { Outlet } from 'react-router'

import LoginWithToken from './components/LoginWithToken'

const AuthLayout = () => {
    return (
        <main className="dark:bg-dark dark:text-dark grid min-h-dvh w-full grid-cols-12">
            <div className="col-span-12 p-8 sm:col-span-6">
                <img
                    src="/static/media/logo.png"
                    alt="logo"
                    className="h-auto w-8.75 min-w-8.75 shrink-0 cursor-pointer object-cover sm:w-10"
                />
                <h1 className="mt-3 flex flex-col text-center font-bold">
                    Đăng nhập vào <span className="mt-2 text-3xl text-cyan-800 dark:text-cyan-500">RealEstate</span>
                </h1>

                <LoginWithToken />

                <Outlet />
                <footer className="mt-4 text-center text-[13px] text-gray-500 dark:text-gray-400">
                    Việc bạn tiếp tục sử dụng trang web này có nghĩa bạn đồng ý với{' '}
                    <span className="text-(--primary)">điều khoản</span> sử dụng của chúng tôi
                </footer>
            </div>
            <div className="relative col-span-6 hidden h-dvh sm:block">
                <img
                    className="h-dvh w-full rounded-tl-3xl rounded-bl-3xl object-cover"
                    src="/static/media/login-form.jpg"
                    alt="login"
                />
            </div>
        </main>
    )
}

export default AuthLayout
