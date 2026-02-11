import ReactModal, { type Props } from 'react-modal'

import Button from '../Button'
import PopperWrapper from '../PopperWrapper'
import { cn } from '~/utils/cn'

interface ConfirmModalProps extends Omit<Props, 'className'> {
    className?: string
    title?: string
    content?: string
    cancelFn?: () => void
    confirmFn?: () => void
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ className, title, content, cancelFn, confirmFn, ...props }) => {
    return (
        <ReactModal
            ariaHideApp={false}
            overlayClassName="overlay"
            closeTimeoutMS={200}
            className={cn('modal', className)}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            {...props}
        >
            <PopperWrapper className="max-w-[320px] p-0 text-center">
                <div className="p-4">
                    <p className="text-base font-medium">{title}</p>
                    <p className="text-muted-foreground mt-2 text-sm font-medium">{content}</p>
                </div>
                <div className="bg-muted flex items-center justify-end gap-2 p-4">
                    <Button
                        variant="secondary"
                        className="bg-background border-border hover:bg-background flex-1 border"
                        onClick={cancelFn}
                        size="icon-sm"
                    >
                        Hủy
                    </Button>
                    <Button variant="default" className="flex-1" onClick={confirmFn} size="icon-sm">
                        Xóa
                    </Button>
                </div>
            </PopperWrapper>
        </ReactModal>
    )
}

export default ConfirmModal
