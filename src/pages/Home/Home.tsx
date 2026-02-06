import { Link } from 'react-router'

import config from '~/config'

const HomePage = () => {
    return <Link to={config.routes.login}>navigate to login page</Link>
}

export default HomePage
