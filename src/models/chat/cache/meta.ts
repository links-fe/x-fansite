import { IContactMeta } from '@/types/tables/chat'
import { useUpdate } from 'ahooks'
import { useEffect } from 'react'
import { Event } from '@hb-common/utils'
import { pick } from '@/utils/chat'
import { getActiveAccountId } from '@/models/user'
import { getOrCreateChatItemCacheManager } from '@/models/chat/cache'

export function createDefaultContactMeta(): Partial<IContactMeta> {
  return {}
}

const CONTACT_META_EVENT = new Event<'update'>()

/** 联系人扩展信息 (变换频率较高) */
export function useContactMeta(contactId: string): Partial<IContactMeta> {
  const update = useUpdate()

  useEffect(() => {
    const eventKey = Symbol()
    CONTACT_META_EVENT.on(eventKey, 'update', (id) => {
      if (!id || id !== contactId) return
      update()
    })
    return () => {
      CONTACT_META_EVENT.off(eventKey, 'update')
    }
  }, [update, contactId])

  const accountId = getActiveAccountId()!
  const chatCacheManager = getOrCreateChatItemCacheManager(accountId, contactId)
  const meta = chatCacheManager.getChatMetaInfo()
  return {
    ...meta,
  }
}
/** 只设置，不更新视图 */
export function setContactMeta(accountId: string, contactId: string, meta: Partial<IContactMeta>) {
  const chatCacheManager = getOrCreateChatItemCacheManager(accountId, contactId)
  chatCacheManager.setChatMetaInfo(meta)
}
/** 设置并更新视图 */
export function updateContactMeta(accountId: string, contactId: string, meta: Partial<IContactMeta>) {
  setContactMeta(accountId, contactId, meta)
  //   不在当前选中模特， 不触发视图渲染
  if (accountId !== getActiveAccountId()) return
  CONTACT_META_EVENT.emit('update', contactId)
}

export const formatToContactMetaData = (data: Partial<IContactMeta>): Partial<IContactMeta> => {
  return pick(data, [
    'reject',
    'mute',
    'unreadCount',
    'sortTime',
    'lastMsgType',
    'lastMsg',
    'user',
  ]) as Partial<IContactMeta>
}
