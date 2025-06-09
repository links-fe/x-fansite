/** 接口的静默补偿
 * 会话列表
 */
import { TableChatListItem } from '@/types/tables/chat'
import { getOrCreateChatCacheManager, getOrCreateChatItemCacheManager } from '../cache'
import { queryChatList } from '@/services/chat'
import { refreshChatListStoreState } from '..'

const MAX_PULL_COUNT = 3
const SILENCE_PULL_INTERVAL = 10 * 1000
/** 会话列表接口的静默补偿 */
export const silencePullChatList = async (userId: string) => {
  let cursor = undefined
  let remoteHasMore = true
  const chatCacheManager = getOrCreateChatCacheManager(userId)
  const localNotServerIds = chatCacheManager.getNotServerChatListIds()
  const paging = chatCacheManager.getPagingInstance()
  const { loading, reloading, data: localServerIds, lastLoadMoreTime } = paging.getState()
  // 如果接口正在请求
  if (loading || reloading) return
  const now = Date.now()
  // 判断是否在缓存期内
  if (lastLoadMoreTime && now - lastLoadMoreTime < SILENCE_PULL_INTERVAL) return
  let remoteChatListItems: TableChatListItem[] = []
  let isConnect = false
  // 拉接口判断是否接上
  for (let index = 0; index < MAX_PULL_COUNT; index++) {
    const res = await queryChatList({
      cursor,
      limit: 10,
    })
    const lastChatItem = res?.data[res?.data?.length - 1]
    cursor = lastChatItem?.toUserId
    remoteHasMore = res?.hasMore
    remoteChatListItems = [...remoteChatListItems, ...(res?.data || [])]
    // 如果接口返回为空，且有更多数据，则继续拉取
    if (res?.data?.length === 0 && res?.hasMore) continue
    // 如果接口返回为空，且没有更多数据，则结束
    if (res?.data?.length === 0 && !res?.hasMore) break
    if (
      judgeIsConnect({
        userId,
        localServerIds,
        remoteLastItem: lastChatItem,
      })
    ) {
      isConnect = true
      break
    }
    continue
  }
  const getHasMore = () => {
    if (localServerIds.length === 0) {
      return paging.getState().hasMore
    }
    const messageItemCacheManager = getOrCreateChatItemCacheManager(userId, localServerIds[localServerIds.length - 1])
    const messageItemCache = messageItemCacheManager?.getChatItemDetails()
    if (
      remoteChatListItems &&
      remoteChatListItems.length > 0 &&
      localServerIds &&
      localServerIds.length > 0 &&
      messageItemCache &&
      remoteChatListItems[remoteChatListItems.length - 1]?.sortTime < messageItemCache?.sortTime
    ) {
      return remoteHasMore
    }
    return paging.getState().hasMore
  }
  // 合并处理
  mergeChatList({
    userId,
    localNotServerIds,
    localServerIds,
    remoteChatListItems,
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
  localServerIds: string[]
  remoteLastItem: TableChatListItem
}): boolean => {
  const { userId, localServerIds, remoteLastItem } = p
  // 遍历排序后的列表，检查remoteLastItem的sortTime是否能插入其中
  for (let i = 0; i < localServerIds.length; i++) {
    const currentItem = getOrCreateChatItemCacheManager(userId, localServerIds[i]).getChatItemDetails()
    if (!currentItem?.sortTime && currentItem?.sortTime !== 0) {
      continue
    }
    // 判断是否能插入到两条数据之间
    if (i !== 0 && remoteLastItem.sortTime >= currentItem!.sortTime) {
      return true
    }
    // 或者最后一条数据
    if (i === localServerIds.length - 1 && remoteLastItem.sortTime <= currentItem!.sortTime) {
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
export const mergeChatList = (p: {
  userId: string
  localNotServerIds: string[]
  localServerIds: string[]
  remoteChatListItems: TableChatListItem[]
  requestTime: number
  hasMore: boolean
  isConnect?: boolean
}) => {
  const MAX_COUNT = 30
  const { userId, localNotServerIds, localServerIds, remoteChatListItems, requestTime, hasMore, isConnect = true } = p
  //
  const chatCacheManager = getOrCreateChatCacheManager(userId)
  // 再合并所有的数据
  const localChatIds = [...localNotServerIds, ...localServerIds]
  const remoteChatIds = remoteChatListItems.map((item) => item.toUserId)
  const combineChatListIds = Array.from(new Set([...localChatIds, ...remoteChatIds]))
  // 定义一个最终的toUserId数组
  const finalCombineIds: TableChatListItem[] = []
  // 设置一个map， 方便remoteChatListItems取用数据
  const remoteChatListItemsMap = new Map(remoteChatListItems.map((item) => [item.toUserId, item]))
  if (isConnect) {
    // 循环合并， 看取用哪一个数据， 或者说需不需要删除， 一直循环到最多30条数据
    for (let i = 0; i < combineChatListIds.length; i++) {
      if (i > MAX_COUNT) {
        break
      }
      const cId = combineChatListIds[i]
      const localChatCache = getOrCreateChatItemCacheManager(userId, cId)
      const localChatItemCache = localChatCache.getChatItemDetails()
      // 如果两边都有。
      if (localChatItemCache && remoteChatListItemsMap.has(cId)) {
        // 取sortTime较大的
        if (localChatItemCache.sortTime > remoteChatListItemsMap.get(cId)!.sortTime) {
          // 取用本地数据
          finalCombineIds.push({
            ...localChatItemCache,
            // user信息还是取用远程的
            user: {
              ...remoteChatListItemsMap.get(cId)!.user,
            },
          })
        } else {
          // 取用远程数据
          finalCombineIds.push({
            ...remoteChatListItemsMap.get(cId)!,
          })
        }
        continue
      }
      // 如果local有， remote没有
      if (localChatItemCache && !remoteChatListItemsMap.has(cId)) {
        const lastRemoteIdIndex = combineChatListIds.findIndex(
          (item) => item === remoteChatIds[remoteChatIds.length - 1],
        )
        // 如果是在本地的后段衔接数据中
        if (i > lastRemoteIdIndex) {
          // 直接合并
          finalCombineIds.push({
            ...localChatItemCache,
          })
          continue
        }
        // 根据requestTime判断是否需要删除
        // 比请求接口的时间还早， 则需要删除
        if (localChatItemCache.sortTime <= requestTime) {
          console.warn('会话列表补偿: 删除的消息， ws没有及时推送')
          continue
        } else {
          console.warn('会话列表补偿: 服务端接口太慢了')
          // 比请求接口的时间还晚， 则需要保留
          finalCombineIds.push({
            ...localChatItemCache,
          })
        }
        continue
      }
      // 如果local没有， remote有
      if (!localChatItemCache && remoteChatListItemsMap.has(cId)) {
        console.warn('会话列表补偿: 新消息ws没有推送过来')
        finalCombineIds.push({
          ...remoteChatListItemsMap.get(cId)!,
        })
        continue
      }
      // !local没有， remote也没有, 不可能存在这种情况
      if (!localChatItemCache && !remoteChatListItemsMap.has(cId)) {
        continue
      }
    }
  }
  if (!isConnect) {
    const newCombineChatListIds = Array.from(new Set([...remoteChatIds]))
    for (let i = 0; i < newCombineChatListIds.length; i++) {
      if (i > MAX_COUNT) {
        break
      }
      const cId = newCombineChatListIds[i]
      finalCombineIds.push({
        ...remoteChatListItemsMap.get(cId)!,
      })
    }
  }
  // 先清空缓存
  chatCacheManager.deleteUserChatListCache()
  // 先按照sortTime排序
  const sortedFinalCombineIds = finalCombineIds.sort((a, b) => {
    if (a.sortTime && b.sortTime) {
      return b.sortTime - a.sortTime
    }
    return 0
  })
  // 最后全部设置为本地server数据
  chatCacheManager.setServerChatListIds(
    sortedFinalCombineIds.map((item) => {
      if (item.toUserId) {
        const chatItemCache = getOrCreateChatItemCacheManager(userId, item.toUserId)
        chatItemCache.setChatItemDetails(item)
        return item.toUserId
      }
      return ''
    }),
  )
  // 设置paging的请求时间
  chatCacheManager.getPagingInstance().setState({
    lastLoadMoreTime: requestTime,
    hasMore,
  })
  // 刷新store
  refreshChatListStoreState(userId)
}
