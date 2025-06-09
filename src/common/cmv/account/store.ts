import { StoreApi, UseBoundStore } from 'zustand'
import { AccountCacheManager } from './cache'
import { getActiveAccountId } from '@/models/user'

export class AccountCacheStore<T> {
  private store: UseBoundStore<StoreApi<T>>
  private cacheManager: AccountCacheManager<T>

  constructor(store: UseBoundStore<StoreApi<T>>) {
    this.store = store
    this.cacheManager = new AccountCacheManager<T>()
  }

  private refreshState = (id: string) => {
    const cAccountId = getActiveAccountId()
    const cache = this.getCache(id)
    if (cAccountId === id) {
      this.store.setState(cache as T)
    }
  }

  private getInitState = () => {
    return this.store.getInitialState()
  }

  // 获取 state
  getState = (id: string): T => {
    const cAccountId = getActiveAccountId()
    const defaultCache = this.getCache(id)
    // 先设置默认值
    if (!defaultCache) {
      this.setCache(id, this.getInitState() || {})
    }
    if (cAccountId === id) {
      return this.store.getState()
    } else {
      return this.getCache(id) as T
    }
  }

  // 设置state
  setState = (id: string, data: Partial<T>, silence?: boolean) => {
    const silences = silence ?? false
    if (!id) return
    // 更新 缓存
    this.setCache(id, data)
    // 条件更新 state
    if (!silences) {
      this.refreshState(id)
    }
  }

  // 循环cachemap做一些事
  circulateCacheMapCallback = (callback: (id: string, data: T) => void) => {
    this.cacheManager.circulateCacheMap(callback)
  }

  // 获取缓存
  getCache = (id: string): T | undefined => {
    const defaultCache = this.cacheManager.getCache(id)
    // 先设置默认值
    if (!defaultCache) {
      this.setCache(id, this.getInitState() || {})
    }
    return this.cacheManager.getCache(id)
  }
  // 设置缓存
  setCache = (id: string, data?: Partial<T>) => {
    if (!data) {
      return
    }
    this.cacheManager.updateCache(id, data)
  }
  // 判断实例中是否存在该id
  hasCache = (id: string) => {
    return this.cacheManager.hasCache(id)
  }
  // 删除缓存
  removeCache = (id: string) => {
    this.cacheManager.removeCache(id)
  }
}
