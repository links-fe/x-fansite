export class FansCacheManager<T> {
  private cacheMap: Map<string, Map<string, T>>

  constructor() {
    this.cacheMap = new Map()
  }

  hasCache(accountId: string): boolean {
    return this.cacheMap.has(accountId)
  }

  // 获取或创建子缓存Map
  private getSubCache(accountId: string): Map<string, T> {
    if (!this.cacheMap.has(accountId)) {
      this.cacheMap.set(accountId, new Map())
    }
    return this.cacheMap.get(accountId)!
  }

  // 初始化缓存
  initCache(accountId: string, contactId: string, data: T): void {
    const subCache = this.getSubCache(accountId)
    if (!subCache.has(contactId)) {
      subCache.set(contactId, data)
    }
  }

  // 更新缓存
  updateCache(accountId: string, contactId: string, data: Partial<T>): void {
    this.initCache(accountId, contactId, undefined as T)
    const subCache = this.getSubCache(accountId)
    const cache = this.getCache(accountId, contactId) || {}
    subCache.set(contactId, Object.assign(cache, data) as T)
  }

  // 获取缓存
  getCache(accountId: string, contactId: string): T | undefined {
    this.initCache(accountId, contactId, undefined as T)
    const subCache = this.cacheMap.get(accountId)
    return subCache?.get(contactId)
  }

  // 循环cachemap做一些事
  circulateCacheMap(callback: (accountId: string, contactId: string, data: any) => void): void {
    this.cacheMap.forEach((subCache, accountId) => {
      subCache.forEach((data, contactId) => {
        callback(accountId, contactId, data)
      })
    })
  }

  // 删除指定的二级缓存
  removeCache(accountId: string, contactId: string): void {
    const subCache = this.cacheMap.get(accountId)
    subCache?.delete(contactId)
  }

  // 删除主ID下的所有缓存
  removePrimaryCache(accountId: string): void {
    this.cacheMap.delete(accountId)
  }

  // 清空所有缓存
  clearCache(): void {
    this.cacheMap.clear()
  }
}
