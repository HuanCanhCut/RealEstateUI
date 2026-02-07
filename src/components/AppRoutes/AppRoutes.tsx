import { BrowserRouter, Route, Routes } from 'react-router'

import AuthRoute from './AuthRoute'
import AuthLayout from '~/layout/AuthLayout'
import DefaultLayout from '~/layout/DefaultLayout'
import ForgotPasswordPage from '~/pages/ForgotPassword'
import HomePage from '~/pages/Home/Home'
import LoginPage from '~/pages/Login'
import NotFoundPage from '~/pages/NotFound'
import RegisterPage from '~/pages/Register'
import VerifyPage from '~/pages/VerifyAccount'

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<DefaultLayout />}>
                    <Route index element={<HomePage />} />
                </Route>
                <Route path="/auth" element={<AuthRoute />}>
                    <Route element={<AuthLayout />}>
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="forgot-password" element={<ForgotPasswordPage />} />
                    </Route>

                    <Route path="verify" element={<VerifyPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
