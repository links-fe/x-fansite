import { StoreApi, UseBoundStore } from 'zustand'
import { getActiveContactId } from '@/models/message'
import { FansCacheManager } from './cache'
import { getActiveAccountId } from '@/models/user'

export class ContactCacheStore<T> {
  private store: UseBoundStore<StoreApi<T>>
  private cacheManager: FansCacheManager<T>

  constructor(store: UseBoundStore<StoreApi<T>>) {
    this.store = store
    this.cacheManager = new FansCacheManager<T>()
  }

  private getInitState = () => {
    return this.store.getInitialState()
  }

  private refreshState = (accountId: string, contactId: string) => {
    const cAccountId = getActiveAccountId()
    const cContactId = getActiveContactId()
    if (cAccountId === accountId && cContactId === contactId) {
      const cache = this.getCache(accountId, contactId)
      this.store.setState(cache as T)
    }
  }

  // 获取 state
  getState = (accountId: string, contactId: string): T => {
    const cAccountId = getActiveAccountId()
    const cContactId = getActiveContactId()
    const defaultCache = this.cacheManager.getCache(accountId, contactId)
    // 先设置默认值
    if (!defaultCache) {
      this.setCache(accountId, contactId, this.store.getInitialState() || {})
    }
    if (accountId === cAccountId && contactId === cContactId) {
      return this.store.getState()
    }
    return this.getCache(accountId, contactId) as T
  }

  // 设置state
  setState = (accountId: string, contactId: string, data: Partial<T>, silence?: boolean) => {
    if (!accountId || !contactId) {
      console.warn(
        'ContactCacheStore-------------------->>err',
        accountId,
        contactId,
        'accountId or contactId is undefined',
      )
      // xLogger.throwException(EnumExceptionType.Error, 'ContactCacheStore-setState', {
      //   accountId,
      //   contactId,
      // })
      return
    }
    const silences = silence ?? false
    // 更新 缓存
    this.setCache(accountId, contactId, data)
    // 条件更新 state
    if (!silences) {
      this.refreshState(accountId, contactId)
    }
  }

  // 获取缓存
  getCache = (accountId: string, contactId: string): T | undefined => {
    const defaultCache = this.cacheManager.getCache(accountId, contactId)
    // 先设置默认值
    if (!defaultCache) {
      this.setCache(accountId, contactId, this.getInitState() || {})
    }
    return this.cacheManager.getCache(accountId, contactId)
  }
  // 设置缓存
  setCache = (accountId: string, contactId: string, data?: Partial<T>) => {
    if (!data) {
      return
    }
    this.cacheManager.updateCache(accountId, contactId, data)
  }

  // 循环cachemap做一些事
  circulateCacheMapCallback = (callback: (accountId: string, contactId: string, data: T) => void) => {
    this.cacheManager.circulateCacheMap(callback)
  }
  // 判断实例中是否存在该id
  hasCache = (accountId: string) => {
    return this.cacheManager.hasCache(accountId)
  }
  // 删除缓存
  removeCache = (accountId: string) => {
    this.cacheManager.removePrimaryCache(accountId)
  }
}
