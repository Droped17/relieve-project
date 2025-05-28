import React, { useRef } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

import { useAutoplayProgress } from './EmblaCarouselAutoplayProgress'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButton'
import { useAutoplay } from './EmblaCarouselAutoplay'
import Image from 'next/image'

type PropType = {
  slides: string[]
  options?: EmblaOptionsType
  autoSlide?: boolean
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options, autoSlide = false } = props
  const progressNode = useRef<HTMLDivElement>(null)
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ playOnInit: false, delay: 5000 })
  ])

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const { autoplayIsPlaying, toggleAutoplay, onAutoplayButtonClick } =
    useAutoplay(emblaApi)

  const { showAutoplayProgress } = useAutoplayProgress(emblaApi, progressNode as React.RefObject<HTMLElement>);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((image, index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">
                <Image alt='relieve' className='rounded-xl' src={image} width={1000} height={300} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {autoSlide && <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton
            onClick={() => onAutoplayButtonClick(onPrevButtonClick)}
            disabled={prevBtnDisabled}
          />
          <NextButton
            onClick={() => onAutoplayButtonClick(onNextButtonClick)}
            disabled={nextBtnDisabled}
          />
        </div>
        <div className='pt-8'>
          <div
            className={`embla__progress`.concat(
              showAutoplayProgress ? '' : 'embla__progress--hidden'
            )}
          >
            <div className="embla__progress__bar" ref={progressNode} />
          </div>
        </div>
        <button className="embla__play" onClick={toggleAutoplay} type="button">
          {autoplayIsPlaying ? 'Stop' : 'Start'}
        </button>
      </div>}
    </div>
  )
}

export default EmblaCarousel
