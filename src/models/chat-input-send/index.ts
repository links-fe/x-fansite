import { ChatInputSendData, UserIdType } from '@/types'
import { create } from 'zustand'
import { isEmpty } from 'lodash'
import { getCurrentChatUploadState } from '../chatUploadData'
import { uploadSceneEnum } from '@/constants/upload'

/**
 * 输入框草稿数据
 */

const CHAT_INPUT_SEND_DATA_MAP = new Map<string, ChatInputSendData>()

// 获取输入框缓存数据
export function getChatInputSendCacheData(toUserId: UserIdType) {
  return CHAT_INPUT_SEND_DATA_MAP.get(`${toUserId}`)
}

export function setChatInputSendCacheData(toUserId: UserIdType, data: ChatInputSendData) {
  CHAT_INPUT_SEND_DATA_MAP.set(`${toUserId}`, data)
}

export function clearChatInputSendCacheData(toUserId: UserIdType) {
  CHAT_INPUT_SEND_DATA_MAP.delete(`${toUserId}`)
}

const DefaultChatInputSendData = (): ChatInputSendData => ({
  content: '',
  free: true,
  price: undefined,
  tipsPrice: undefined,
  showGIF: false,
  GIF: undefined,
  replyMsgData: undefined,
  showAudio: false,
})

// 输入框数据
export const useChatInputSendDataStore = create<ChatInputSendData>(() => {
  return {
    content: '',
    free: true,
    showGIF: false,
  }
})

// 初始化输入框数据
export function initChatInputSendDataStore(userId: string, toUserId: UserIdType) {
  const currentMeta = getChatInputSendCacheData(toUserId)
  if (!currentMeta) {
    setChatInputSendCacheData(toUserId, { ...DefaultChatInputSendData() })
  }
  // 初始化如果有数据，需要处理内容的展示
  if (currentMeta) {
    if (!currentMeta.price) {
      currentMeta.free = true
    }
    const mediaList = getCurrentChatUploadState({ userId: userId, subId: toUserId })
    if (mediaList?.list?.some((v) => v?.scene === uploadSceneEnum.chatVoice)) {
      currentMeta.showAudio = true
    } else {
      currentMeta.showAudio = false
    }
    currentMeta.showGIF = false
  }

  useChatInputSendDataStore.setState({
    ...DefaultChatInputSendData(),
    ...currentMeta,
  })
}

// 重置输入框数据
export function resetChatInputSendDataStore() {
  useChatInputSendDataStore.setState({ ...DefaultChatInputSendData() })
}

// 清空缓存和输入框数据
export function clearChatInputSendDataCacheStore(toUserId: UserIdType) {
  updateChatInputSendData(toUserId, {
    ...DefaultChatInputSendData(),
  })
}

// 修改输入框数据和缓存数据
export function updateChatInputSendData(toUserId: UserIdType, meta: Partial<ChatInputSendData>) {
  const currentMeta = getChatInputSendCacheData(toUserId)
  console.log('updata', { ...currentMeta }, { ...meta })
  let data
  if (!currentMeta || isEmpty(currentMeta)) {
    data = {
      ...DefaultChatInputSendData(),
      ...meta,
    }
    setChatInputSendCacheData(toUserId, data)
  } else {
    data = Object.assign(currentMeta, meta)
  }
  useChatInputSendDataStore.setState(data)
}

// 获取输入框所有数据
export function getChatInputSendStoreData() {
  return useChatInputSendDataStore.getState()
}
