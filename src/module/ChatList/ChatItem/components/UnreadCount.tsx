import { useContactMeta } from '@/models/chat/cache/meta'
import { Badge } from '@x-vision/design/index.js'
import React from 'react'

interface Iprops {
  toUserId: string
}
function UnreadCount(props: Iprops) {
  const { toUserId } = props
  const { unreadCount } = useContactMeta(toUserId)

  return unreadCount && unreadCount > 0 ? <Badge color="primary" text={unreadCount} className=" absolute z-1" /> : <></>
}

export default UnreadCount
