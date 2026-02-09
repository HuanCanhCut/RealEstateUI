import { useEffect, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import Button from '~/components/Button'
import { cn } from '~/utils/cn'

interface CarouselProps {
    slider: string[]
}

const Carousel: React.FC<CarouselProps> = ({ slider }) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const autoplay = Autoplay({
        delay: 3000,
        stopOnInteraction: false,
    })

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay])

    // reset autoplay timer when select image, next or prev button click
    useEffect(() => {
        if (!emblaApi) return

        emblaApi.on('select', () => {
            autoplay.reset()
            setSelectedIndex(emblaApi.selectedScrollSnap())
        })
    }, [emblaApi, autoplay])

    const handleClickDot = (index: number) => {
        emblaApi?.scrollTo(index)
    }

    return (
        <>
            <div className="relative max-w-full">
                <div className="w-full overflow-hidden rounded-md" ref={emblaRef}>
                    <div className="flex">
                        {slider.map((img: string) => (
                            <div className="min-w-0 flex-[0_0_100%]" key={img}>
                                <img
                                    src={img}
                                    alt="ảnh"
                                    className="aspect-video w-full rounded-md object-cover select-none"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-slate-50/30 hover:bg-slate-50/50"
                    onClick={() => emblaApi?.scrollPrev()}
                >
                    <ChevronLeftIcon size={24} />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-slate-50/30 hover:bg-slate-50/50"
                    onClick={() => emblaApi?.scrollNext()}
                >
                    <ChevronRightIcon size={24} />
                </Button>
            </div>
            <div className="mt-2 flex justify-end gap-2">
                {slider.map((_: string, index: number) => {
                    return (
                        <button
                            className={cn('size-3 rounded-full border-2', {
                                'bg-red-500': selectedIndex === index,
                            })}
                            key={index}
                            onClick={() => {
                                handleClickDot(index)
                            }}
                        ></button>
                    )
                })}
            </div>
        </>
    )
}

export default Carousel
