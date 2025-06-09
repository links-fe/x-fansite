'use client'

import Image from 'next/image'
import { AudioPlayerView, Dialog, Loading, VideoPlayer } from '@x-vision/design'
import React, { CSSProperties, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
// import required modules
import { Zoom, Navigation, Pagination } from 'swiper/modules'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/zoom'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Icon } from '@x-vision/icons'
import RetryImg from '@/components/RetryImg'

export type SlideType = {
  src?: string
  width?: number
  height?: number
  type?: 'video' | 'image' | 'audio' | 'pdf' | 'html'
  loading?: boolean
  render?: React.ReactNode
}

export function formatName(name: string) {
  return `${name}`
    .replace(/[^a-z0-9]/gi, '_')
    .split('_')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
}

export function Preview({
  defaultOpen,
  open,
  onOpenChange,
  onSwiper,
  onSlideChange,
  slides,
  ...props
}: React.ComponentProps<typeof Dialog> & React.ComponentProps<typeof Swiper> & { slides: SlideType[] }) {
  const swiperRef = useRef<any>(null)

  const [innerOpen, setInnerOpen] = useState(defaultOpen ?? open)
  const [activeIndex, setActiveIndex] = useState(0)
  const [totalSlides, setTotalSlides] = useState(0)
  const [slideType, setSlideType] = useState('')

  function findAllVideoAndStop() {
    const swiper = swiperRef.current?.el as HTMLElement
    if (!swiper) return

    const videos = swiper.querySelectorAll('video')
    videos.forEach((video) => video?.pause())
  }

  function getCurrentSlideType(swiper: SwiperClass) {
    if (!swiper?.slides) return

    const currentSlide = swiper?.slides[swiper?.activeIndex]
    const currentSlideType = currentSlide?.getAttribute('data-type') || 'image'

    setSlideType(formatName(currentSlideType))
  }

  useEffect(() => {
    if (open !== undefined) {
      setInnerOpen(open)
    }
  }, [open])

  function handleOpenChange(v: boolean) {
    setInnerOpen(v)
    onOpenChange?.(v)
  }

  return (
    <Dialog
      className="rounded-none size-full border-none outline-none p-0 bg-black z-999 top-0 left-0 translate-0"
      open={open ?? innerOpen}
      onOpenChange={handleOpenChange}
    >
      <div className="size-full flex items-center justify-center relative">
        <div className="z-10 typography-text-body1-strong text-white my-(--named-micro) mx-(--named-mini) absolute inset-x-0 top-0 pointer-events-none flex items-center justify-center">
          <span className="flex-1 text-center p-(--sizing-unit)">
            {slideType && `${slideType} `}({activeIndex + 1}/{totalSlides})
          </span>
          <span className="pointer-events-auto p-(--sizing-unit) box-content absolute right-0 top-1/2 -translate-y-1/2  cursor-pointer">
            <Icon icon="x:Cancel01StyleSolid" onClick={() => handleOpenChange(false)} fontSize={20} />
          </span>
        </div>
        {/* <div className="z-10 absolute inset-x-0 bottom-0 pointer-events-none my-(--sizing-unit) mx-(--named-mini)">
          footer
        </div> */}
        <Swiper
          ref={swiperRef}
          className="z-9 size-full"
          style={
            {
              '--swiper-navigation-color': '#fff',
            } as CSSProperties
          }
          zoom={true}
          navigation={true}
          modules={[Zoom, Navigation]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
            setTotalSlides(swiper.slides.length)
            onSwiper?.(swiper)
            getCurrentSlideType(swiper)
            setActiveIndex(swiper.activeIndex)
          }}
          onSlideChange={(swiper) => {
            findAllVideoAndStop()
            setActiveIndex(swiper.activeIndex)
            onSlideChange?.(swiper)
            getCurrentSlideType(swiper)
          }}
          {...props}
        >
          {slides?.map((slide, index) => (
            <SwiperSlide key={index} data-type={slide.type}>
              <SlideContent {...slide} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Dialog>
  )
}

function SlideContent({ ...props }) {
  if (props.loading) return <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
  if (props.render) return props.render

  if (props.type === 'video') {
    return <VideoPlayer className="" src={props.src} {...props} />
  }

  if (props.type === 'audio') {
    return (
      <div className="flex size-full items-center justify-center px-(--sizing-named-great)">
        <AudioPlayerView src={props.src} {...props} className="w-full bg-white" />
      </div>
    )
  }

  return (
    <div className="swiper-zoom-container select-none">
      <RetryImg src={props.src} loading="lazy" {...props} />
      {/* <Image src={props?.src} alt="" {...props} /> */}
      <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
    </div>
  )
}
