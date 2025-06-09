import { getActiveAccountId } from '@/models/user'
import { XImChatMessageData, XImMessageMediaType } from '@/npm/x-im'
import { getActiveContactId } from '../index'
import { getOrCreateMessageCacheManager } from '../cache'
import { sortArrayByKey } from '@/utils'

/**
 * 筛掉重复的，且gmtModified较小的数据
 */
export const handleMessageListUniqueAndSort = (userId: string, toUserId: string, list: XImChatMessageData[]) => {
  const messageCacheManager = getOrCreateMessageCacheManager(userId, toUserId)
  const state = {
    messageListIds: () => messageCacheManager.getMessageListIds(),
    messageNotServerListIds: () => messageCacheManager.getMessageNotServerListIds(),
    messageServerListIds: () => messageCacheManager.getMessageServerListIds(),
  }
  // 先去重
  for (let index = 0; index < list.length; index++) {
    const item = list[index]
    const showId = messageCacheManager.getShowMessageId(item.id)
    const i = state.messageListIds().indexOf(showId)
    // 如果不存在
    if (i === -1) {
      state.messageServerListIds().push(item.id)
      messageCacheManager.setMessageItemDetailsCache(item.id, {
        ...item,
      })
      continue
    }
    // 如果存在
    const messageItem = messageCacheManager.getMessageItemDetailsCache(showId)
    if (!item.gmtModified || !messageItem?.gmtModified) continue
    if (item.gmtModified < messageItem.gmtModified) continue
    // 需要采用接口拉取到的数据
    messageCacheManager.setMessageItemDetailsCache(item.id, {
      ...item,
    })
  }
  // 如果列表为空或者只有一项， 则不需要排序
  if (state.messageListIds().length === 0 || state.messageListIds().length === 1) {
    messageCacheManager.setMessageNotServerListIds(state.messageNotServerListIds())
    messageCacheManager.setMessageServerListIds(state.messageServerListIds())
    return
  }
  // 如果sortNotServerIds的最后一项的gmtCreate大于sortServerIds的第一项的gmtCreate， 则不更新
  const firstMessageItem = messageCacheManager.getMessageItemDetailsCache(state.messageListIds()[0])
  const secondMessageItem = messageCacheManager.getMessageItemDetailsCache(state.messageListIds()[1])
  if (
    firstMessageItem?.gmtCreate &&
    secondMessageItem?.gmtCreate &&
    firstMessageItem?.gmtCreate < secondMessageItem?.gmtCreate
  ) {
    // 再排序
    const sortNotServerIds = sortArrayByKey(
      state.messageNotServerListIds().map((v) => {
        const messageItem = messageCacheManager.getMessageItemDetailsCache(v)
        return { id: v, gmtCreate: messageItem!.gmtCreate }
      }),
      'gmtCreate',
      true,
    )
    const sortServerIds = sortArrayByKey(
      state.messageServerListIds().map((v) => {
        const messageItem = messageCacheManager.getMessageItemDetailsCache(v)
        return { id: v, gmtCreate: messageItem!.gmtCreate }
      }),
      'gmtCreate',
      true,
    )
    messageCacheManager.setMessageNotServerListIds(sortNotServerIds.map((v) => v.id))
    messageCacheManager.setMessageServerListIds(sortServerIds.map((v) => v.id))
  } else {
    messageCacheManager.setMessageNotServerListIds(state.messageNotServerListIds())
    messageCacheManager.setMessageServerListIds(state.messageServerListIds())
  }
}

/**
 * 获取当前消息id的详细信息
 * 注：此时已经在消息列表页面， 所以可以直接取userId, toUserId
 * @param id 消息的id
 * @returns 消息的详细信息
 * */
export const getMessageItemInfoById = (id: string) => {
  const userId = getActiveAccountId()
  const toUserId = getActiveContactId()
  if (!userId || !toUserId) return null
  const messageCacheManager = getOrCreateMessageCacheManager(userId, toUserId)
  const messageItem = messageCacheManager.getMessageItemDetailsCache(id)
  return messageItem
}

export const formatCallSendMessageParams = (message: Partial<XImChatMessageData>) => {
  return {
    toUserId: message.toUserId as string,
    msgType: message.msgType as number,
    content: message.content as string,
    free: message.free as boolean,
    price: message.price as number,
    frontendId: message.frontendId as string,
    replyMsgId: message.replyMsgId as string,
    replyMessage: message.replyMessage as string,
    gifId: message.gifId as string,
    gifUrl: message.gifUrl as string,
    mediaList: message.mediaList as XImMessageMediaType[],
  }
}
