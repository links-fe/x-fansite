import { useRouter } from 'next/navigation'
import React from 'react'
import ChatItemLeft from './ChatItemLeft'
import ChatItemRight from './ChatItemRight'
import { chatListHandleMute, clearChatUnreadCount, setChatUnreadCountUnRead } from '@/models/chat'
import { setActiveContactId } from '@/models/message/model'
import { SwipeCell, SwipeCellAction } from '@x-vision/design/index.js'
import { useContactMeta } from '@/models/chat/cache/meta'
import { Icon } from '@x-vision/icons'
import { restoreGlobalChatCache } from '@/common/cmv/cache'
interface Iprops {
  toUserId: string
  userId: string
}
function ChatItem(props: Iprops) {
  const router = useRouter()
  const { toUserId, userId } = props

  const toMessagePage = async () => {
    // 跳转
    router.push(`/chat/${toUserId}`)
    // 设置选中
    setActiveContactId(toUserId)
    // 恢复缓存
    restoreGlobalChatCache(userId, toUserId)
    // 设置为已读
    clearChatUnreadCount(userId, toUserId)
  }

  const contactMeta = useContactMeta(toUserId)

  return (
    <SwipeCell
      rightActions={
        <>
          {/* <SwipeCellAction
            color="primary"
            onClick={() => {
              chatListHandleMute(userId, toUserId, !contactMeta?.mute)
            }}
          >
            {contactMeta?.mute ? (
              <Icon icon="x:Notification01StyleStroke" />
            ) : (
              <Icon icon="x:NotificationOff01StyleStroke" />
            )}
          </SwipeCellAction> */}
          <SwipeCellAction
            disabled={!!(contactMeta?.unreadCount && contactMeta?.unreadCount > 0) || contactMeta?.mute}
            color="primary"
            onClick={() => {
              if (contactMeta?.unreadCount && contactMeta?.unreadCount > 0) return
              if (contactMeta?.mute) return
              setChatUnreadCountUnRead(userId, toUserId)
            }}
          >
            {/* <Icon icon="x:InboxUnreadStyleStroke" /> */}
            {<Icon icon="x:InboxUnreadStyleStroke" />}
          </SwipeCellAction>
        </>
      }
    >
      <div className="flex items-center" onClick={toMessagePage}>
        <ChatItemLeft toUserId={toUserId} />
        <ChatItemRight toUserId={toUserId} />
      </div>
    </SwipeCell>
  )
}

export default ChatItem
