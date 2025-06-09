import { refreshMessageListStoreState } from '@/models/message'
import { getOrCreateMessageCacheManager } from '@/models/message/cache'
import { getMessageListShowData, setMessageListStore } from '@/models/message/messagePaging.model'
import { silencePullMessageList } from '@/models/message/utils/silencePullMessageList'
import { useEffect } from 'react'

export const useMessageListViewhooks = (p: { userId: string; toUserId: string }) => {
  const { userId, toUserId } = p
  const messageCacheManager = getOrCreateMessageCacheManager(userId, toUserId)
  const paging = messageCacheManager.getPagingInstance()

  useEffect(() => {
    // 静默补偿
    silencePullMessageList(userId, toUserId)
    return () => {
      // 重置local id 到 server id 的映射
      resetMessageLocalIdToServerId()
      // 删除过多的缓存， 最多只保留30条数据
      messageCacheManager.deleteMoreMessageCacheOnPageLeave()
    }
  }, [])

  const resetMessageLocalIdToServerId = () => {
    const showMessageIdArr = messageCacheManager.getShowMessageIdArr()
    const messageNotServerListIds = messageCacheManager.getMessageNotServerListIds()
    const messageServerListIds = messageCacheManager.getMessageServerListIds()
    const messageListIds = messageCacheManager.getMessageListIds()
    showMessageIdArr.forEach((item) => {
      // 先替换
      const index = messageListIds.findIndex((id) => id === item.value)
      if (index === -1) return
      if (index < messageNotServerListIds.length) {
        messageNotServerListIds[index] = item.key
        messageCacheManager.setMessageNotServerListIds(messageNotServerListIds)
      } else {
        messageServerListIds[index - messageNotServerListIds.length] = item.key
        messageCacheManager.setMessageServerListIds(messageServerListIds)
      }
      const details = messageCacheManager.getMessageItemDetailsCache(item.value)
      // 新增详细的缓存
      messageCacheManager.setMessageItemDetailsCache(item.key, {
        ...details,
      })
      // 删除
      messageCacheManager.deleteMessageItemDetailsCache(item.value)
      messageCacheManager.deleteMessageToTempId(item.key)
    })
  }

  const refreshStoreState = () => {
    // 只渲染当前的
    refreshMessageListStoreState(userId, toUserId)
  }

  const messageListLoadMore = async () => {
    const showData = getMessageListShowData()
    const showId = messageCacheManager.getShowMessageId(showData?.[showData.length - 1])
    const messageItem = messageCacheManager.getMessageItemDetailsCache(showId)
    paging.setState({
      queryParams: {
        toUserId,
        cursor: messageItem?.id ?? undefined,
      },
    })
    await paging.loadMore()
    refreshStoreState()
  }
  const messageListReload = async () => {
    const paging = messageCacheManager.getPagingInstance()
    setMessageListStore({
      reloading: true,
    })
    await paging.reload({
      toUserId,
      limit: 10,
      cursor: undefined,
    })
    refreshStoreState()
  }

  const messageListLoadMoreRetry = () => {
    setMessageListStore({
      isLoadMoreError: false,
    })
    messageListLoadMore()
  }

  return {
    messageListLoadMore,
    messageListReload,
    messageListLoadMoreRetry,
  }
}
