export class AccountCacheManager<T> {
  private cacheMap: Map<string, T>

  constructor() {
    this.cacheMap = new Map()
  }

  hasCache(id: string): boolean {
    return this.cacheMap.has(id)
  }

  // 初始化缓存
  initCache(id: string, data: T): void {
    if (!this.cacheMap.has(id)) {
      this.cacheMap.set(id, data)
    }
  }

  // 循环cachemap做一些事
  circulateCacheMap(callback: (id: string, data: any) => void): void {
    this.cacheMap.forEach((data, id) => {
      callback(id, data)
    })
  }

  // 更新缓存
  updateCache(id: string, data: Partial<T>): void {
    this.initCache(id, undefined as T)
    const cache = this.getCache(id) || {}
    this.cacheMap.set(id, Object.assign(cache, data) as T)
  }

  // 获取缓存
  getCache(id: string): T | undefined {
    this.initCache(id, undefined as T)
    return this.cacheMap.get(id)
  }

  // 获取整个Map
  getCacheMap(): Map<string, any> {
    return this.cacheMap
  }

  // 删除缓存
  removeCache(id: string): void {
    this.cacheMap.delete(id)
  }

  // 清空所有缓存
  clearCache(): void {
    this.cacheMap.clear()
  }
}
