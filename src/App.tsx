import { useEffect } from 'react'

import AppRoutes from './components/AppRoutes/AppRoutes'
import EditProfile from './components/EditProfile'
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

    return (
        <>
            <EditProfile />
            <AppRoutes />
        </>
    )
}

export default App
