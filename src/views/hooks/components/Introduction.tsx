import CommonCarousel, { CommonCarouselRef } from '@/components/CommonCarousel'
import { Button, CarouselItem, Text } from '@x-vision/design/index.js'
import React, { useRef } from 'react'

function Introduction() {
  const carouselRef = useRef<CommonCarouselRef>(null)
  const IntroductionList = [
    {
      title: 'Engage fans who discover you through social media with chat hooks',
    },
    {
      title: `Once the chat gets going, AI takes over the conversation and continues engaging your fans intimately`,
    },
    {
      title: 'Step 1',
      content: 'Craft the message that fans see once they enter the chat',
    },
    {
      title: 'Step 2',
      content: 'Generate a link to share on social media with your fans',
    },
    {
      title: 'Ready to try using chat hooks?',
    },
  ]

  return (
    <CommonCarousel
      ref={carouselRef}
      preButton={<Button onClick={() => carouselRef.current?.onPreClick()}>Previous</Button>}
      nextButton={<Button onClick={() => carouselRef.current?.onNextClick()}>Next</Button>}
    >
      {IntroductionList.map((item, index) => (
        <CarouselItem key={index}>
          <div className="flex flex-col">
            {item.title && (
              <Text size="heading3" className="py-(--sizing-named-small) text-(--element-emphasis-00)">
                {item.title}
              </Text>
            )}
            {item.content && (
              <Text size="body1" className="text-(--element-emphasis-00)">
                {item.content}
              </Text>
            )}
            <div className="my-(--sizing-named-huge) h-[361px] w-full rounded-(--sizing-named-micro) bg-(--surface-level-02-emphasis-00)">
              Placeholder
            </div>
          </div>
        </CarouselItem>
      ))}
    </CommonCarousel>
  )
}

export default Introduction
