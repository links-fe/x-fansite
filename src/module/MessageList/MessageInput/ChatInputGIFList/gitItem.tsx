import { updateChatInputSendData } from '@/models/chat-input-send'
import { useContactMeta } from '@/models/chat/cache/meta'
import { sendMessage } from '@/models/message'
import { MessageType } from '@/types/tables/message'

interface IProps {
  item: any
  index: number
  toUserId: string
}

function GifItem(props: IProps) {
  const { item, index, toUserId } = props
  const contactMeta = useContactMeta(toUserId)

  const onClickGIFItem = () => {
    if (contactMeta.reject) return
    // 直接发送消息
    sendMessage({
      msgType: MessageType.GIF,
      gifId: item?.id,
      gifUrl: item?.images?.fixedHeight?.url,
    })
    updateChatInputSendData(toUserId, {
      showGIF: false,
    })
  }

  return (
    <div
      className="flex-shrink-0 rounded-lg overflow-hidden h-30 bg-(--surface-level-02-emphasis-03)"
      key={index}
      onClick={onClickGIFItem}
    >
      <img
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        className="min-w-30"
        src={item?.images?.fixedHeight?.url}
        alt=""
      />
    </div>
  )
}

export default GifItem
