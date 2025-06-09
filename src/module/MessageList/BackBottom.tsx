import { useMessageListModel } from '@/models/message/model'
import { Button } from '@x-vision/design/index.js'
import { Icon } from '@x-vision/icons/index.js'

interface IProps {
  chatListRef: HTMLDivElement | null
}

export default function BackBottom(props: IProps) {
  const { chatListRef } = props
  const { messageListBackBottomVisible } = useMessageListModel()
  if (!chatListRef || !messageListBackBottomVisible) {
    return null
  }

  const gotoMessageBottom = () => {
    // 平滑滚动到最底部
    if (chatListRef) {
      chatListRef.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  return (
    <Button className="absolute bottom-2 right-3 z-10" color="default" shape="circle" onClick={gotoMessageBottom}>
      <Icon icon="x:ArrowDown02StyleSolid" />
    </Button>
  )
}
