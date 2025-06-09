// 只有消息内容部分
import { AudioPlayerView, Button, cln, Text } from '@x-vision/design'
import { Icon } from '@x-vision/icons'
import MessageContentMedia from './MessageMedia'
import { XImChatMessageData } from '@/npm/x-im'
import ReplyMessage from './ReplyMessage'
import { handleMessagePayEvent, multipleUpdateReplyMessageStatus } from '@/models/message'
import { Preview, useMediaPreview } from '@/npm/x-utils-rc'
import { updateMessageItemMeta } from '@/models/message/cache/meta'
import RetryImg from '@/components/RetryImg'
import { audioManager } from '@/utils/AudioManage'
import { getOrCreateMessageCacheManager } from '@/models/message/cache'

interface IProps {
  id: string
  messageItemInfo: Partial<XImChatMessageData>
  isReplyMessage: boolean
  isMe: boolean
  userId: string
  toUserId: string
  ref: React.RefObject<HTMLDivElement | null>
  listRef?: React.RefObject<HTMLDivElement | null>
}

function MessageContent(props: IProps) {
  const { messageItemInfo, isReplyMessage, isMe, userId, toUserId, id, ref, listRef } = props

  const { open, setOpen, slides, openIdx, openPreviewPop } = useMediaPreview({
    mediaList:
      messageItemInfo?.mediaList
        ?.filter((v) => v.type === 'photo' || v.type === 'video')
        .map((v) => ({
          id: v.id,
          src: v.src,
          type: v.type === 'video' ? 'video' : undefined,
        })) || [],
    toUserId: toUserId,
    messageId: messageItemInfo?.id || '',
  })

  const textClassName = 'rounded-2xl px-3 py-2 break-all whitespace-pre-line'

  if (messageItemInfo?.msgType === 2) {
    // GIF消息
    return (
      <div className="min-h-32 min-w-32" ref={ref}>
        <RetryImg src={messageItemInfo?.gifUrl} className="h-32 rounded-xl overflow-hidden" alt="" />
      </div>
    )
  }

  if (messageItemInfo?.msgType === 3) {
    // tips消息
    return (
      <div
        className="px-3 py-2 bg-(--grayscale-black-00) rounded-full flex items-center gap-2 text-(--grayscale-white-01)"
        ref={ref}
      >
        <Icon icon="x:MoneySendCircleStyleStroke" fontSize={16} />
        <Text size="body1" strong className="text-(--grayscale-white-01)">
          Tip
        </Text>
        <Text size="body1" strong className="text-(--grayscale-white-00)">
          ${messageItemInfo?.price}
        </Text>
      </div>
    )
  }

  const audioData = messageItemInfo?.mediaList?.filter((v) => v.type === 'audio') || []

  const mediaData = messageItemInfo?.mediaList?.filter((v) => v.type === 'photo' || v.type === 'video') || []

  const lockText = () => {
    if (isMe) {
      if (messageItemInfo?.unlock) {
        // 解锁
        return 'Unlocked'
      } else {
        // 没有解锁
        return 'Locked'
      }
    } else {
      if (messageItemInfo?.unlock) {
        // 解锁
        return 'unLocked'
      } else {
        // 没有解锁
        return 'Unlock'
      }
    }
  }

  const payForMessageClick = () => {
    if (isMe || messageItemInfo?.unlock) return
    const event = confirm('Are you sure you want to pay for this message?')
    if (event) {
      const userId = isMe ? messageItemInfo?.fromId : messageItemInfo?.toId
      const toUserId = isMe ? messageItemInfo?.toId : messageItemInfo?.fromId
      if (!userId || !toUserId || !messageItemInfo?.id) return
      handleMessagePayEvent(userId, toUserId, { id }, false)
    } else {
      console.log('cancel')
    }
  }

  // 预览素材
  const openPreview = async (i: number) => {
    if (!messageItemInfo?.unlock && !messageItemInfo?.free && !isMe) return
    const list = await openPreviewPop(i)
    if (list) {
      // 改变数据
      const arr = messageItemInfo?.mediaList?.map((v) => ({
        ...v,
        src: list?.find((item) => item.id === v.id)?.src,
      }))
      // 修改第一层原始消息数据
      const cache = getOrCreateMessageCacheManager(userId, toUserId)
      const key = cache.getShowMessageId(id)
      updateMessageItemMeta(userId, toUserId, key, {
        mediaList: arr,
      })
      // 修改第二层引用消息数据
      multipleUpdateReplyMessageStatus(
        userId,
        toUserId,
        {
          ...messageItemInfo,
          mediaList: arr,
          replyMessage: undefined,
        },
        'vaultChange',
      )
    }
  }

  return (
    <div
      className={cln(
        'flex flex-col gap-1 max-w-[80%]',
        !isMe && 'items-start!',
        audioData.length > 0 && 'w-full items-end min-w-40',
        messageItemInfo.replyMessage && 'items-end',
        // mediaData.length > 0 && 'max-w-[100%]',
        isReplyMessage && 'max-w-[100%]',
      )}
      style={{
        WebkitTouchCallout: 'none' /* iOS Safari */,
        WebkitUserSelect: 'none' /* Safari */,
        userSelect: 'none' /* Standard syntax */,
        msUserSelect: 'none' /* IE 10+ */,
        MozUserSelect: 'none' /* Firefox */,
      }}
      dom-id="message-content"
      ref={ref}
    >
      {/* 引用消息 */}
      {messageItemInfo?.replyMessage && (
        <ReplyMessage messageItemInfo={messageItemInfo?.replyMessage} isMe={isMe} listRef={listRef} />
      )}
      {/* 媒体资源 */}
      {mediaData?.length > 0 && (
        <>
          <MessageContentMedia messageItemInfo={messageItemInfo} openPreview={openPreview} />
          <Preview open={open} onOpenChange={setOpen} slides={slides} initialSlide={openIdx} />
        </>
      )}
      {/* 语音资源 */}
      {audioData.length > 0 && (
        <div className="w-full">
          <AudioPlayerView
            locked={!isMe && !messageItemInfo?.free && !messageItemInfo.unlock}
            src={audioData[0]?.avUrl}
            defaultDuration={audioData[0]?.duration}
            onPlay={(e: any) => {
              audioManager.play(e?.target || e?.audio)
            }}
          />
        </div>
      )}
      {/* 文本消息 */}
      {messageItemInfo?.content && messageItemInfo?.content.trim() && (
        <div className={cln('flex', isMe && 'flex-row-reverse', isReplyMessage && 'max-w-[300px]')}>
          <div
            className={
              isMe
                ? `${textClassName} bg-(--grayscale-black-00) text-(--grayscale-white-00)`
                : `${textClassName} bg-(--grayscale-black-07) text-(--grayscale-black-00)`
            }
          >
            {messageItemInfo?.content}
          </div>
        </div>
      )}
      {/* ppv相关信息 */}
      {!messageItemInfo?.free && (
        <Button
          size="huge"
          color={isMe ? undefined : 'primary'}
          className={isMe ? 'flex gap-3 flex-row-reverse' : ' flex gap-3'}
          disabled={isMe || messageItemInfo?.unlock}
          onClick={payForMessageClick}
        >
          {!messageItemInfo?.unlock && isMe && <Icon icon="x:SquareLock01StyleStroke" fontSize={20} />}
          {messageItemInfo?.unlock && isMe && <Icon icon="x:SquareUnlock01StyleStroke" fontSize={20} />}
          <Text size="body1" emphasis={3} strong style={{ color: 'currentColor' }}>
            {lockText()}
          </Text>
          <Text
            size="body1"
            emphasis={3}
            strong
            style={
              !messageItemInfo?.unlock && !isMe
                ? { color: 'var(--always-white-emphasis-01)' }
                : { color: 'currentColor' }
            }
          >
            ${messageItemInfo?.price}
          </Text>
        </Button>
      )}
    </div>
  )
}

export default MessageContent
