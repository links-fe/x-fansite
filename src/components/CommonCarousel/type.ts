import { Carousel } from '@x-vision/design/index.js'
type CarouselType = React.ComponentProps<typeof Carousel>

export interface CommonCarouselProps extends CarouselType {
  classname?: string
  showNextPreButton?: boolean
  preButton?: React.ReactNode
  nextButton?: React.ReactNode
  showDots?: boolean
  dotBoxClassName?: string
}
