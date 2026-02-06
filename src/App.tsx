import { useEffect } from 'react'

import AppRoutes from './components/AppRoutes/AppRoutes'
import { getCurrentUser } from './redux/reducers/authSlice'
import { useAppDispatch } from './redux/types'

function App() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getCurrentUser())
    }, [dispatch])

    return <AppRoutes />
}

export default App
