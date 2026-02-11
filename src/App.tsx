import { useEffect } from 'react'

import AppRoutes from './components/AppRoutes/AppRoutes'
import socket from './helpers/socket'
import { getCurrentUser } from './redux/reducers/authSlice'
import { useAppDispatch } from './redux/types'

function App() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getCurrentUser())
    }, [dispatch])

    useEffect(() => {
        socket.connect()

        return () => {
            socket.disconnect()
        }
    }, [])

    return <AppRoutes />
}

export default App
