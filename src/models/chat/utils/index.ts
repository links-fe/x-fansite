import { TableChatListItem } from '@/types/tables/chat'
import { getOrCreateChatCacheManager, getOrCreateChatItemCacheManager } from '../cache'
import { isSelfSendMessage } from '@/utils/chat'
import { XImChatMessage } from '@/npm/x-im'
import { getActiveContactId } from '@/models/message'
import { sortArrayByKey } from '@/utils'

/**
 * 调用接口拉取到数据后，和列表上的数据对比
 * 保留列表中不存在，且sortTime较大的数据
 *
 */
export function handleChatListDataUniqueAndSort(userId: string, list: TableChatListItem[]) {
  const chatCacheManager = getOrCreateChatCacheManager(userId)
  const state = {
    chatListIds: () => chatCacheManager.getChatListIds(),
    chatNotServerIds: () => chatCacheManager.getNotServerChatListIds(),
    chatServerIds: () => chatCacheManager.getServerChatListIds(),
  }
  // 先去重
  for (let index = 0; index < list.length; index++) {
    const item = list[index]
    const i = state.chatListIds().indexOf(item.toUserId)
    const chatItemCacheManager = getOrCreateChatItemCacheManager(userId, item.toUserId)
    // 如果不存在
    if (i === -1) {
      state.chatServerIds().push(item.toUserId)
      chatItemCacheManager.setChatItemDetails({
        ...item,
      })
      continue
    }
    // 如果存在
    const chatItem = chatItemCacheManager.getChatItemDetails()
    if (item.sortTime < chatItem!.sortTime) continue
    // 需要采用接口拉取到的数据
    chatItemCacheManager.setChatItemDetails({
      ...item,
    })
  }
  // 如果列表为空或者只有一项， 则不需要排序
  if (state.chatListIds().length === 0 || state.chatListIds().length === 1) {
    chatCacheManager.setNotServerChatListIds(state.chatNotServerIds())
    chatCacheManager.setServerChatListIds(state.chatServerIds())
    return
  }
  // 这里做一个浅检查， 比较NotServerIds的最后一项和ServerIds的第一项的sortTime
  // 正常情况
  const firstChatItemCacheManager = getOrCreateChatItemCacheManager(userId, state.chatListIds()[0])
  const secondChatItemCacheManager = getOrCreateChatItemCacheManager(userId, state.chatListIds()[1])
  const firstChatItem = firstChatItemCacheManager.getChatItemDetails()
  const secondChatItem = secondChatItemCacheManager.getChatItemDetails()
  if (firstChatItem?.sortTime && secondChatItem?.sortTime && firstChatItem.sortTime < secondChatItem.sortTime) {
    // 异常情况
    // 需要重新排序
    const sortChatNotServerIds = sortArrayByKey(
      state.chatNotServerIds().map((v) => {
        const chatItemCacheManager = getOrCreateChatItemCacheManager(userId, v)
        const chatItem = chatItemCacheManager.getChatItemDetails()
        return { toUserId: v, sortTime: chatItem!.sortTime }
      }),
      'sortTime',
      true,
    )
    const sortChatServerIds = sortArrayByKey(
      state.chatServerIds().map((v) => {
        const chatItemCacheManager = getOrCreateChatItemCacheManager(userId, v)
        const chatItem = chatItemCacheManager.getChatItemDetails()
        return { toUserId: v, sortTime: chatItem!.sortTime }
      }),
      'sortTime',
      true,
    )
    chatCacheManager.setNotServerChatListIds(sortChatNotServerIds.map((v) => v.toUserId))
    chatCacheManager.setServerChatListIds(sortChatServerIds.map((v) => v.toUserId))
  } else {
    chatCacheManager.setNotServerChatListIds(state.chatNotServerIds())
    chatCacheManager.setServerChatListIds(state.chatServerIds())
  }
}

/**
 * 来新消息时的逻辑处理
 * 插入ws消息到指定位置，或移动到指定位置
 * @returns 是否强制刷新
 */

export function handleChatListOrderDataUpdate(p: XImChatMessage) {
  const { data, sortTime } = p
  const fromId = isSelfSendMessage(data.fromId) ? data.fromId : data.toId
  const toId = isSelfSendMessage(data.fromId) ? data.toId : data.fromId

  const chatCacheManager = getOrCreateChatItemCacheManager(fromId, toId)
  const state = {
    chatListIds: () => chatCacheManager.getChatListIds(),
    chatNotServerIds: () => chatCacheManager.getNotServerChatListIds(),
    chatServerIds: () => chatCacheManager.getServerChatListIds(),
  }

  // 如果列表为空，直接添加到非服务端列表开头
  if (state.chatListIds().length === 0) {
    state.chatNotServerIds().unshift(toId)
    chatCacheManager.setNotServerChatListIds(state.chatNotServerIds())
    chatCacheManager.setChatItemDetails(formatToChatListData(p))
    return true
  }

  const oldIndex = state.chatListIds().indexOf(toId)
  const isInNotServerList = oldIndex < state.chatNotServerIds().length
  const chatItem = chatCacheManager.getChatItemDetails()

  // 如果消息不存在
  if (oldIndex === -1) {
    // 如果消息在非服务端列表中
    state.chatNotServerIds().unshift(toId)
    chatCacheManager.setNotServerChatListIds(state.chatNotServerIds())
    chatCacheManager.setChatItemDetails(formatToChatListData(p))
    return true
  }
  // 如果消息已存在
  if (oldIndex !== -1) {
    // 如果sortTime较小，忽略此消息
    if (sortTime < chatItem!.sortTime) {
      // !被抛弃掉的消息
      console.warn('被抛弃掉的消息', p)
      return false
    }
    // 如果消息已存在，先从原位置删除
    if (isInNotServerList) {
      state.chatNotServerIds().splice(oldIndex, 1)
    } else {
      state.chatServerIds().splice(oldIndex - state.chatNotServerIds().length, 1)
    }
    if (state.chatListIds().length === 0) {
      state.chatNotServerIds().unshift(toId)
      chatCacheManager.setChatItemDetails(formatToChatListData(p))
    } else {
      const firstChatId = state.chatListIds()[0]
      const firstChatCacheManager = getOrCreateChatItemCacheManager(fromId, firstChatId)
      const firstChatItem = firstChatCacheManager.getChatItemDetails()
      //异常情况
      if (p.sortTime && firstChatItem!.sortTime && p.sortTime < firstChatItem!.sortTime) {
        //异常情况
        // 先unshift再排序
        state.chatNotServerIds().unshift(toId)
        chatCacheManager.setChatItemDetails(formatToChatListData(p))
        const sortNotServerIds = sortArrayByKey(
          state.chatNotServerIds().map((v) => {
            const chatItemCacheManager = getOrCreateChatItemCacheManager(fromId, v)
            const chatItem = chatItemCacheManager.getChatItemDetails()
            return { toUserId: v, sortTime: chatItem!.sortTime }
          }),
          'sortTime',
          true,
        )
        const sortServerIds = sortArrayByKey(
          state.chatServerIds().map((v) => {
            const chatItemCacheManager = getOrCreateChatItemCacheManager(fromId, v)
            const chatItem = chatItemCacheManager.getChatItemDetails()
            return { toUserId: v, sortTime: chatItem!.sortTime }
          }),
          'sortTime',
          true,
        )
        chatCacheManager.setNotServerChatListIds(sortNotServerIds.map((v) => v.toUserId))
        chatCacheManager.setServerChatListIds(sortServerIds.map((v) => v.toUserId))
      } else {
        // 正常情况
        state.chatNotServerIds().unshift(toId)
        chatCacheManager.setChatItemDetails(formatToChatListData(p))
      }
    }
  }
  const newIndex = state.chatListIds().indexOf(toId)
  // 返回位置是否发生变化：新增返回true，位置改变返回true
  return oldIndex === -1 || oldIndex !== newIndex
}

/**
 * 将ws消息格式化为会话列表的格式
 */

export function formatToChatListData(p: XImChatMessage): TableChatListItem {
  const { data, sortTime, unreadCount } = p
  const fId = isSelfSendMessage(data.fromId) ? data.fromId : data.toId
  const tId = isSelfSendMessage(data.fromId) ? data.toId : data.fromId
  const activeContactId = getActiveContactId()
  return {
    toUserId: tId,
    sortTime,
    userId: fId,
    chatId: data.chatId,
    unreadCount: activeContactId === tId ? 0 : unreadCount.unreadCount,
    id: data.id,
    lastMsg: {
      ...data,
    },
  } as TableChatListItem
}
