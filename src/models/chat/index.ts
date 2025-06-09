import { TableChatListItem } from '@/types/tables/chat'
import {
  callMessageMuteApi,
  callMessageReadApi,
  callMessageRejectApi,
  callMessageUnReadApi,
  getChatInfoByUserIdApi,
} from '@/services/chat'
import { updateContactMeta } from './cache/meta'
import { isSelfSendMessage } from '@/utils/chat'
import { XImChatMessage } from '@/npm/x-im'
import { setChatListStore } from './chatPaging.model'
import { handleChatListOrderDataUpdate } from './utils'
import { getTotalUnreadCount, getTotalUnreadCountUpdateTime, setTotalUnreadCount } from './model'
import { getActiveContactId } from '../message'
import { getOrCreateChatCacheManager, getOrCreateChatItemCacheManager } from './cache'
import { getActiveAccountId } from '../user'
import { handlePlayAudio } from '@/utils/audioPlayer'
import { STATIC_SOURCE_URL } from '@/constants'
import { debounce } from '@/utils'

/** 来新消息时的逻辑处理 */
export async function chatListHandleNewMessage(p: XImChatMessage) {
  const { data } = p
  const fId = isSelfSendMessage(data.fromId) ? data.fromId : data.toId
  const tId = isSelfSendMessage(data.fromId) ? data.toId : data.fromId
  // 1. 更新聊天列表顺序及数据
  const isForcedUpdate = handleChatListOrderDataUpdate(p)

  // 2. 更新总未读数
  if (tId !== getActiveContactId()) {
    const updateTime = getTotalUnreadCountUpdateTime(fId)
    if (!updateTime || (updateTime && updateTime < p.unreadCount?.updateTime)) {
      setTotalUnreadCount(fId, p?.unreadCount?.totalUnreadCount)
    }
  }
  // ws推过来的消息没有user信息，此时需要请求接口更新User信息
  const chatCacheManager = getOrCreateChatItemCacheManager(fId, tId)
  const chatItem = chatCacheManager.getChatItemDetails()
  if (!chatItem?.user?.userId) {
    const res = await getChatInfoByUserIdApi(tId)
    chatCacheManager.setChatItemDetails({ user: res.user })
    // 并设置在线状态的更新时间
    chatCacheManager.setChatOnlineStatusUpdateTime(Date.now())
  }
  // 非静音， 则播放声音
  if (!chatCacheManager.getChatItemDetails()?.mute && !isSelfSendMessage(data.fromId)) {
    handlePlayAudio(`${STATIC_SOURCE_URL}/audio/message.mp3`)
  }
  // 3. 刷新UI状态
  if (isForcedUpdate) {
    debounce(refreshChatListStoreState, 300)(fId)
  } else {
    updateContactMeta(fId, tId, {})
  }
}

/**
 * 将某个会话的未读数设置已读
 */
export const clearChatUnreadCount = async (userId: string, toUserId: string) => {
  const chatCacheManager = getOrCreateChatItemCacheManager(userId, toUserId)
  const item = chatCacheManager.getChatItemDetails()
  const originUnreadCount = item?.unreadCount || 0
  // 设置单个会话未读数
  chatCacheManager.setChatItemDetails({ unreadCount: 0 })
  if (originUnreadCount === 0) return
  // 设置总未读数
  const totalUnreadCount = getTotalUnreadCount(userId)
  setTotalUnreadCount(userId, Math.max(totalUnreadCount - originUnreadCount, 0))
  // 更新视图
  updateContactMeta(userId, toUserId, {})
  // 调用接口
  if (item?.lastMsg?.id && item?.unreadCount !== 0) {
    try {
      await callMessageReadApi({
        toUserId,
        lastMsgId: item?.lastMsg?.id,
      })
    } catch (e) {
      console.log(e, 'e----------->>>')
      // 恢复未读数
      chatCacheManager.setChatItemDetails({
        unreadCount: originUnreadCount,
      })
    }
  }
}

/**
 * 将某个会话的设置为未读
 */
export const setChatUnreadCountUnRead = async (userId: string, toUserId: string, isWs: boolean = false) => {
  const chatCacheManager = getOrCreateChatItemCacheManager(userId, toUserId)
  const item = chatCacheManager.getChatItemDetails()
  const originUnreadCount = item?.unreadCount || 0
  if (originUnreadCount === 1) return
  // 设置单个会话未读数
  chatCacheManager.setChatItemDetails({
    unreadCount: 1,
  })
  // 设置总未读数
  const totalUnreadCount = getTotalUnreadCount(userId)
  setTotalUnreadCount(userId, Math.max(totalUnreadCount - originUnreadCount + 1, 0))
  // 更新视图
  updateContactMeta(userId, toUserId, {})
  if (isWs) return
  // 调用接口
  try {
    await callMessageUnReadApi({
      toUserId,
    })
  } catch (e) {
    console.log(e, 'e----------->>>')
    // 恢复未读数
    chatCacheManager.setChatItemDetails({
      unreadCount: originUnreadCount,
    })
    updateContactMeta(userId, toUserId, {})
  }
}

/**
 * 根据userID获取会话信息， 不存在则请求接口并设置到CHAT_MAP中
 * */
export async function setChatInfoByUserIdApi(userId: string, toUserId: string): Promise<TableChatListItem | null> {
  if (!userId || !toUserId) return null
  const chatCacheManager = getOrCreateChatItemCacheManager(userId, toUserId)
  if (!chatCacheManager.getChatItemDetails()) {
    const res = await getChatInfoByUserIdApi(toUserId)
    chatCacheManager.setChatItemDetails(res)
  }
  return null
}

/**
 * 刷新， 重新渲染chatList视图
 */
export const refreshChatListStoreState = (userId: string) => {
  if (userId !== getActiveAccountId()) return
  const chatCacheManager = getOrCreateChatCacheManager(userId)
  const paging = chatCacheManager.getPagingInstance()
  const data = chatCacheManager.getChatListIds()
  setChatListStore({
    ...paging.getState(),
    data: data,
    isEmpty: paging.getIsEmpty(data),
    hadInitData: true,
  })
}
/**
 * 消息静音处理
 */
export async function chatListHandleMute(userId: string, toUserId: string, mute: boolean, isWs: boolean = false) {
  const chatCacheManager = getOrCreateChatItemCacheManager(userId, toUserId)
  const chatItem = chatCacheManager.getChatItemDetails()
  if (!chatItem) return
  if (chatItem.mute === mute) return
  // 设置mute
  chatCacheManager.setChatItemDetails({
    mute,
  })
  // 更新视图
  updateContactMeta(userId, toUserId, {})
  if (isWs) return
  // 掉接口
  try {
    await callMessageMuteApi({
      toUserId,
      mute,
    })
  } catch (e) {
    console.log(e, 'e----------->>>')
    // 恢复mute
    chatCacheManager.setChatItemDetails({
      mute: !mute,
    })
    updateContactMeta(userId, toUserId, {})
  }
}

/**
 * 联系人拒收处理
 * */
export async function chatListHandleReject(userId: string, toUserId: string, reject: boolean, isWs: boolean = false) {
  const chatCacheManager = getOrCreateChatItemCacheManager(userId, toUserId)
  const chatItem = chatCacheManager.getChatItemDetails()
  const originReject = chatItem?.reject
  if (!chatItem) return
  if (originReject === reject) return
  // 设置mute
  chatCacheManager.setChatItemDetails({
    reject,
  })
  // 更新视图
  updateContactMeta(userId, toUserId, {})
  if (isWs) return
  // 掉接口
  try {
    await callMessageRejectApi({
      toUserId,
      reject,
    })
  } catch (e) {
    console.log(e, 'e----------->>>')
    // 恢复mute
    chatCacheManager.setChatItemDetails({
      reject: originReject,
    })
    // 更新视图
    updateContactMeta(userId, toUserId, {})
  }
}
