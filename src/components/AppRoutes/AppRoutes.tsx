import { BrowserRouter, Route, Routes } from 'react-router'
import DefaultLayout from '../../layout/DefaultLayout'
import HomePage from '../../pages/Home'
import AuthLayout from '../../layout/AuthLayout'
import LoginPage from '../../pages/Login'

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<DefaultLayout />}>
                    <Route index element={<HomePage />} />
                </Route>
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
