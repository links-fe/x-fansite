import { XImChatMessageData } from '@/npm/x-im'
import { Paging } from '@/npm/x-utils-rc'
import { queryMessageList, QueryMessageListParams } from '@/services/message'
import { formatToMessageItemMetaData, setMessageItemMeta } from './meta'
import { handleMessageListUniqueAndSort } from '../utils'
import { mergeExistingProperties } from '@/utils'

/** 消息的完整缓存数据结构 */
interface MessageCache {
  /** 非服务端 chatIds， ws. 发送中，发送失败 */
  notServerMessageIds: string[]
  /** 发送中，发送失败 */
  localMessageIds: string[]
  /** 消息列表中所有消息的详情映射, key 为 messageId */
  messageItemDetailsMap: Map<string, Partial<XImChatMessageData>>
  /** 分页实例 */
  paging: Paging<string, QueryMessageListParams>
  /** 会话列表的请求参数 */
  messageListQueryParams?: QueryMessageListParams
  /** 会话的meta信息 */
  messageItemMetaMap: Map<string, Partial<XImChatMessageData>>
  /** 消息真实id到临时id的映射 */
  messageIdMap: Map<string, string>
  /** 最新最新一条非自己发的消息id */
  newestNotSelfMessageId: string
}

const MAX_MESSAGE_CACHE_SIZE = 30

const createDefaultMessageCache = (accountId: string, contactId: string): MessageCache => {
  return {
    notServerMessageIds: [],
    localMessageIds: [],
    messageItemDetailsMap: new Map(),
    messageItemMetaMap: new Map(),
    messageIdMap: new Map(),
    newestNotSelfMessageId: '',
    paging: new Paging<string, QueryMessageListParams>({
      service: async (params: QueryMessageListParams, option: any) => {
        const res = await queryMessageList({
          ...params,
        })
        // 排序去重
        handleMessageListUniqueAndSort(accountId, contactId, res.data)
        if (!res.hasMore) {
          option.end()
        }
      },
      serialLoadMoreLimit: 3,
    }),
  }
}
const createDefaultMessageCacheMap = (accountId: string, contactId: string): Map<string, MessageCache> => {
  const map = new Map<string, MessageCache>()
  map.set(contactId, createDefaultMessageCache(accountId, contactId))
  return map
}

/** 用户聊天缓存管理类 */
class MessageCacheManager {
  private static cacheMap: Map<string, Map<string, MessageCache>> = new Map()
  private static instanceMap: Map<string, MessageCacheManager> = new Map()
  private accountId: string
  private contactId: string

  constructor(accountId: string, contactId: string) {
    if (!accountId || !contactId) {
      throw new Error('accountId and contactId are required')
    }
    this.accountId = accountId
    this.contactId = contactId
    this.ensureUserCache()
  }

  public static getInstance(accountId: string, contactId: string): MessageCacheManager {
    const key = `${accountId}_${contactId}`
    if (!this.instanceMap.has(key)) {
      this.instanceMap.set(key, new MessageCacheManager(accountId, contactId))
    }
    return this.instanceMap.get(key)!
  }

  public static clearInstances(): void {
    this.instanceMap.clear()
    this.cacheMap.clear()
  }

  private ensureUserCache(): void {
    if (!MessageCacheManager.cacheMap.has(this.accountId)) {
      MessageCacheManager.cacheMap.set(this.accountId, createDefaultMessageCacheMap(this.accountId, this.contactId))
    } else if (!MessageCacheManager.cacheMap.get(this.accountId)?.has(this.contactId)) {
      MessageCacheManager.cacheMap
        .get(this.accountId)!
        .set(this.contactId, createDefaultMessageCache(this.accountId, this.contactId))
    }
  }

  public static getAllCache(): Map<string, Map<string, MessageCache>> {
    return MessageCacheManager.cacheMap
  }

  public static clearAll(): void {
    MessageCacheManager.cacheMap.clear()
  }

  private getCache(): MessageCache {
    return MessageCacheManager.cacheMap.get(this.accountId)!.get(this.contactId)!
  }

  public getAllMessageCache(): MessageCache {
    return this.getCache()
  }

  public getPagingInstance(): Paging<string, QueryMessageListParams> {
    return this.getCache().paging
  }

  public getMessageListIds(): string[] {
    const messageServerListIds = this.getMessageServerListIds()
    const messageNotServerListIds = this.getMessageNotServerListIds()
    return [...messageNotServerListIds, ...messageServerListIds]
  }

  public getMessageServerListIds(): string[] {
    return this.getPagingInstance().getState().data
  }

  public setMessageServerListIds(messageIds: string[]): void {
    // 先改变引用的值
    this.getCache().paging.getState().data = messageIds
    // 再改变状态
    this.getCache().paging.setState({ data: messageIds })
  }

  public getMessageNotServerListIds(): string[] {
    return this.getCache().notServerMessageIds
  }

  public setMessageNotServerListIds(messageIds: string[]): void {
    this.getCache().notServerMessageIds = messageIds
  }

  public setMessageItemDetailsCache(messageId: string, messageItemDetails: Partial<XImChatMessageData>): void {
    const originMessageItemDetails = this.getCache().messageItemDetailsMap.get(messageId) || {}
    this.getCache().messageItemDetailsMap.set(
      messageId,
      mergeExistingProperties(originMessageItemDetails, messageItemDetails),
    )
    // 设置meta信息
    setMessageItemMeta(this.accountId, this.contactId, messageId, {
      ...formatToMessageItemMetaData(messageItemDetails),
    })
  }

  public getMessageItemDetailsCache(messageId: string): Partial<XImChatMessageData> | undefined {
    return this.getCache().messageItemDetailsMap.get(messageId)
  }

  public deleteMessageItemDetailsCache(messageId: string): void {
    this.getCache().messageItemDetailsMap.delete(messageId)
    // 同时删掉meta中的
    this.getCache().messageItemMetaMap.delete(messageId)
  }

  public setMessageItemMetaCache(messageId: string, messageItemDetails: Partial<XImChatMessageData>): void {
    const origin = this.getMessageItemMetaCache(messageId) || {}
    const newMessageItemMeta = mergeExistingProperties(origin, messageItemDetails)
    this.getCache().messageItemMetaMap.set(messageId, {
      ...formatToMessageItemMetaData(newMessageItemMeta),
    })
  }

  public getMessageItemMetaCache(messageId: string): Partial<XImChatMessageData> | undefined {
    return this.getCache().messageItemMetaMap.get(messageId)
  }

  public setMessageToTempId(messageId: string, tempId: string): void {
    this.getCache().messageIdMap.set(messageId, tempId)
  }

  public getShowMessageId(messageId: string): string {
    const isExit = this.getMessageItemDetailsCache(messageId)
    if (isExit) return messageId
    const tempId = this.getCache().messageIdMap.get(messageId)
    return tempId || messageId
  }

  public getShowMessageIdArr(): { key: string; value: string }[] {
    return Array.from(this.getCache().messageIdMap.entries()).map(([key, value]) => ({ key, value }))
  }

  public deleteMessageToTempId(messageId: string): void {
    this.getCache().messageIdMap.delete(messageId)
  }

  public setNewestNotSelfMessageId(messageId: string): void {
    this.getCache().newestNotSelfMessageId = messageId
  }

  public getNewestNotSelfMessageId(): string {
    return this.getCache().newestNotSelfMessageId
  }

  /**
   * 离开messageList页面， 删除多余的缓存
   */
  public deleteMoreMessageCacheOnPageLeave() {
    const messageListIds = this.getMessageListIds()
    if (messageListIds.length <= MAX_MESSAGE_CACHE_SIZE) return
    const notServerMessageIds = this.getMessageNotServerListIds()
    const serverMessageIds = this.getMessageServerListIds()
    // 删除多余的缓存
    for (let i = MAX_MESSAGE_CACHE_SIZE; i < messageListIds.length; i++) {
      const messageId = messageListIds[i]
      const messageItemDetails = this.getMessageItemDetailsCache(messageId)
      if (i < notServerMessageIds.length) {
        notServerMessageIds.splice(i, 1)
      } else {
        serverMessageIds.splice(i - notServerMessageIds.length, 1)
      }
      // 删除details和meta的缓存
      this.deleteMessageItemDetailsCache(messageId)
      // 删除tempId的缓存
      this.deleteMessageToTempId(messageItemDetails?.id ?? messageId)
    }
  }

  public deleteUserMessageCache() {
    this.setMessageNotServerListIds([])
    this.setMessageServerListIds([])
    this.getCache().messageItemDetailsMap.clear()
    this.getCache().messageItemMetaMap.clear()
    this.getCache().messageIdMap.clear()
  }

  public clearAll(): boolean {
    const result = MessageCacheManager.cacheMap.delete(this.accountId)
    // 清除相关的实例
    for (const [key] of MessageCacheManager.instanceMap) {
      if (key.startsWith(this.accountId)) {
        MessageCacheManager.instanceMap.delete(key)
      }
    }
    return result
  }
}

/** 获取消息缓存管理器实例 */
export const getOrCreateMessageCacheManager = (accountId: string, contactId: string) => {
  return MessageCacheManager.getInstance(accountId, contactId)
}
