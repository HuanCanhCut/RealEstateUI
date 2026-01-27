import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './redux/types'
import { setCurrentUser } from './redux/reducers/userReducer'
import { getCurrentUser } from './redux/selector'

function App() {
    const dispatch = useAppDispatch()
    const currentUser = useAppSelector(getCurrentUser)
    useEffect(() => {
        dispatch(
            setCurrentUser({
                id: '1',
                name: 'John Doe',
                email: 'john.doe@example.com',
            }),
        )
    }, [])

    useEffect(() => {
        console.log(currentUser)
    }, [currentUser])

    return <h1 className="text-red-700">Hello World</h1>
}

export default App
