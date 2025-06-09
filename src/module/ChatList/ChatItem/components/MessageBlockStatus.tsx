import { useContactMeta } from '@/models/chat/cache/meta'
import { Icon } from '@x-vision/icons/index.js'
import React from 'react'

interface Iprops {
  toUserId: string
}
function MessageBlockStatus(props: Iprops) {
  const { toUserId } = props
  const contactMeta = useContactMeta(toUserId)
  if (contactMeta?.mute) return <Icon icon="x:NotificationOff01StyleStroke" className="absolute" />
  if (contactMeta?.reject) return <Icon icon="x:UnavailableStyleStroke" className="absolute" />
  return <></>
}

export default MessageBlockStatus
