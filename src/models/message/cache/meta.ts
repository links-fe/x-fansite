import { useUpdate } from 'ahooks'
import { useEffect } from 'react'
import { Event } from '@hb-common/utils'
import { pick } from '@/utils/chat'
import { getActiveAccountId } from '@/models/user'
import { XImChatMessageData } from '@/npm/x-im'
import { getActiveContactId } from '../index'
import { getOrCreateMessageCacheManager } from '.'

export function createDefaultMessageItemMeta(): Partial<XImChatMessageData> {
  return {}
}

const MESSAGE_ITEM_META_EVENT = new Event<'update'>()

/** 消息列表Item扩展信息 (变换频率较高) */
export function useMessageItemMeta(messageId: string): Partial<XImChatMessageData> {
  const update = useUpdate()

  useEffect(() => {
    const eventKey = Symbol()
    MESSAGE_ITEM_META_EVENT.on(eventKey, 'update', (id) => {
      if (!id || id !== messageId) return
      update()
    })
    return () => {
      MESSAGE_ITEM_META_EVENT.off(eventKey, 'update')
    }
  }, [update, messageId])

  const accountId = getActiveAccountId()!
  const contactId = getActiveContactId()!
  const messageCacheManager = getOrCreateMessageCacheManager(accountId, contactId)
  const meta = messageCacheManager.getMessageItemMetaCache(messageId)
  return {
    ...meta,
  }
}
/** 只设置，不更新视图 */
export function setMessageItemMeta(
  accountId: string,
  contactId: string,
  messageId: string,
  meta: Partial<XImChatMessageData>,
) {
  const messageCacheManager = getOrCreateMessageCacheManager(accountId, contactId)
  const currentMeta = messageCacheManager.getMessageItemMetaCache(messageId)
  if (!currentMeta) {
    messageCacheManager.setMessageItemMetaCache(messageId, meta)
  } else {
    Object.assign(currentMeta, meta)
    messageCacheManager.setMessageItemMetaCache(messageId, currentMeta)
  }
}
/** 设置并更新视图 */
export function updateMessageItemMeta(
  accountId: string,
  contactId: string,
  messageId: string,
  meta: Partial<XImChatMessageData>,
) {
  setMessageItemMeta(accountId, contactId, messageId, meta)
  //   不是当前选中模特， 不触发视图渲染
  if (accountId !== getActiveAccountId() || contactId !== getActiveContactId()) return
  MESSAGE_ITEM_META_EVENT.emit('update', messageId)
}

export const formatToMessageItemMetaData = (data: Partial<XImChatMessageData>): Partial<XImChatMessageData> => {
  return pick(data, [
    'content',
    'fromId',
    'gmtCreate',
    'gmtModified',
    'id',
    'free',
    'price',
    'mediaList',
    'msgType',
    'previewIdList',
    'sendStatus',
    'toId',
    'unlock',
    'frontendId',
    'replyMessage',
    'gifUrl',
  ]) as Partial<XImChatMessageData>
}
