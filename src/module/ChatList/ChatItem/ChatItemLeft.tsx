import React, { useMemo } from 'react'
import UnreadCount from './components/UnreadCount'
import MessageBlockStatus from './components/MessageBlockStatus'
import { useContactMeta } from '@/models/chat/cache/meta'
import ChatAvatar from './ChatAvatar'

interface Iprops {
  toUserId: string
}
function ChatItemLeft(props: Iprops) {
  const { toUserId } = props
  const contactMeta = useContactMeta(toUserId)

  const iconRenderMemo = useMemo(() => {
    if (contactMeta?.mute || contactMeta?.reject) return <MessageBlockStatus toUserId={toUserId} />
    return <UnreadCount toUserId={toUserId} />
  }, [toUserId, contactMeta?.mute, contactMeta?.reject, contactMeta?.unreadCount])

  return (
    <div className="flex items-center mx-(--sizing-named-micro) h-(--sizing-named-huge) relative">
      {iconRenderMemo}
      <ChatAvatar toUserId={toUserId} />
    </div>
  )
}

export default ChatItemLeft
