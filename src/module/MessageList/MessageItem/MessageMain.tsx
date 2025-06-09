// 包含头像、时间、更多按钮的消息主体
import React, { useRef, useState } from 'react'
import MessageContent from './MessageContent'
import MessageMoreBtn from './MessageMoreBtn'
import { cln } from '@x-vision/design'
import { getMessageItemInfoById } from '@/models/message/utils'
import { isSelfSendMessage } from '@/utils/chat'
import MessageTimeAndStatus from './MessageTimeAndStatus'
// import { LazyMount } from '@/npm/x-lazy-mount'
import ChatAvatar from '@/module/ChatList/ChatItem/ChatAvatar'
import { XImChatMessageData } from '@/npm/x-im'
import { useLongPress } from 'ahooks'
import MessageBottomTip from './MessageBottomTip'
import { MessageStatus } from '@/types/tables/message'

interface IProps {
  id: string //消息唯一id   不等于messageItemInfo.id
  messageItemInfo: Partial<XImChatMessageData>
  isReplyMessage: boolean
  toUserId: string
  userId: string
  nexItemId?: string // 下一个消息的id  (时间更新一个消息的id)
  listRef?: React.RefObject<HTMLDivElement | null>
}
function MessageMain(props: IProps) {
  const { nexItemId, userId, toUserId, messageItemInfo, isReplyMessage, id, listRef } = props
  const isMe = isSelfSendMessage(messageItemInfo.fromId)

  const [visibleMoreMenu, setVisibleMoreMenu] = useState<undefined | string>()
  const messageContent = useRef<HTMLDivElement>(null)
  useLongPress(() => {
    if (messageItemInfo.sendStatus === MessageStatus.PENDING) return
    setVisibleMoreMenu('more')
  }, messageContent)

  // 测试代码 后期补全
  // const calculatedChatMessageItemHeight = (): number => {
  //   // const mediaHeight = 430
  //   // const textHeight = 40
  //   // const timeHeight = 30
  //   // const otherHeight = 31
  //   // const audioHeight = 36
  //   // const storyHeight = 128
  //   // let ItemHeight = 100

  //   return 100
  // }

  // 时间展示逻辑
  const timeShow = () => {
    if (!nexItemId) return true
    const nextMessageItemInfo = getMessageItemInfoById(nexItemId)
    if (!nextMessageItemInfo || nextMessageItemInfo.sendStatus === MessageStatus.WITHDRAW) return true
    if (messageItemInfo.fromId !== nextMessageItemInfo.fromId) return true
    if (messageItemInfo.gmtCreate && nextMessageItemInfo.gmtCreate) {
      const diff = nextMessageItemInfo.gmtCreate - messageItemInfo.gmtCreate
      if (diff > 1000 * 60) {
        return true
      } else {
        return false
      }
    }
    return true
  }

  return (
    <div message-id={messageItemInfo.id}>
      {/* <LazyMount style={{ height: calculatedChatMessageItemHeight() }}> */}
      <div
        className={cln('flex px-4 relative', !isMe && 'pl-[60px]!', isReplyMessage && 'px-0')}
        dom-id="message-item-index"
      >
        {/* 头像 */}
        {timeShow() && !isMe && <ChatAvatar toUserId={toUserId} size="generous" className="absolute left-0 bottom-6" />}
        <div className="w-full my-1 gap-1 flex-1">
          <div className={isMe ? 'flex items-end gap-1 flex-row-reverse' : 'flex items-end gap-1'}>
            {/* 内容 */}
            <MessageContent
              id={id}
              messageItemInfo={messageItemInfo}
              isReplyMessage={isReplyMessage}
              isMe={isMe}
              userId={userId}
              toUserId={toUserId}
              ref={messageContent}
              listRef={listRef}
            />
            {/* 更多按钮 */}
            {!isReplyMessage && messageItemInfo.sendStatus !== MessageStatus.PENDING && (
              <MessageMoreBtn
                id={id}
                messageItemInfo={messageItemInfo}
                toUserId={toUserId}
                userId={userId}
                visibleMoreMenu={visibleMoreMenu}
                setVisibleMoreMenu={setVisibleMoreMenu}
                listRef={listRef}
              />
            )}
          </div>
          {/* time */}
          <div className={cln('mx-3 mt-1 flex flex-row', isMe && 'justify-end')}>
            <MessageTimeAndStatus messageItemInfo={messageItemInfo} timeShow={timeShow()} />
          </div>
          {/* 消息底部的提示内容， 比如敏感词消息 */}
          <MessageBottomTip messageItemInfo={messageItemInfo} />
        </div>
      </div>
      {/* </LazyMount> */}
    </div>
  )
}

export default MessageMain
