import { getActiveAccountId } from '@/models/user'
import { useEffect, useState } from 'react'
import { useContactMeta } from '../cache/meta'
import { getOrCreateChatItemCacheManager } from '../cache'

const CACHE_TIME = 1000 * 60 * 3 // 3分钟
export const useOnlineStatus = (contactId: string) => {
  const accountId = getActiveAccountId()!
  const contactMeta = useContactMeta(contactId)
  const chatCacheManager = getOrCreateChatItemCacheManager(accountId, contactId)
  const chatItem = chatCacheManager.getChatItemDetails()
  const [onlineStatus, setOnlineStatus] = useState<boolean>(chatItem?.user?.online || false)

  const refreshOnlineStatus = async () => {
    // 判断是否存在cache time
    const newestUpdateTime = chatCacheManager.getChatOnlineStatusUpdateTime()
    if (!newestUpdateTime) {
      chatCacheManager.setChatOnlineStatusUpdateTime(Date.now())
      setOnlineStatus(chatItem?.user?.online || false)
      return
    }
    // 判断是否过期, 如果过期了，则重新获取
    if (Date.now() - newestUpdateTime > CACHE_TIME) {
      chatCacheManager.setChatOnlineStatusUpdateTime(Date.now())
      // 暂时不掉接口检查
      // const res = await getChatInfoByUserIdApi(toUserId)
      // chatCacheManager.setChatItemDetails(userId, toUserId, {
      //   ...chatItem,
      //   user: res.user,
      // })
      setOnlineStatus(chatItem?.user?.online || false)
      return
    }
    // 判断是否过期, 如果没有过期，则直接返回
    if (Date.now() - newestUpdateTime <= CACHE_TIME) {
      const onlineStatus = chatItem?.user?.online || false
      setOnlineStatus(onlineStatus)
      return
    }
    // 如果过期了，则重新获取
  }

  useEffect(() => {
    refreshOnlineStatus()
    return () => {}
  }, [contactMeta])

  return {
    onlineStatus,
  }
}
