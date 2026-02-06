import { BrowserRouter, Route, Routes } from 'react-router'

import AuthLayout from '../../layout/AuthLayout'
import DefaultLayout from '../../layout/DefaultLayout'
import HomePage from '../../pages/Home'
import LoginPage from '../../pages/Login'

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<DefaultLayout />}>
                    <Route index element={<HomePage />} />
                </Route>
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<LoginPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
