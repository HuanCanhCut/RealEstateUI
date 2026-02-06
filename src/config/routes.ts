export const AUTH_ROUTES = [
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
] as const

export const PRIVATE_ROUTES = [] as const

export const PUBLIC_ROUTES = [
    {
        path: '/',
        key: 'home',
    },
] as const

const ALL_ROUTES = [...AUTH_ROUTES, ...PRIVATE_ROUTES, ...PUBLIC_ROUTES] as const

type RouteKey = (typeof ALL_ROUTES)[number]['key']

const routes = ALL_ROUTES.reduce(
    (acc, route) => {
        acc[route.key] = route.path
        return acc
    },
    {} as Record<RouteKey, string>,
)

export default routes
