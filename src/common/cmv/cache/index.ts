import { ContactCacheStore } from '../account/cantact/store'
import { AccountCacheStore } from '../account/store'

interface GlobalAccountCacheObj {
  key: string
  instance: AccountCacheStore<unknown>
}
interface GlobalChatCacheObj {
  key: string
  instance: ContactCacheStore<unknown>
}
// Account维度下的实例数组
let globalAccountCache: GlobalAccountCacheObj[] = []

// 会话维度下的实例数组
let globalChatCache: GlobalChatCacheObj[] = []

export const addGlobalAccountCache = (data: GlobalAccountCacheObj) => {
  globalAccountCache.push(data)
}

export const addGlobalChatCache = (data: GlobalChatCacheObj) => {
  globalChatCache.push(data)
}

export const getGlobalChatCache = () => {
  return globalChatCache
}

export const getGlobalChatCacheByKey = (key: string) => {
  return globalChatCache.find((instance) => instance.key === key)
}

export const getGlobalAccountCache = () => {
  return globalAccountCache
}

export const getGlobalAccountCacheByKey = (key: string) => {
  return globalAccountCache.find((instance) => instance.key === key)
}

// 还原Account维度下的缓存到store
export const restoreGlobalAccountCache = (accountId: string) => {
  globalAccountCache.forEach((instance) => {
    const cache = instance.instance.getCache(accountId)
    if (cache) {
      instance.instance.setState(accountId, cache)
    }
  })
}

// 还原chat维度下的缓存
export const restoreGlobalChatCache = (accountId: string, contactId: string) => {
  globalChatCache.forEach((instance) => {
    const cache = instance.instance.getCache(accountId, contactId)
    if (cache) {
      instance.instance.setState(accountId, contactId, cache)
    }
  })
}

// 删除Account维度下的缓存
export const removeGlobalAccountCache = (accountId: string) => {
  globalAccountCache.forEach((instance) => {
    instance.instance.removeCache(accountId)
  })
  removeGlobalChatCache(accountId)
  //   删除数组中的实例
  globalAccountCache = globalAccountCache.filter((instance) => instance.instance.hasCache(accountId))
  // 删除会话维度下的缓存
  globalChatCache = globalChatCache.filter((instance) => instance.instance.hasCache(accountId))
}

// 删除会话维度下的缓存
export const removeGlobalChatCache = (accountId: string) => {
  globalChatCache.forEach((instance) => {
    instance.instance.removeCache(accountId)
  })
}
