export interface SocketMeta {
    success: boolean
    error: string | null
}

interface ServerToClientEvents {
    // NEW_MESSAGE: ({ data, meta }: { data: MessageModel; meta: SocketMeta }) => void
}

interface ClientToServerEvents {
    // NEW_MESSAGE: ({
    //     content,
    //     parent_id,
    //     type,
    //     topic_uuid,
    // }: {
    //     content: string
    //     parent_id?: number | null
    //     type: 'text' | 'image'
    //     topic_uuid: string
    // }) => void
}

interface InterServerEvents {
    ping: () => void
}

export type { ClientToServerEvents, InterServerEvents, ServerToClientEvents }
