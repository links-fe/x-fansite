import { StoreApi, UseBoundStore } from 'zustand'
import { AccountCacheStore } from './account/store'
import { addGlobalAccountCache, addGlobalChatCache } from './cache'
import { v4 as uuidv4 } from 'uuid'
import { ContactCacheStore } from './account/cantact/store'

interface IViewStoreProps<S> {
  store: UseBoundStore<StoreApi<S>>
  key?: string // 名称， 方便特殊场景查找指定实例
}
/**
 * account视角下的store
 * 只需要传account id的场景
 */
export const generateAccountCacheStoreFn = <S>(p: IViewStoreProps<S>) => {
  const { store } = p
  const storeInstance = new AccountCacheStore<S>(store)
  addGlobalAccountCache({
    key: p.key ?? uuidv4(),
    instance: storeInstance,
  })

  return {
    setState: storeInstance.setState,
    getState: storeInstance.getState,
    getCache: storeInstance.getCache,
    setCache: storeInstance.setCache,
    circulateCacheMapCallback: storeInstance.circulateCacheMapCallback,
  }
}

/**
 * Fans视角下的store
 * 需要传account id和fans id的场景
 */
export const generateContactCacheStoreFn = <S>(p: IViewStoreProps<S>) => {
  const { store } = p
  const storeInstance = new ContactCacheStore<S>(store)
  addGlobalChatCache({
    key: p.key ?? uuidv4(),
    instance: storeInstance,
  })
  return {
    setState: storeInstance.setState,
    getState: storeInstance.getState,
    getCache: storeInstance.getCache,
    setCache: storeInstance.setCache,
    circulateCacheMapCallback: storeInstance.circulateCacheMapCallback,
  }
}
