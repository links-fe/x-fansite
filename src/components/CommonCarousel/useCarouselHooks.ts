import { CarouselApi } from '@x-vision/design/index.js'
import React from 'react'

export const useCarouselHooks = () => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const setCurrentApi = (index: number) => {
    setCurrent(index)
    if (api) {
      api.scrollTo(index - 1)
    }
  }

  return {
    api,
    current,
    setCurrent: setCurrentApi,
    count,
    setApi,
    setCount,
  }
}
