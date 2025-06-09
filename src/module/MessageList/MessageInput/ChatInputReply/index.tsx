import { updateChatInputSendData, useChatInputSendDataStore } from '@/models/chat-input-send'
import { getOrCreateChatItemCacheManager } from '@/models/chat/cache'
import { useUserInfo } from '@/models/user'
import { Button, Text } from '@x-vision/design'
import { Icon } from '@x-vision/icons'

interface IProps {
  toUserId: string
  userId: string
}
function ChatInputReply(props: IProps) {
  const { toUserId, userId } = props
  const replyMsgData = useChatInputSendDataStore((state) => state.replyMsgData)
  const chatContactCache = getOrCreateChatItemCacheManager(userId, toUserId)
  const contactInfo = chatContactCache?.getChatItemDetails()
  const userInfo = useUserInfo()

  const onCloseReply = () => {
    updateChatInputSendData(toUserId, {
      replyMsgData: undefined,
    })
  }

  if (!replyMsgData) return null

  const hasPhoto = replyMsgData?.mediaList?.some((v) => v.type === 'photo')
  const hasVideo = replyMsgData?.mediaList?.some((v) => v.type === 'video')
  const hasAudio = replyMsgData?.mediaList?.some((v) => v.type === 'audio')

  return (
    <div
      className="flex bg-(--surface-level-02-emphasis-02) rounded-xl p-2 ml-3 mr-12 mb-2 items-center"
      dom-id="chat-input-reply"
    >
      <div className="flex flex-col flex-1 gap-1 overflow-hidden truncate">
        <Text size="caption3" emphasis={1} strong className="truncate">
          Replying to{' '}
          {replyMsgData.toId === userId
            ? contactInfo?.user?.remarkName || contactInfo?.user?.nickName || contactInfo?.user?.userName
            : userInfo?.nickName || userInfo?.userName}
        </Text>
        <Text size="body2" className="flex items-center gap-1">
          {hasPhoto && <Icon icon="x:Image01StyleStroke" fontSize={16} />}
          {hasVideo && <Icon icon="x:PlayCircleStyleStroke" fontSize={16} />}
          {hasAudio && <Icon icon="x:AudioWaveStyleSolid" fontSize={16} />}
          {!replyMsgData?.free && <Icon icon="x:SaleTag02StyleStroke" fontSize={16} />}
          <div className="truncate flex-1">{replyMsgData?.content}</div>
        </Text>
      </div>
      <Button shape="circle" size="medium" onClick={onCloseReply}>
        <Icon icon="x:Cancel01StyleSolid" />
      </Button>
    </div>
  )
}

export default ChatInputReply
