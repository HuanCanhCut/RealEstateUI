import { Send } from 'lucide-react'

import Button from '~/components/Button'
import { Textarea } from '~/components/Textarea/Textarea'

const CommentComposer = () => {
    return (
        <div className="border-primary/20 flex gap-4 border-t p-4">
            <Textarea placeholder="Aa" />

            <Button size={'icon'}>
                <Send />
            </Button>
        </div>
    )
}

export default CommentComposer
