import { BrowserRouter, Route, Routes } from 'react-router'

import AuthLayout from '~/layout/AuthLayout'
import DefaultLayout from '~/layout/DefaultLayout'
import HomePage from '~/pages/Home/Home'
import LoginPage from '~/pages/Login'
import RegisterPage from '~/pages/Register'
import VerifyPage from '~/pages/VerifyAccount'

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<DefaultLayout />}>
                    <Route index element={<HomePage />} />
                </Route>
                <Route path="/auth">
                    <Route element={<AuthLayout />}>
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                    </Route>

                    <Route path="verify" element={<VerifyPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
