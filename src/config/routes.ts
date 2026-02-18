const ALL_ROUTES = [
    {
        path: '/admin',
        key: 'admin',
    },
    {
        path: '/auth/login',
        key: 'login',
    },
    {
        path: '/auth/register',
        key: 'register',
    },
    {
        path: '/auth/forgot-password',
        key: 'forgotPassword',
    },
    {
        path: '/auth/verify',
        key: 'verify',
    },
    {
        path: '/',
        key: 'home',
    },
    {
        path: '/user/:nickname',
        key: 'userProfile',
    },
    {
        path: '/post/:id',
        key: 'postDetail',
    },
    {
        path: '/post/create',
        key: 'createPost',
    },
    {
        path: '/user/:@nickname',
        key: 'profile',
    },
    {
        path: '/admin/dashboard',
        key: 'dashboard',
    },
    {
        path: '/admin/posts',
        key: 'posts',
    },
    {
        path: '/admin/contracts',
        key: 'contracts',
    },
    {
        path: '/admin/reports',
        key: 'reports',
    },
] as const

type RouteKey = (typeof ALL_ROUTES)[number]['key']

const routes = ALL_ROUTES.reduce(
    (acc, route) => {
        acc[route.key] = route.path
        return acc
    },
    {} as Record<RouteKey, string>,
)

export default routes
