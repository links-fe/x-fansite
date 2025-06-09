import { Paging } from '@/npm/x-utils-rc'
import { queryChatList, QueryChatListParams } from '@/services/chat'
import { IContactMeta, TableChatListItem } from '@/types/tables/chat'
import { formatToContactMetaData, setContactMeta } from './meta'
import { mergeExistingProperties } from '@/utils'
import { handleChatListDataUniqueAndSort } from '../utils'

/** 会话的完整缓存数据结构 */
interface ChatCache {
  /** 非服务端 contactIds， ws推送 */
  notServerContactIds: string[]
  /** 虚拟列表数据 */
  virtualContactIds: string[]
  /** 会话中所有消息的详情映射, key 为 toUserId */
  chatItemDetailsMap: Map<string, TableChatListItem>
  /** 分页实例 */
  paging: Paging<string, QueryChatListParams>
  /** 会话列表的请求参数 */
  chatListQueryParams?: QueryChatListParams
  /** 会话的meta信息 */
  chatMetaMap: Map<string, Partial<IContactMeta>>
  /** 会话的在线状态更新时间 */
  chatOnlineStatusUpdateTimeMap: Map<string, number>
  /** 页面的滚动位置 */
  scrollTop: number
}

const createDefaultChatCache = (userId: string): ChatCache => {
  return {
    notServerContactIds: [],
    virtualContactIds: [],
    chatItemDetailsMap: new Map(),
    chatMetaMap: new Map(),
    chatOnlineStatusUpdateTimeMap: new Map(),
    scrollTop: 0,
    paging: new Paging<string, QueryChatListParams>({
      service: async (params: QueryChatListParams, option: any) => {
        const res = await queryChatList({ ...params })
        handleChatListDataUniqueAndSort(userId, res.data)
        if (!res.hasMore) {
          option.end()
        }
      },
      queryParams: {
        limit: 10,
      },
      serialLoadMoreLimit: 3,
    }),
  }
}

/** 用户聊天缓存管理类 */
class ChatCacheManager {
  private static cacheMap: Map<string, ChatCache> = new Map()
  private static instanceMap: Map<string, ChatCacheManager> = new Map()
  private accountId: string
  private contactId?: string

  private constructor(accountId: string, contactId?: string) {
    this.accountId = accountId
    this.contactId = contactId
    this.ensureUserCache()
  }

  public static getInstance(userId: string, toUserId?: string): ChatCacheManager {
    const key = toUserId ? `${userId}_${toUserId}` : userId
    if (!this.instanceMap.has(key)) {
      this.instanceMap.set(key, new ChatCacheManager(userId, toUserId))
    }
    return this.instanceMap.get(key)!
  }

  public static clearInstances(): void {
    this.instanceMap.clear()
    this.cacheMap.clear()
  }

  private ensureUserCache(): void {
    if (!ChatCacheManager.cacheMap.has(this.accountId)) {
      ChatCacheManager.cacheMap.set(this.accountId, createDefaultChatCache(this.accountId))
    }
  }

  public static getAllCache(): Map<string, ChatCache> {
    return ChatCacheManager.cacheMap
  }

  private requireContactId(): void {
    if (!this.contactId) throw new Error('contactId is required')
  }

  private getCache(): ChatCache {
    return ChatCacheManager.cacheMap.get(this.accountId)!
  }

  public getAllChatCache(): ChatCache {
    return this.getCache()
  }

  public getChatMetaInfo(): Partial<IContactMeta> {
    this.requireContactId()
    return this.getCache().chatMetaMap.get(this.contactId!) || {}
  }

  public setChatMetaInfo(meta: Partial<IContactMeta>): void {
    this.requireContactId()
    const cache = this.getCache()
    const originItem = this.getChatItemDetails() || ({} as TableChatListItem)
    cache.chatItemDetailsMap.set(this.contactId!, mergeExistingProperties(originItem, meta))
    cache.chatMetaMap.set(this.contactId!, mergeExistingProperties(this.getChatMetaInfo(), meta))
  }

  public setChatItemDetails(item: Partial<TableChatListItem>): void {
    this.requireContactId()
    const cache = this.getCache()
    const originItem = this.getChatItemDetails() || ({} as TableChatListItem)
    cache.chatItemDetailsMap.set(this.contactId!, mergeExistingProperties(originItem, item))
    setContactMeta(this.accountId, this.contactId!, {
      ...formatToContactMetaData(item),
    })
  }

  public getChatItemDetails(): TableChatListItem | undefined {
    this.requireContactId()
    return this.getCache().chatItemDetailsMap.get(this.contactId!)
  }

  public getPagingInstance(): Paging<string, QueryChatListParams> {
    return this.getCache().paging
  }

  public getChatListIds(): string[] {
    const cache = this.getCache()
    const serverIds = cache.paging.getState().data || []
    return [...cache.notServerContactIds, ...serverIds]
  }

  public setServerChatListIds(ids: string[]): void {
    const cache = this.getCache()
    // 先改变引用的值
    cache.paging.getState().data = ids
    // 再改变状态
    cache.paging.setState({ data: ids })
  }

  public getServerChatListIds(): string[] {
    const cache = this.getCache()
    return cache.paging.getState().data || []
  }

  public setNotServerChatListIds(ids: string[]): void {
    const cache = this.getCache()
    cache.notServerContactIds = ids
  }

  public getNotServerChatListIds(): string[] {
    const cache = this.getCache()
    return cache.notServerContactIds
  }

  public setChatOnlineStatusUpdateTime(time: number): void {
    this.requireContactId()
    const cache = this.getCache()
    cache.chatOnlineStatusUpdateTimeMap.set(this.contactId!, time)
  }

  public getChatOnlineStatusUpdateTime(): number | undefined {
    this.requireContactId()
    return this.getCache().chatOnlineStatusUpdateTimeMap.get(this.contactId!)
  }

  public setScrollTop(scrollTop: number): void {
    const cache = this.getCache()
    cache.scrollTop = scrollTop
  }

  public getScrollTop(): number {
    return this.getCache().scrollTop
  }

  /**清除当前会话的所有缓存 */
  public deleteUserChatListCache() {
    this.getCache().chatItemDetailsMap.clear()
    this.getCache().chatMetaMap.clear()
    this.getCache().chatOnlineStatusUpdateTimeMap.clear()
    this.getCache().notServerContactIds = []
  }

  /**清除当前登录用户的所有缓存 */
  public clearAll(): boolean {
    const result = ChatCacheManager.cacheMap.delete(this.accountId)
    // 清除相关的实例
    for (const [key] of ChatCacheManager.instanceMap) {
      if (key.startsWith(this.accountId)) {
        ChatCacheManager.instanceMap.delete(key)
      }
    }
    return result
  }
}

// 导出两个工厂函数
/** 获取聊天列表缓存管理器 */
export const getOrCreateChatCacheManager = (userId: string) => {
  return ChatCacheManager.getInstance(userId)
}

/** 获取聊天列表Item的缓存管理器 */
export const getOrCreateChatItemCacheManager = (userId: string, toUserId: string) => {
  return ChatCacheManager.getInstance(userId, toUserId)
}
