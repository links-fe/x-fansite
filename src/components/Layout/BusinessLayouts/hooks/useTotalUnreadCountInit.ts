import { useRequest } from 'ahooks'
import { getMessageUnreadCountApi } from '@/services/chat'
import { RequestCacheEnum } from '@/types/requestCacheEnum'
import { getActiveAccountId } from '@/models/user'
import { setTotalUnreadCount } from '@/models/chat/model'

export const useTotalUnreadCountInit = () => {
  // 初始化总未读数
  useRequest(getMessageUnreadCountApi, {
    cacheKey: RequestCacheEnum.GetTotalUnreadCount,
    staleTime: 5 * 60 * 1000,
    onSuccess: (res) => {
      const accountId = getActiveAccountId()
      if (!accountId) return
      setTotalUnreadCount(accountId, res.totalUnreadCount)
    },
  })
}
