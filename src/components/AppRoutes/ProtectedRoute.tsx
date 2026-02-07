import { Navigate, type RouteProps } from 'react-router'

import config from '~/config'
import { selectCurrentUser } from '~/redux/selector'
import { useAppSelector } from '~/redux/types'

const AuthRoute = ({ children }: RouteProps) => {
    const currentUser = useAppSelector(selectCurrentUser)

    if (!currentUser) {
        return <Navigate to={config.routes.login} replace />
    }

    return children
}

export default AuthRoute
