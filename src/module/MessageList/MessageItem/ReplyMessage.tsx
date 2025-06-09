import { isSelfSendMessage } from '@/utils/chat'
import MessageItem from '.'
import { XImChatMessageData } from '@/npm/x-im'
import { cln, Popover, Text } from '@x-vision/design/index.js'
import { Icon } from '@x-vision/icons/index.js'
import { MessageStatus } from '@/types/tables/message'

interface IProps {
  messageItemInfo: Partial<XImChatMessageData>
  isMe: boolean
  listRef?: React.RefObject<HTMLDivElement | null>
}
function ReplyMessage(props: IProps) {
  const { messageItemInfo, isMe, listRef } = props
  const replyIsMe = isSelfSendMessage(messageItemInfo?.fromId)

  // const replyClass = cln('px-2 py-1.5 rounded-2xl flex-col flex-1 overflow-hidden',replyIsMe ? 'bg-(--always-black-emphasis-01)' : 'bg-(--surface-level-02-emphasis-02)')

  const hasPhoto = messageItemInfo?.mediaList?.some((v) => v.type === 'photo')
  const hasVideo = messageItemInfo?.mediaList?.some((v) => v.type === 'video')
  const hasAudio = messageItemInfo?.mediaList?.some((v) => v.type === 'audio')

  if (!messageItemInfo || messageItemInfo?.sendStatus === MessageStatus.WITHDRAW) {
    // 删除的引用消息    和  撤回的引用消息
    return (
      <div
        className={cln(
          'flex items-end mb-1 max-w-[100%] px-2 py-1.5 gap-1 [&>button]:overflow-hidden bg-(--surface-level-02-emphasis-02) rounded-full text-(--grayscale-black-03)',
          !isMe && 'flex-row-reverse',
        )}
      >
        <Icon icon="x:ArrowTurnDownStyleStroke" fontSize={12} color="currentColor" />
        <Text size="caption2" emphasis={2}>
          Message deleted
        </Text>
      </div>
    )
  }

  return (
    <div className={cln('flex items-end mb-1 max-w-[100%] [&>button]:overflow-hidden', !isMe && 'flex-row-reverse')}>
      <span>
        {isMe ? (
          <Icon icon="x:ArrowMoveLeftDownStyleStroke" fontSize={12} />
        ) : (
          <Icon icon="x:ArrowMoveRightDownStyleStroke" fontSize={12} />
        )}
      </span>
      <Popover
        content={
          <div className={replyIsMe ? 'max-w-[90vw] flex p-2 items-end flex-row-reverse' : 'flex max-w-[90vw] p-2'}>
            <MessageItem
              messageItem={messageItemInfo}
              id={messageItemInfo?.id || ''}
              toUserId={(replyIsMe ? messageItemInfo?.toId : messageItemInfo?.fromId) || ''}
              userId={(replyIsMe ? messageItemInfo?.fromId : messageItemInfo?.toId) || ''}
            />
          </div>
        }
        container={listRef?.current}
        side="top"
      >
        <div className="bg-(--surface-level-02-emphasis-02) px-2 py-1.5 rounded-2xl flex-col flex-1 overflow-hidden">
          <div className="truncate overflow-hidden max-w-[100vw]">
            <Text size="caption2" emphasis={1} className="flex items-center gap-1">
              {hasPhoto && <Icon icon="x:Image01StyleStroke" fontSize={16} />}
              {hasVideo && <Icon icon="x:PlayCircleStyleStroke" fontSize={16} />}
              {hasAudio && <Icon icon="x:AudioWaveStyleSolid" fontSize={16} />}
              {messageItemInfo?.msgType === 2 && <Icon icon="x:GifCustomStyleStroke" fontSize={16} />}
              {messageItemInfo?.msgType === 3 && <Icon icon="x:MoneySendCircleStyleSolid" fontSize={16} />}
              {!messageItemInfo?.free && <Icon icon="x:SaleTag02StyleStroke" fontSize={16} />}
              <div className="truncate flex-1">{messageItemInfo?.content}</div>
            </Text>
          </div>
          <div>{/* TODO 判断图片、视频、语音 */}</div>
        </div>
      </Popover>
    </div>
  )
}

export default ReplyMessage
