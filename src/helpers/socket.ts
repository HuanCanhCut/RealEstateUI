import { io, Socket } from 'socket.io-client'

import type { ClientToServerEvents, ServerToClientEvents } from '~/types/socket'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(import.meta.env.VITE_SOCKET_ORIGIN_URL, {
    withCredentials: true,
    autoConnect: false,
})

export default socket
