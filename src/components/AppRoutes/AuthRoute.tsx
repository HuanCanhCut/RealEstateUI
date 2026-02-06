import { Navigate, type RouteProps } from 'react-router'

import { selectCurrentUser } from '~/redux/selector'
import { useAppSelector } from '~/redux/types'

const AuthRoute = ({ children }: RouteProps) => {
    const currentUser = useAppSelector(selectCurrentUser)

    if (currentUser) {
        return <Navigate to="/" replace />
    }

    return children
}

export default AuthRoute
