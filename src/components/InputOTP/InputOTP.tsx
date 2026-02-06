import type { SlotProps } from 'input-otp'

import { cn } from '~/utils/cn'

function Slot(props: SlotProps) {
    return (
        <div
            className={cn(
                'relative h-14 w-12 text-[2rem]',
                'flex items-center justify-center',
                'transition-all duration-300',
                'border-y border-r border-zinc-500 first:rounded-l-md first:border-l last:rounded-r-md',
                'outline-accent-foreground/20 outline',
                { 'outline-primary border-primary outline-1': props.isActive },
            )}
        >
            <div className="group-has-[input[data-input-otp-placeholder-shown]]:opacity-20">
                {props.char ?? props.placeholderChar}
            </div>
            {props.hasFakeCaret && <FakeCaret />}
        </div>
    )
}

// You can emulate a fake textbox caret!
function FakeCaret() {
    return (
        <div className="animate-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-px bg-white" />
        </div>
    )
}

// Inspired by Stripe's MFA input.
function FakeDash() {
    return (
        <div className="flex w-10 items-center justify-center">
            <div className="bg-border h-1 w-3 rounded-full" />
        </div>
    )
}

export { FakeCaret, FakeDash, Slot }
