/** 接口的静默补偿
 * 消息列表
 */
import { getOrCreateMessageCacheManager } from '../cache'
import { XImChatMessageData } from '@/npm/x-im'
import { queryMessageList } from '@/services/message'
import { refreshMessageListStoreState } from '..'

const MAX_PULL_COUNT = 3
const SILENCE_PULL_INTERVAL = 10 * 1000
/** 消息列表接口的静默补偿 */
export const silencePullMessageList = async (userId: string, toUserId: string) => {
  let cursor = undefined
  let isConnect = false
  let remoteHasMore = true
  const messageCacheManager = getOrCreateMessageCacheManager(userId, toUserId)
  const localNotServerIds = messageCacheManager.getMessageNotServerListIds()
  const paging = messageCacheManager.getPagingInstance()
  const { loading, reloading, data: localServerIds, lastLoadMoreTime } = paging.getState()
  // 如果接口正在请求
  if (loading || reloading) return
  const now = Date.now()
  // 判断是否在缓存期内
  if (lastLoadMoreTime && now - lastLoadMoreTime < SILENCE_PULL_INTERVAL) return
  let remoteMessageListItems: XImChatMessageData[] = []
  // 拉接口判断是否接上
  for (let index = 0; index < MAX_PULL_COUNT; index++) {
    const res = await queryMessageList({
      toUserId,
      cursor,
      limit: 10,
    })
    const lastChatItem = res?.data[res?.data?.length - 1]
    cursor = lastChatItem?.id
    remoteHasMore = res?.hasMore
    remoteMessageListItems = [...remoteMessageListItems, ...(res?.data || [])]
    // 如果接口返回为空，且有更多数据，则继续拉取
    if (res?.data?.length === 0 && res?.hasMore) continue
    // 如果接口返回为空，且有更多数据，则结束
    if (res?.data?.length === 0 && !res?.hasMore) break
    if (
      judgeIsConnect({
        userId,
        toUserId,
        localServerIds,
        remoteLastItem: lastChatItem,
      })
    ) {
      isConnect = true
      break
    }
    continue
  }
  // 合并处理
  const getHasMore = () => {
    if (localServerIds.length === 0) {
      return paging.getState().hasMore
    }
    const messageItemCache = messageCacheManager?.getMessageItemDetailsCache(localServerIds[localServerIds.length - 1])
    if (
      remoteMessageListItems &&
      remoteMessageListItems.length > 0 &&
      localServerIds &&
      localServerIds.length > 0 &&
      messageItemCache &&
      messageItemCache?.gmtCreate &&
      remoteMessageListItems[remoteMessageListItems.length - 1]?.gmtCreate < messageItemCache?.gmtCreate
    ) {
      return remoteHasMore
    }
    return paging.getState().hasMore
  }
  mergeMessageList({
    userId,
    toUserId,
    localNotServerIds,
    localServerIds,
    remoteMessageListItems,
    requestTime: now,
    hasMore: getHasMore(),
    isConnect,
  })
}

/**
 * 判断服务端返回的数据是否能与本地服务端数据列表衔接
 * @param localServerIds 本地服务端数据列表
 * @param remoteLastItem 服务端返回的最后一条数据
 * @returns {boolean} 是否能接上
 */
export const judgeIsConnect = (p: {
  userId: string
  toUserId: string
  localServerIds: string[]
  remoteLastItem: XImChatMessageData
}): boolean => {
  const { userId, toUserId, localServerIds, remoteLastItem } = p
  const messageCacheManager = getOrCreateMessageCacheManager(userId, toUserId)
  // 遍历排序后的列表，检查remoteLastItem的sortTime是否能插入其中
  for (let i = 0; i < localServerIds.length; i++) {
    const currentItem = messageCacheManager.getMessageItemDetailsCache(localServerIds[i])
    if (!currentItem?.gmtCreate) {
      continue
    }
    // 判断是否能插入到两条数据之间
    if (i !== 0 && remoteLastItem.gmtCreate >= currentItem!.gmtCreate) {
      return true
    }
    // 或者最后一条数据
    if (i === localServerIds.length - 1 && remoteLastItem.gmtCreate <= currentItem!.gmtCreate) {
      return true
    }
  }

  return false
}

/**
 * 合并处理
 * @param userId 用户ID
 * @param remoteChatListItems 远程数据列表
 * @param localNotServerIds 本地非服务端数据列表
 * @param localServerIds 本地服务端数据列表
 * @param requestTime 开始静默请求接口的时间戳
 */
export const mergeMessageList = (p: {
  userId: string
  toUserId: string
  localNotServerIds: string[]
  localServerIds: string[]
  remoteMessageListItems: XImChatMessageData[]
  requestTime: number
  hasMore: boolean
  isConnect?: boolean
}) => {
  const MAX_COUNT = 30
  const {
    userId,
    toUserId,
    localNotServerIds,
    localServerIds,
    remoteMessageListItems,
    requestTime,
    hasMore,
    isConnect = true,
  } = p
  //
  const messageCacheManager = getOrCreateMessageCacheManager(userId, toUserId)
  // 再合并所有的数据
  const localMessageIds = [...localNotServerIds, ...localServerIds]
  const remoteMessageIds = remoteMessageListItems.map((item) => item.id)
  const combineChatListIds = Array.from(new Set([...localMessageIds, ...remoteMessageIds]))

  // 定义一个最终的toUserId数组
  const finalCombineIds: Partial<XImChatMessageData>[] = []
  // 设置一个map， 方便remoteChatListItems取用数据
  const remoteMessageListItemsMap = new Map(remoteMessageListItems.map((item) => [item.id, item]))
  if (isConnect) {
    // 循环合并， 看取用哪一个数据， 或者说需不需要删除， 一直循环到最多30条数据
    for (let i = 0; i < combineChatListIds.length; i++) {
      if (i > MAX_COUNT) {
        break
      }
      const cId = combineChatListIds[i]
      const localMessageItemCache = messageCacheManager.getMessageItemDetailsCache(cId)
      // 如果两边都有
      if (localMessageItemCache && remoteMessageListItemsMap.has(cId)) {
        // 取gmtModified较大的
        const remoteMessageItem = remoteMessageListItemsMap.get(cId)
        if (
          localMessageItemCache?.gmtModified &&
          remoteMessageItem?.gmtModified &&
          localMessageItemCache.gmtModified > remoteMessageItem?.gmtModified
        ) {
          // 取用本地数据
          finalCombineIds.push({
            ...localMessageItemCache,
          })
        } else {
          // 取用远程数据
          finalCombineIds.push({
            ...remoteMessageListItemsMap.get(cId)!,
          })
        }
        continue
      }
      // 如果local有， remote没有
      if (localMessageItemCache && !remoteMessageListItemsMap.has(cId)) {
        // 如果index大于最后一条，或者这条消息是server这边的 则需要保留
        const lastRemoteId = remoteMessageListItems[remoteMessageListItems.length - 1].id
        const lastRemoteIdIndex = combineChatListIds.findIndex((item) => item === lastRemoteId)
        if (i > lastRemoteIdIndex) {
          finalCombineIds.push({
            ...localMessageItemCache,
          })
          continue
        }
        // 如果是本地发送失败或者发送中的数据
        if (localMessageItemCache.frontendId && !localMessageItemCache.id) {
          // 直接push
          finalCombineIds.push({
            ...localMessageItemCache,
          })
          continue
        }
        // 根据requestTime判断是否需要删除
        // 比请求接口的时间还早， 则需要删除
        if (localMessageItemCache.gmtModified && localMessageItemCache.gmtModified <= requestTime) {
          console.warn('消息列表补偿: 删除消息的ws没有推送过来')
          continue
        } else {
          // 比请求接口的时间还晚， 则需要保留
          console.warn('消息列表补偿: 服务端接口太慢了')
          finalCombineIds.push({
            ...localMessageItemCache,
          })
        }
        continue
      }
      // 如果local没有， remote有
      if (!localMessageItemCache && remoteMessageListItemsMap.has(cId)) {
        console.warn('消息列表补偿: 新消息ws没有推送过来')
        finalCombineIds.push({
          ...remoteMessageListItemsMap.get(cId)!,
        })
        continue
      }
      // !local没有， remote也没有, 不可能存在这种情况
      if (!localMessageItemCache && !remoteMessageListItemsMap.has(cId)) {
        continue
      }
    }
  }
  if (!isConnect) {
    const newCombineChatListIds = Array.from(new Set([...remoteMessageIds]))
    for (let i = 0; i < newCombineChatListIds.length; i++) {
      if (i > MAX_COUNT) {
        break
      }
      finalCombineIds.push({
        ...remoteMessageListItemsMap.get(newCombineChatListIds[i])!,
      })
    }
  }
  // 先清空缓存
  messageCacheManager.deleteUserMessageCache()
  // 最后全部设置为本地server数据
  // 先按照gmtCreate排序
  const sortedFinalCombineIds = finalCombineIds.sort((a, b) => {
    if (a.gmtCreate && b.gmtCreate) {
      return b.gmtCreate - a.gmtCreate
    }
    return 0
  })
  messageCacheManager.setMessageServerListIds(
    sortedFinalCombineIds.map((item) => {
      const id = item.id || item.frontendId
      if (id) {
        messageCacheManager.setMessageItemDetailsCache(id, item)
        return id
      }
      return ''
    }),
  )
  // 设置paging的状态
  messageCacheManager.getPagingInstance().setState({
    lastLoadMoreTime: requestTime,
    hasMore,
  })
  // 刷新store
  refreshMessageListStoreState(userId, toUserId)
}
