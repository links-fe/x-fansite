// 带有消息日期、消息提示的最外层消息
import React from 'react'
import { Text } from '@x-vision/design'
import { useMessageItemMeta } from '@/models/message/cache/meta'
import { getMessageItemInfoById } from '@/models/message/utils'
import { isSelfSendMessage } from '@/utils/chat'
import { MessageStatus, MessageType } from '@/types/tables/message'
import { getOrCreateChatItemCacheManager } from '@/models/chat/cache'
import { XImChatMessageData } from '@/npm/x-im'
import dayjs from 'dayjs'
import MessageMain from './MessageMain'
interface Iprops {
  id: string
  messageItem?: Partial<XImChatMessageData> // 引用消息弹窗 从外部传入数据
  toUserId: string
  userId: string
  nexItemId?: string // 下一个消息的id  (时间更新一个消息的id)
  preId?: string // 上一个消息的id   (用于展示日期)
  listRef?: React.RefObject<HTMLDivElement | null>
}
function MessageItem(props: Iprops) {
  const { id, nexItemId, preId, userId, toUserId, messageItem, listRef } = props
  const messageItemData = useMessageItemMeta(id)
  const messageItemInfo = messageItem || messageItemData
  const isMe = isSelfSendMessage(messageItemInfo.fromId)
  const isReplyMessage = !!messageItem?.id
  const chatContactCache = getOrCreateChatItemCacheManager(userId, toUserId)
  const contactInfo = chatContactCache?.getChatItemDetails()

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
  // 撤回消息
  if (messageItemInfo.sendStatus === MessageStatus.WITHDRAW) {
    return (
      <Text size="body2" emphasis={1} className="text-center my-5">
        {isMe
          ? 'You withdrew a message'
          : `${contactInfo?.user?.remarkName ?? contactInfo?.user?.userName ?? contactInfo?.user?.nickName} withdrew a message`}
      </Text>
    )
  }

  // 付费系统消息
  if (messageItemInfo.msgType === MessageType.PAID) {
    return (
      <div className="my-4 flex items-center justify-center">
        <Text size="body2" emphasis={1} className="inline-flex items-center justify-center">
          {isMe
            ? `You have paid for a message`
            : `${contactInfo?.user?.remarkName ?? contactInfo?.user?.userName ?? contactInfo?.user?.nickName} has paid for a message`}
        </Text>
      </div>
    )
  }

  // 对方的敏感词的不展示
  if (!isMe && messageItemInfo.sendStatus === MessageStatus.CONTAINS_PROHIBITED_WORDS) {
    return <></>
  }

  const showDateText = (time: number) => {
    if (dayjs().isSame(dayjs(time), 'day')) {
      return 'Today'
    } else if (dayjs().add(1, 'day').isSame(dayjs(time), 'day')) {
      return 'Yesterday'
    } else if (dayjs().add(7, 'day').isAfter(dayjs(time), 'day')) {
      return dayjs(time).format('dddd')
    } else {
      return dayjs(time).format('DD-MMM-YYYY')
    }
  }

  const isSameDay = () => {
    if (!messageItemInfo.gmtCreate) return false
    if (!preId) return showDateText(messageItemInfo.gmtCreate)
    const nextMessageItemInfo = getMessageItemInfoById(preId)
    if (!nextMessageItemInfo) return showDateText(messageItemInfo.gmtCreate)
    if (!dayjs(messageItemInfo.gmtCreate).isSame(dayjs(nextMessageItemInfo.gmtCreate), 'day')) {
      return showDateText(messageItemInfo.gmtCreate)
    }
    return false
  }

  return (
    <>
      {/* 消息主体 */}
      <MessageMain
        id={id}
        messageItemInfo={messageItemInfo}
        isReplyMessage={isReplyMessage}
        nexItemId={nexItemId}
        toUserId={toUserId}
        userId={userId}
        listRef={listRef}
      />
      {isSameDay() && !messageItem && (
        <div className="flex items-center justify-center py-6">
          <Text size="body2" strong emphasis={1}>
            {isSameDay()}
          </Text>
        </div>
      )}
    </>
  )
}

export default MessageItem
