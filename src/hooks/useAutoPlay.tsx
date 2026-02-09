import { useCallback, useEffect, useState } from 'react'
import type { EmblaCarouselType } from 'embla-carousel'

type UseAutoplayType = {
    autoplayIsPlaying: boolean
    toggleAutoplay: () => void
    onAutoplayButtonClick: (callback: () => void) => void
}

export const useAutoplay = (emblaApi: EmblaCarouselType | undefined): UseAutoplayType => {
    const [autoplayIsPlaying, setAutoplayIsPlaying] = useState(false)

    const onAutoplayButtonClick = useCallback(
        (callback: () => void) => {
            const autoplay = emblaApi?.plugins()?.autoplay
            if (!autoplay) return

            autoplay.stop()
            callback()
        },
        [emblaApi],
    )

    const toggleAutoplay = useCallback(() => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay) return

        const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play
        playOrStop()
    }, [emblaApi])

    useEffect(() => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay) return

        const updateAutoplayIsPlaying = () => setAutoplayIsPlaying(autoplay.isPlaying())

        updateAutoplayIsPlaying()
        emblaApi
            .on('autoplay:play', () => setAutoplayIsPlaying(true))
            .on('autoplay:stop', () => setAutoplayIsPlaying(false))
            .on('reInit', () => updateAutoplayIsPlaying())
    }, [emblaApi])

    return {
        autoplayIsPlaying,
        toggleAutoplay,
        onAutoplayButtonClick,
    }
}
