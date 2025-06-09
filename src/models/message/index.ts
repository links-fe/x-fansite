/**
 * 发送消息
 */

import { XImChatMessageData, XImMessageType } from '@/npm/x-im'
import { getActiveAccountId } from '../user'
import { v4 as uuidv4 } from 'uuid'
import { MessageStatus, MessageType } from '@/types/tables/message'
import { setMessageListStore } from './messagePaging.model'
import { callDelMessageApi, callSendMessageApi, callUnlockMessageApi, callWithdrawMessageApi } from '@/services/message'
import { formatCallSendMessageParams } from './utils'
import { isSelfSendMessage } from '@/utils/chat'
import { updateMessageItemMeta } from './cache/meta'
import { updateContactMeta } from '../chat/cache/meta'
import { callMessageReadApi } from '@/services/chat'
import { getOrCreateChatItemCacheManager } from '../chat/cache'
import { getOrCreateMessageCacheManager } from './cache'
import { getActiveContactId } from './model'
import { sortArrayByKey } from '@/utils'

/**
 * 处理消息发送的公共逻辑
 */
async function handleMessageSend(params: {
  messageData: Partial<XImChatMessageData>
  userId: string
  toUserId: string
  messageId: string
  isResend?: boolean
}) {
  const { messageData, userId, toUserId, messageId, isResend } = params
  const messageCacheManager = getOrCreateMessageCacheManager(userId, toUserId)
  const chatCacheManager = getOrCreateChatItemCacheManager(userId, toUserId)

  // 更新消息状态为发送中
  messageCacheManager.setMessageItemDetailsCache(messageId, {
    ...(isResend ? messageCacheManager.getMessageItemDetailsCache(messageId) : messageData),
    sendStatus: MessageStatus.PENDING,
  })
  updateMessageItemMeta(userId, toUserId, messageId, {})

  // 给接口用的参数  媒体数据不需要那么多字段
  const data = {
    ...messageData,
    mediaList: messageData.mediaList?.map((v) => ({
      id: v.id,
      type: v.type,
      fileKey: v.fileKey,
      status: v.status,
    })),
  }
  try {
    const res = await callSendMessageApi(formatCallSendMessageParams(data))
    if (res?.id) {
      // 更新缓存
      messageCacheManager.setMessageItemDetailsCache(messageId, {
        ...(isResend ? messageCacheManager.getMessageItemDetailsCache(messageId) : messageData),
        ...res,
      })
      // 判断是否重新排序
      const isReSort = handleMessageReSort({
        messageKey: messageId,
        messageData: res,
        userId,
        toUserId,
      })
      // 设置映射
      messageCacheManager.setMessageToTempId(res.id, messageId)
      if (isReSort) {
        refreshMessageListStoreState(userId, toUserId)
      } else {
        updateMessageItemMeta(userId, toUserId, messageId, {})
      }
    }
  } catch (error) {
    const messageItem = messageCacheManager.getMessageItemDetailsCache(messageId)
    // 如果消息已经修改为成功了
    if (messageItem?.sendStatus === MessageStatus.SENT) {
      return
    }
    console.error(error)
    // 更新消息状态为失败
    messageCacheManager.setMessageItemDetailsCache(messageId, {
      ...(isResend ? messageCacheManager.getMessageItemDetailsCache(messageId) : messageData),
      sendStatus: MessageStatus.FAILED,
    })
    // 更新会话列表缓存
    chatCacheManager.setChatItemDetails({
      sortTime: messageData.gmtCreate,
      lastMsg: {
        ...messageData,
        sendStatus: MessageStatus.FAILED,
      },
    })
    updateMessageItemMeta(userId, toUserId, messageId, {})
    updateContactMeta(userId, toUserId, {})
  }
}

const handleMessageReSort = (p: {
  messageKey: string
  messageData: XImChatMessageData
  userId: string
  toUserId: string
}) => {
  const { messageKey, messageData, userId, toUserId } = p
  const messageCacheManager = getOrCreateMessageCacheManager(userId, toUserId)
  const messageList = messageCacheManager.getMessageListIds()
  const messageNotServerList = messageCacheManager.getMessageNotServerListIds()
  const messageServerList = messageCacheManager.getMessageServerListIds()
  const messageIds = messageCacheManager.getMessageListIds()
  const originIndex = messageIds.findIndex((id) => id === messageKey)
  for (let index = 0; index < messageList.length; index++) {
    const key = messageList[index]
    const item = messageCacheManager.getMessageItemDetailsCache(key)
    if (item?.gmtCreate && messageData.gmtCreate && messageData.gmtCreate >= item?.gmtCreate) {
      if (originIndex === index) {
        return false
      }
      // 先删除
      if (originIndex < messageNotServerList.length) {
        // 在非服务端列表
        messageNotServerList.splice(originIndex, 1)
        messageCacheManager.setMessageNotServerListIds(messageNotServerList)
      } else {
        // 在服务端列表
        messageServerList.splice(originIndex - messageNotServerList.length, 1)
        messageCacheManager.setMessageServerListIds(messageServerList)
      }
      // 再插入，在非服务端列表
      if (index < messageNotServerList.length) {
        // 再插入
        messageNotServerList.splice(index, 0, messageKey)
        messageCacheManager.setMessageNotServerListIds(messageNotServerList)
      } else {
        // 在服务端列表
        messageServerList.splice(index - messageNotServerList.length, 0, messageKey)
        messageCacheManager.setMessageServerListIds(messageServerList)
      }
      return true
    }
    continue
  }
  return false
}

/**
 * 本地发送消息
 */
export const sendMessage = async (message: Partial<XImChatMessageData>) => {
  const userId = getActiveAccountId()!
  const toUserId = getActiveContactId()!
  const messageCacheManager = getOrCreateMessageCacheManager(userId, toUserId)
  const notServerMessageIds = messageCacheManager.getMessageNotServerListIds()

  const newMessage = {
    fromId: userId,
    toUserId,
    msgType: message.msgType ?? MessageType.TEXT,
    content: message.content || '',
    free: message.free ?? true,
    price: message.price,
    frontendId: `local-${uuidv4()}`,
    gmtCreate: Date.now(),
    gmtModified: Date.now(),
    sendStatus: MessageStatus.PENDING,
    replyMsgId: message.replyMsgId,
    replyMessage: message.replyMessage,
    gifId: message.gifId,
    gifUrl: message.gifUrl,
    mediaList: message.mediaList,
  }

  // 插入本地消息列表
  notServerMessageIds.unshift(newMessage.frontendId)
  messageCacheManager.setMessageNotServerListIds(notServerMessageIds)
  // 更新缓存
  messageCacheManager.setMessageItemDetailsCache(newMessage.frontendId, newMessage)
  // 刷新页面
  refreshMessageListStoreState(userId, toUserId)

  await handleMessageSend({
    messageData: newMessage,
    userId,
    toUserId,
    messageId: newMessage.frontendId,
    isResend: false,
  })
}

/**
 * 重发消息
 */
export const resendMessage = async (id: string) => {
  const userId = getActiveAccountId()!
  const toUserId = getActiveContactId()!
  const messageCacheManager = getOrCreateMessageCacheManager(userId, toUserId)

  if (!id) return
  const messageItem = messageCacheManager.getMessageItemDetailsCache(id)
  console.log('resendMessage---messageItem', messageItem)
  if (!messageItem) return

  const messageData = {
    toUserId,
    msgType: messageItem.msgType,
    content: messageItem.content,
    frontendId: messageItem.frontendId,
    free: messageItem.free,
    price: messageItem.price,
    gmtCreate: Date.now(),
    gmtModified: Date.now(),
    replyMsgId: messageItem.replyMsgId,
    replyMessage: messageItem.replyMessage,
    mediaList: messageItem.mediaList,
    gifId: messageItem.gifId,
    gifUrl: messageItem.gifUrl,
  }

  await handleMessageSend({
    messageData,
    userId,
    toUserId,
    messageId: id,
    isResend: true,
  })
}

/**
 *
 * 消息列表接受到新消息
 */
export const handleWsReceiveNewMessage = async (message: Partial<XImChatMessageData>, type?: XImMessageType) => {
  if (!message.id || !message.gmtCreate) return
  const isSelfMessage = isSelfSendMessage(message.fromId)
  const fId = isSelfMessage ? message.fromId : message.toId
  const tId = isSelfMessage ? message.toId : message.fromId
  if (!fId || !tId) return

  // 如果在当前会话，且不是自己发的，需要读取未读数
  if (tId === getActiveContactId() && !isSelfMessage && type === XImMessageType.Chat) {
    callMessageReadApi({
      toUserId: tId,
      lastMsgId: message.id || '',
    })
  }
  if (type === XImMessageType.VaultStatusChange) {
    multipleUpdateReplyMessageStatus(fId, tId, { ...message }, 'vaultChange')
  }
  const messageCacheManager = getOrCreateMessageCacheManager(fId, tId)
  const state = {
    messageListIds: () => messageCacheManager.getMessageListIds(),
    messageNotServerListIds: () => messageCacheManager.getMessageNotServerListIds(),
    messageServerListIds: () => messageCacheManager.getMessageServerListIds(),
  }

  // 查找消息是否存在于列表中
  const index = state.messageListIds().findIndex((id) => {
    const item = messageCacheManager.getMessageItemDetailsCache(id)
    if (item?.id && message.id && item?.id === message.id) {
      return true
    }
    if (item?.frontendId && message.frontendId && item?.frontendId === message.frontendId) {
      return true
    }
    return false
  })
  if (index === -1) {
    // 消息不存在， 先unshift再判断排序
    state.messageNotServerListIds().unshift(message.id)
    if (state.messageListIds().length === 0 || state.messageListIds().length === 1) {
      messageCacheManager.setMessageNotServerListIds(state.messageNotServerListIds())
      messageCacheManager.setMessageItemDetailsCache(message.id, message)
      refreshMessageListStoreState(fId, tId)
      return
    }
    const firstMessageItem = messageCacheManager.getMessageItemDetailsCache(state.messageListIds()[0])
    const secondMessageItem = messageCacheManager.getMessageItemDetailsCache(state.messageListIds()[1])
    if (
      firstMessageItem?.gmtCreate &&
      secondMessageItem?.gmtCreate &&
      firstMessageItem.gmtCreate < secondMessageItem.gmtCreate
    ) {
      // 异常
      // 重新排序
      const sortNotServerIds = sortArrayByKey(
        state.messageNotServerListIds().map((v) => {
          const messageItem = messageCacheManager.getMessageItemDetailsCache(v)
          return { id: v, gmtCreate: messageItem!.gmtCreate }
        }),
        'gmtCreate',
        true,
      )
      const sortMessageServerIds = sortArrayByKey(
        state.messageServerListIds().map((v) => {
          const messageItem = messageCacheManager.getMessageItemDetailsCache(v)
          return { id: v, gmtCreate: messageItem!.gmtCreate }
        }),
        'gmtCreate',
        true,
      )
      messageCacheManager.setMessageNotServerListIds(sortNotServerIds.map((v) => v.id))
      messageCacheManager.setMessageServerListIds(sortMessageServerIds.map((v) => v.id))
    } else {
      // 正常排序
      messageCacheManager.setMessageNotServerListIds(state.messageNotServerListIds())
      messageCacheManager.setMessageServerListIds(state.messageServerListIds())
    }
    messageCacheManager.setMessageItemDetailsCache(message.id, message)
    refreshMessageListStoreState(fId, tId)
  } else {
    const showId = state.messageListIds()[index]
    const tempId = messageCacheManager.getMessageItemDetailsCache(showId)?.frontendId
    const realId = message.id
    if (message.frontendId) {
      messageCacheManager.setMessageToTempId(realId, message.frontendId)
    }
    // 消息已存在，更新消息内容
    messageCacheManager.setMessageItemDetailsCache(showId, {
      ...message,
      frontendId: message.frontendId || tempId,
    })
    updateMessageItemMeta(fId, tId, showId, {})
  }
}

/**
 * 消息撤回操作
 */
export const handleMessageWithdraw = async (userId: string, toUserId: string, id: string, isWs: boolean = false) => {
  const messageCacheManager = getOrCreateMessageCacheManager(userId, toUserId)
  const chatCacheManager = getOrCreateChatItemCacheManager(userId, toUserId)
  const showId = messageCacheManager.getShowMessageId(id)
  const messageItem = messageCacheManager.getMessageItemDetailsCache(showId)
  if (isWs) {
    const item = messageItem || {}
    multipleUpdateReplyMessageStatus(userId, toUserId, { ...item }, 'withdraw')
  }
  if (!id || !messageItem?.id) return
  messageCacheManager.setMessageItemDetailsCache(showId, {
    sendStatus: MessageStatus.WITHDRAW,
  })
  updateMessageItemMeta(userId, toUserId, showId, {})
  // 判断是否消息列表最新一条消息
  const messageIds = messageCacheManager.getMessageListIds()
  const lastMsgId = messageIds[0]
  if (lastMsgId === id) {
    chatCacheManager.setChatItemDetails({
      lastMsg: {
        sendStatus: MessageStatus.WITHDRAW,
      },
    })
    updateContactMeta(userId, toUserId, {})
  }
  if (isWs) return
  // 调用接口
  try {
    await callWithdrawMessageApi({
      toUserId,
      msgId: messageItem.id,
    })
  } catch (error) {
    console.error(error)
    // TODO 还原操作
  }
}

/**
 * 遍历循环当前视图的消息记录缓存， 更改引用消息的sendStatus 为4
 */
export const multipleUpdateReplyMessageStatus = (
  userId: string,
  toUserId: string,
  message: Partial<XImChatMessageData>,
  type: 'withdraw' | 'delete' | 'pay' | 'vaultChange',
) => {
  const messageCacheManager = getOrCreateMessageCacheManager(userId, toUserId)
  const messageList = messageCacheManager.getMessageListIds()
  messageList.forEach((id) => {
    const messageItem = messageCacheManager.getMessageItemDetailsCache(id)
    if (messageItem?.replyMessage?.id && message?.id && messageItem?.replyMessage?.id === message?.id) {
      if (['withdraw', 'delete'].includes(type)) {
        messageCacheManager.setMessageItemDetailsCache(id, {
          replyMessage: {
            ...message,
            sendStatus: MessageStatus.WITHDRAW,
            content: '',
          },
        })
      }
      if (['pay', 'vaultChange'].includes(type)) {
        messageCacheManager.setMessageItemDetailsCache(id, {
          replyMessage: {
            ...message,
          },
        })
      }
      updateMessageItemMeta(userId, toUserId, id, {})
    }
  })
}

/**
 * 消息删除操作
 */
export const handleMessageDelete = async (userId: string, toUserId: string, id: string, isWs: boolean = false) => {
  const messageCacheManager = getOrCreateMessageCacheManager(userId, toUserId)
  const showId = messageCacheManager.getShowMessageId(id)
  const messageItem = messageCacheManager.getMessageItemDetailsCache(showId)

  // 更新操作
  removeMessageFromList(userId, toUserId, showId)
  if (isWs) {
    const item = messageItem || {}
    multipleUpdateReplyMessageStatus(userId, toUserId, { ...item }, 'delete')
  }
  // 调用接口
  if (!messageItem?.id) return
  if (isWs) return
  try {
    await callDelMessageApi({
      toUserId,
      msgId: messageItem?.id,
    })
  } catch (error) {
    console.error(error)
    // TODO 还原操作
  }
}

// 刷新页面
export const refreshMessageListStoreState = (userId: string, toUserId: string) => {
  const messageCacheManager = getOrCreateMessageCacheManager(userId, toUserId)
  const data = messageCacheManager.getMessageListIds()
  const paging = messageCacheManager.getPagingInstance()
  // 设置最新最新一条非自己发的消息id
  for (let index = 0; index < data.length; index++) {
    const id = data[index]
    const messageItem = messageCacheManager.getMessageItemDetailsCache(id)
    if (messageItem?.fromId !== userId) {
      messageCacheManager.setNewestNotSelfMessageId(id)
      break
    }
  }
  // 如果当前是选中的会话，且是当前用户，则更新store
  if (toUserId === getActiveContactId() && userId === getActiveAccountId()) {
    setMessageListStore({
      ...paging.getState(),
      data: data,
      isEmpty: paging.getIsEmpty(data),
    })
  }
}

/**
 * 消息列表去掉某条数据，包括撤回，删除
 */
export const removeMessageFromList = (userId: string, toUserId: string, id: string) => {
  const messageCacheManager = getOrCreateMessageCacheManager(userId, toUserId)
  const notServerMessageIds = messageCacheManager.getMessageNotServerListIds()
  const serverMessageIds = messageCacheManager.getMessageServerListIds()
  const messageIds = messageCacheManager.getMessageListIds()
  const messageItem = messageCacheManager.getMessageItemDetailsCache(id)
  if (!messageItem) return
  const index = messageIds.findIndex((messageId) => {
    if (messageId && messageItem.id && messageItem.id === messageId) return true
    if (messageId && messageItem.frontendId && messageItem.frontendId === messageId) return true
    return false
  })
  // 不存在
  if (index === -1) return
  // 存在
  // 删除
  if (index < notServerMessageIds.length) {
    // 在非服务端列表
    notServerMessageIds.splice(index, 1)
    messageCacheManager.setMessageNotServerListIds(notServerMessageIds)
  } else {
    // 在服务端列表
    serverMessageIds.splice(index - notServerMessageIds.length, 1)
    messageCacheManager.setMessageServerListIds(serverMessageIds)
  }
  // 如果删除或撤回的是最新一条消息, 需要更新会话列表的最后一条消息
  if (index === 0) {
    const preMessageItem = messageCacheManager.getMessageItemDetailsCache(messageIds[1]) || {}
    const preMessageId = preMessageItem.id
    const chatCacheManager = getOrCreateChatItemCacheManager(userId, toUserId)
    const chatItemDetails = chatCacheManager.getChatItemDetails()
    if (!chatItemDetails) return
    chatCacheManager.setChatItemDetails({
      lastMsg: {
        ...preMessageItem,
        id: preMessageId,
        content: preMessageItem.content || '',
      },
    })
    // 更新会话
    updateContactMeta(userId, toUserId, {})
  }
  // 刷新页面
  refreshMessageListStoreState(userId, toUserId)
}

/**
 * 消息付费事件
 */
export const handleMessagePayEvent = async (
  userId: string,
  toUserId: string,
  data: Partial<XImChatMessageData>,
  isWs: boolean = false,
) => {
  if (!data.id) return
  const messageCacheManager = getOrCreateMessageCacheManager(userId, toUserId)
  const showId = messageCacheManager.getShowMessageId(data.id)
  const messageItem = messageCacheManager.getMessageItemDetailsCache(showId)
  const realId = messageItem?.id
  if (isWs) {
    const item = messageItem || {}
    multipleUpdateReplyMessageStatus(userId, toUserId, { ...data, frontendId: item?.frontendId }, 'pay')
  }
  if (!messageItem || !realId) return
  messageCacheManager.setMessageItemDetailsCache(showId, {
    ...data,
    unlock: true,
  })
  // 更新视图
  updateMessageItemMeta(userId, toUserId, showId, {})
  if (isWs) return
  try {
    await callUnlockMessageApi({
      toUserId,
      msgId: realId,
    })
  } catch (error) {
    console.error(error)
  }
}

export { getActiveContactId }
