import { firebaseAuth, googleProvider } from './firebase'
import routes from './routes'

const config = {
    routes,
    firebaseAuth,
    googleProvider,
}

export default config
