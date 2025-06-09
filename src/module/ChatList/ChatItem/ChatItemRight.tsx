import React from 'react'
import { formatChatTime } from '../utils'
import { useContactMeta } from '@/models/chat/cache/meta'
import { Icon } from '@x-vision/icons'
import { getActiveAccountId } from '@/models/user'
import { MessageStatus, MessageType } from '@/types/tables/message'
import { isSelfSendMessage } from '@/utils/chat'
import { getChatInputSendCacheData } from '@/models/chat-input-send'
import { Text } from '@x-vision/design/index.js'
interface Iprops {
  toUserId: string
}
function ChatItemRight(props: Iprops) {
  const { toUserId } = props
  const contactMeta = useContactMeta(toUserId)

  const renderContent = () => {
    const draftInfo = getChatInputSendCacheData(toUserId)
    // draft
    if (draftInfo?.content) return `Draft ${draftInfo?.content}`
    // error
    if (contactMeta?.lastMsg?.sendStatus === MessageStatus.FAILED) {
      return (
        <div className="overflow-ellipsis text-nowrap overflow-hidden w-full flex items-center">
          <Icon
            icon="x:AlertCircleStyleStroke"
            className="mr-1 flex-shrink-0"
            color="rgba(234, 99, 87, 1)"
            style={{ display: 'inline-block' }}
          />
          <span className="overflow-ellipsis text-nowrap overflow-hidden">{contactMeta?.lastMsg?.content}</span>
        </div>
      )
    }
    // withdraw
    if (contactMeta?.lastMsg?.sendStatus === MessageStatus.WITHDRAW) {
      return isSelfSendMessage(contactMeta?.lastMsg?.fromId)
        ? 'You withdrew a message'
        : `${contactMeta?.user?.remarkName ?? contactMeta?.user?.userName ?? contactMeta?.user?.nickName} withdrew a message`
    }
    // paid
    if (contactMeta?.lastMsg?.msgType === MessageType.PAID) {
      return isSelfSendMessage(contactMeta?.lastMsg?.fromId)
        ? `You have paid for a message`
        : `${contactMeta?.user?.remarkName ?? contactMeta?.user?.userName ?? contactMeta?.user?.nickName} has paid for a message`
    }
    // content
    return contactMeta?.lastMsg?.content
  }

  const hasPhoto = contactMeta?.lastMsg?.mediaList?.some((v) => v.type === 'photo')
  const hasVideo = contactMeta?.lastMsg?.mediaList?.some((v) => v.type === 'video')
  const hasAudio = contactMeta?.lastMsg?.mediaList?.some((v) => v.type === 'audio')

  return (
    <div className="flex-1 overflow-hidden">
      <div className="flex flex-col justify-center flex-1 my-(--sizing-named-mini) overflow-hidden h-(--sizing-named-huge)">
        {/* top */}
        <div className="flex justify-between items-center">
          <div
            style={{ font: 'var(--typography-text-body1-strong)' }}
            className="text-(--element-emphasis-00) overflow-ellipsis text-nowrap overflow-hidden"
          >
            {contactMeta?.user?.remarkName || contactMeta?.user?.nickName || contactMeta?.user?.userName}
          </div>
          <div
            style={{ font: 'var(--typography-text-caption1-base)' }}
            className="text-(--element-emphasis-01) mr-(--sizing-named-mini) flex items-center flex-shrink-0"
          >
            {contactMeta?.lastMsg?.fromId === getActiveAccountId() && (
              <Icon icon="x:ArrowUpLeft01StyleStroke" className="mr-(--sizing-named-pico)" />
            )}
            {formatChatTime(contactMeta?.sortTime)}
          </div>
        </div>
        {/* bottom */}
        <div className="flex justify-between overflow-hidden">
          <div
            style={{ font: 'var(--typography-text-body1-base)' }}
            className="text-(--element-emphasis-01) overflow-ellipsis text-nowrap overflow-hidden w-full"
          >
            <Text size="body1" emphasis={1} className="flex items-center">
              <div className="flex items-center flex-shrink-0">
                {hasPhoto && <Icon icon="x:Image01StyleStroke" fontSize={16} className="mr-1" />}
                {hasVideo && <Icon icon="x:PlayCircleStyleStroke" fontSize={16} className="mr-1" />}
                {hasAudio && <Icon icon="x:AudioWaveStyleSolid" fontSize={16} className="mr-1" />}
                {contactMeta?.lastMsg?.msgType === MessageType.GIF && (
                  <Icon icon="x:GifCustomStyleStroke" fontSize={16} className="mr-1" />
                )}
                {contactMeta?.lastMsg?.free === false && (
                  <Icon icon="x:SaleTag02StyleStroke" fontSize={16} className="mr-1" />
                )}
              </div>
              <div className="truncate">{renderContent()}</div>
            </Text>
          </div>
          {/* <div>{chatInfo?.lastMsgId}</div> */}
        </div>
      </div>
      {/* line */}
      <div className="w-full h-(--primitives-divider-thickness) bg-(--surface-level-02-emphasis-00)"></div>
    </div>
  )
}

export default ChatItemRight
