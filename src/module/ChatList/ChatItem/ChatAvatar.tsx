import { useContactMeta } from '@/models/chat/cache/meta'
import { Avatar, cln } from '@x-vision/design/index.js'
import React from 'react'
import OnlineStatus from './components/OnlineStatus'

interface Iprops {
  toUserId: string
  size?:
    | 'massive'
    | 'giant'
    | 'grand'
    | 'jumbo'
    | 'great'
    | 'huge'
    | 'generous'
    | 'large'
    | 'moderate'
    | 'medium'
    | 'intermediate'
  className?: string
  style?: React.CSSProperties
}
function ChatAvatar(props: Iprops) {
  const { toUserId, size = 'huge', className, style } = props
  const contactMeta = useContactMeta(toUserId)

  return (
    <span className={cln('inline-flex relative ml-(--sizing-named-intermediate) h-fit', className)} style={style}>
      <Avatar src={contactMeta?.user?.headImgUrl} className="bg-(--element-emphasis-00)" size={size}>
        <span
          className="text-(--element-reverse-emphasis-00)"
          style={{ font: 'var(--typography-text-heading4-strong)' }}
        >
          {(contactMeta?.user?.remarkName || contactMeta?.user?.nickName || contactMeta?.user?.userName)?.at(0)}
        </span>
      </Avatar>
      <OnlineStatus toUserId={toUserId} />
    </span>
  )
}

export default ChatAvatar
