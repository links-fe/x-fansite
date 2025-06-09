import { Preview, SlideType } from '@/npm/x-utils-rc'
import { Button, VideoPlayer } from '@x-vision/design'
import { useEffect, useState } from 'react'

const Slide: SlideType[] = [
  // video
  {
    type: 'video',
    loading: true,
    src: 'https://video.699pic.com/videos/14/93/71/b_YucsQKb8xkrp1562149371_10s.mp4',
  },
  {
    type: 'video',
    render: (
      <VideoPlayer className="" src="https://video.699pic.com/videos/14/93/71/b_YucsQKb8xkrp1562149371_10s.mp4" />
    ),
  },
  // audio
  { type: 'audio', src: 'https://www.joshwcomeau.com/sounds/flap.mp3' },
  // simple image
  { src: 'https://dummyimage.com/1500x1000/555/fff/?text=Image+1', width: 1500, height: 1000 },
  // simple image
  {
    src: 'https://dummyimage.com/1500x1000/555/fff/?text=Image+2',
    width: 1500,
    height: 1000,
  },
]
export default function Page() {
  const [open, setOpen] = useState(true)
  const [slides, setSlides] = useState<SlideType[]>(Slide)
  const [openIdx, setOpenIdx] = useState<number>(0)

  function test() {
    setOpen(true)
    setOpenIdx(1)

    setTimeout(() => {
      slides[0].loading = true
      setSlides([...slides])

      setTimeout(() => {
        slides[0].loading = false
        setSlides([...slides])
      }, 1000)
    }, 1000)
  }
  return (
    <div>
      <Button onClick={() => test()}> {open ? 'Close' : 'Open'} </Button>
      <Preview open={open} onOpenChange={setOpen} slides={slides} initialSlide={openIdx} />
    </div>
  )
}
