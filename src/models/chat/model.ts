import { generateAccountCacheStoreFn } from '@/common/cmv'
import { create } from 'zustand'

interface IChatModel {
  totalUnreadCount: number
  updateTime: number
}

const useChatModel = create<IChatModel>(() => ({
  totalUnreadCount: 0,
  updateTime: 0,
}))

const chatStore = generateAccountCacheStoreFn({
  store: useChatModel,
})

export const setTotalUnreadCount = (accountId: string, count: number) => {
  chatStore.setState(accountId, {
    totalUnreadCount: count,
  })
}

export const getTotalUnreadCount = (accountId: string) => {
  return chatStore.getState(accountId)?.totalUnreadCount || 0
}

export const setTotalUnreadCountUpdateTime = (accountId: string, updateTime: number) => {
  chatStore.setState(accountId, {
    updateTime,
  })
}

export const getTotalUnreadCountUpdateTime = (accountId: string) => {
  return chatStore.getState(accountId)?.updateTime || 0
}

export const useChatModels = () => {
  return useChatModel()
}
