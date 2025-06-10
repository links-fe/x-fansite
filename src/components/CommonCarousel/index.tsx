import React, { forwardRef, useImperativeHandle } from 'react'
import { CommonCarouselProps } from './type'
import { Carousel, CarouselContent } from '@x-vision/design/index.js'
import { useCarouselHooks } from './useCarouselHooks'
import CommonCarouselDot from './CommonCarouselDot'
import classNames from 'classnames'

// 定义暴露给外部的方法类型
export interface CommonCarouselRef {
  onPreClick: () => void
  onNextClick: () => void
}

const CommonCarousel = forwardRef<CommonCarouselRef, CommonCarouselProps>((props, ref) => {
  const { current, count, setApi, setCurrent } = useCarouselHooks()
  const { children, showDots = true, showNextPreButton = true, preButton, nextButton } = props

  // 暴露方法给外部
  useImperativeHandle(ref, () => ({
    onPreClick: () => {
      if (current > 1) {
        setCurrent(current - 1)
      }
    },
    onNextClick: () => {
      if (current < count) {
        setCurrent(current + 1)
      }
    },
  }))

  return (
    <div className="flex flex-col">
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent>{children}</CarouselContent>
      </Carousel>
      <div className={classNames('flex items-center justify-between', props.dotBoxClassName)}>
        <div className="flex flex-1 justify-start">{showNextPreButton && current > 1 && preButton}</div>
        <div className="flex flex-1 justify-center">
          {showDots && (
            <div className="flex gap-1">
              {Array.from({ length: count }).map((_, index) => (
                <CommonCarouselDot
                  key={index}
                  isActive={current === index + 1}
                  onClick={() => {
                    setCurrent(index + 1)
                  }}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-1 justify-end">{showNextPreButton && current < count && nextButton}</div>
      </div>
    </div>
  )
})

CommonCarousel.displayName = 'CommonCarousel'

export default CommonCarousel
