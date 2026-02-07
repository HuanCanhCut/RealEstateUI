interface AppEvents {
    // MESSAGE_REPLY: { message: MessageModel }
    SELECT_LOCATION: {
        location: {
            province: string
            district: string
            ward: string
        }
    }
}

export type { AppEvents }
