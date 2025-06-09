import { MediaType, SendTypeEnum } from './type'
import Image from 'next/image'
import { Text } from '@x-vision/design/index.js'
import { STATIC_SOURCE_URL } from '@/constants'

interface IProps {
  sendType: SendTypeEnum
  mediaType: MediaType
}

export default function empty(props: IProps) {
  const { sendType, mediaType } = props

  const emptyText = () => {
    if (sendType === SendTypeEnum.Sent) {
      // Send页面
      switch (mediaType) {
        case 'photo':
          return `You haven't sent any images to this user`
        case 'video':
          return `You haven't sent any videos to this user`
        case 'audio':
          return `You haven't sent any audio file to this user`
        default:
          return `You haven't sent any content to this user`
      }
    } else {
      // Receive页面
      switch (mediaType) {
        case 'photo':
          return `You haven't received any images from this user`
        case 'video':
          return `You haven't received any videos from this user`
        case 'audio':
          return `You haven't received any audio files from this user`
        default:
          return `You haven't received any content from this user`
      }
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-full gap-4">
      <Image src={`${STATIC_SOURCE_URL}/images/empty.svg`} width={80} height={80} alt="empty" />
      <Text size="body1" emphasis={1}>
        {emptyText()}
      </Text>
    </div>
  )
}
