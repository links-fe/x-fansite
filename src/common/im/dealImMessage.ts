import { XImChatMessage, XImChatMessageData, XImMessage, XImMessageType } from '@/npm/x-im'
import { request } from '../request'
import { xLogger } from '../logger'
import {
  chatListHandleMute,
  chatListHandleNewMessage,
  chatListHandleReject,
  setChatUnreadCountUnRead,
} from '@/models/chat'
import {
  handleMessageDelete,
  handleMessagePayEvent,
  handleMessageWithdraw,
  handleWsReceiveNewMessage,
} from '@/models/message'
import { setTotalUnreadCount } from '@/models/chat/model'
import { getActiveContactId } from '@/models/message'
import { getOrCreateChatItemCacheManager } from '@/models/chat/cache'
import { isSelfSendMessage } from '@/utils/chat'

/** 处理聊天消息更新 */
function handleChatMessageUpdate(message: XImChatMessage): void {
  // 更新会话列表
  chatListHandleNewMessage(message)
  // 更新消息列表
  handleWsReceiveNewMessage({ ...message.data, frontendId: message.frontendId }, XImMessageType.Chat)
}

export async function ON_IM_MESSAGE(message: XImMessage, isSync = false) {
  console.log('[ON_IM_MESSAGE]', message, isSync)

  // * 收到聊天消息
  if (message.type === XImMessageType.Chat) {
    handleChatMessageUpdate(message as XImChatMessage)
    return
  }

  // * 撤回消息
  if (message.type === XImMessageType.MessageWithdraw) {
    console.log('[MessageWithdraw]', message)
    handleMessageWithdraw(message.data.userId, message.data.toUserId, message.data.msgId, true)
    // 如果不在会话中
    if (getActiveContactId() !== message.data.toUserId) {
      // 更新总未读数
      setTotalUnreadCount(message.data.userId, message?.unreadCount?.totalUnreadCount || 0)
      // 更新会话的未读数
      const chatCacheManager = getOrCreateChatItemCacheManager(message.data.userId, message.data.toUserId)
      chatCacheManager.setChatItemDetails({
        unreadCount: message?.unreadCount?.unreadCount || 0,
      })
    }
    return
  }

  // * 新通知
  // if (message.type === XImMessageType.Notice) {
  //   return
  // }

  // 会话未读
  if (message.type === XImMessageType.ChatUnread) {
    console.log('[ChatUnread]', message)
    const { data } = message
    setChatUnreadCountUnRead(data.userId, data.toUserId, true)
    return
  }

  // 会话mute
  if (message.type === XImMessageType.ChatMute) {
    console.log('[ChatMute]', message)
    const { data } = message
    chatListHandleMute(data.userId, data.toUserId, data.mute, true)
    return
  }
  // 会话reject
  if (message.type === XImMessageType.MessageReject) {
    console.log('[MessageReject]', message)
    const { data } = message
    chatListHandleReject(data.userId, data.toUserId, data.reject, true)
    return
  }
  // 素材转码状态变更通知
  if (message.type === XImMessageType.VaultStatusChange) {
    console.log('[VaultStatusChange]', message)
    // TODO: 会话列表按需更新

    // 更新消息列表
    handleWsReceiveNewMessage({ ...message.data, frontendId: message.frontendId }, XImMessageType.VaultStatusChange)
  }

  // 消息删除
  if (message.type === XImMessageType.MessageDelete) {
    console.log('[MessageDelete]', message)
    const { data } = message
    handleMessageDelete(data.userId, data.toUserId, data.msgId, true)
    return
  }
  // 消息付费
  if (message.type === XImMessageType.MessagePay) {
    console.log('[MessagePay]', message)
    const { data } = message
    // 更新消息列表
    const isMe = isSelfSendMessage(data.fromId)
    const userId = isMe ? data.fromId : data.toId
    const toUserId = isMe ? data.toId : data.fromId
    handleMessagePayEvent(userId, toUserId, data, true)
    return
  }

  // if (message.type === XImMessageType.UserOnline) {
  //   return
  // }

  // * 超长文本
  if (message.type === XImMessageType.LongText) {
    // Log.red('[LongText]', message)
    try {
      const url = message.data.url
      if (url) {
        // * 请求超长文本
        const res = await request.get(url, {
          disableToken: true,
          // 添加重试次数
          retryTimes: 3,
          retryDelay: 100,
        })
        // console.log('[LongText]', res)

        // * 解压缩
        // const text = decryptText(res.data)
        // const json = JSON.parse(text)

        // emitNewChatMessage({
        //   ...message,
        //   type: IImMessageType.Chat,
        //   data: res,
        // })
        ON_IM_MESSAGE(res, true)
      }
    } catch (error) {
      // 请求超长文本失败
      xLogger.error('[im]long text', error)
    }
    return
  }
}

export const formatToMessageItem = (message: XImChatMessage): XImChatMessageData => {
  const { data } = message
  return {
    ...data,
  }
}
