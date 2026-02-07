import { Navigate, Outlet } from 'react-router'

import { selectCurrentUser } from '~/redux/selector'
import { useAppSelector } from '~/redux/types'

const AuthRoute = () => {
    const currentUser = useAppSelector(selectCurrentUser)

    if (currentUser) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default AuthRoute
