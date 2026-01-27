import { Outlet } from 'react-router'

const AuthLayout = () => {
    return (
        <>
            <h1>Auth layout</h1>
            <Outlet />
        </>
    )
}

export default AuthLayout
