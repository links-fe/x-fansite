import { create } from 'zustand'
import { generateContactCacheStoreFn } from '@/common/cmv/index'
import { uploadSceneEnum } from '@/constants/upload'
import { UploadFileData } from '@/common/multipartUploader/upload'
interface ChatUploadViewStore {
  list: UploadFileData[]
  finalTime: number | null
}
const initChatUploadStore = () => ({
  list: [],
  finalTime: null,
})
const store = create<ChatUploadViewStore>(() => initChatUploadStore())
const chatUploadStore = generateContactCacheStoreFn({
  store,
})

export const useCurrentChatUploadState = () => {
  return store((state) => state)
}

// 当前会话聊天工具(图片和视频)文件列表
export const useCurrentChatToolUploadList = () => {
  return useCurrentChatUploadState()?.list?.filter?.((item) => item?.scene === uploadSceneEnum.chatTool) ?? []
}

// 聊天录音文件列表
export const useCurrentChatVoiceUploadList = () => {
  return useCurrentChatUploadState()?.list?.filter?.((item) => item?.scene === uploadSceneEnum.chatVoice) ?? []
}

// 当前聊天会话的某条消息的举报文件
export const useCurrentChatReportUploadList = ({ messageId }: { messageId: string | number }) => {
  return (
    useCurrentChatUploadState()?.list?.filter?.(
      (item) => item?.scene === uploadSceneEnum.chatReport && item?.messageId === messageId,
    ) ?? []
  )
}

// 获取当前会话所有上传的文件列表（不包含聊天举报的）
export const useCurrentChatSessionUploadAllList = () => {
  return useCurrentChatUploadState()?.list?.filter?.(
    (item) => item?.scene && [uploadSceneEnum.chatTool, uploadSceneEnum.chatVoice].includes(item?.scene),
  )
}

// 设置聊天上传列表（拖拽排序时用到）
export const setCurrentChatUploadList = ({
  userId,
  subId,
  list,
}: {
  userId: string
  subId: string
  list: UploadFileData[]
}) => {
  chatUploadStore.setState(userId, subId, { list })
}

// 检查当前聊天会话是否有未上传完成的文件（不包含聊天举报的）
export const checkCurrentChatNotHasUploaded = ({ userId, subId }: { userId: string; subId: string }) => {
  const list = getCurrentChatUploadList({ userId, subId })
  return list?.filter?.((item) => item?.scene !== uploadSceneEnum.chatReport && !item?.isFinish)?.length > 0
}

export const getCurrentChatUploadState = ({ userId, subId }: { userId: string; subId: string }) => {
  return chatUploadStore.getState(userId, subId)
}

export const getCurrentChatUploadCache = ({
  userId,
  subId,
}: {
  userId: string
  subId: string
}): ChatUploadViewStore => {
  const obj = chatUploadStore.getCache(userId, subId)
  if (obj) {
    if (!obj.hasOwnProperty('finalTime')) {
      obj.finalTime = null
    }
    if (!obj.hasOwnProperty('list')) {
      obj.list = []
    }
    return obj as ChatUploadViewStore
  }

  return initChatUploadStore()
}

export const getCurrentChatUploadList = ({ userId, subId }: { userId: string; subId: string }) => {
  return getCurrentChatUploadCache({ userId, subId })?.list || []
}
export const getCurrentChatUploadItemFileData = ({
  userId,
  subId,
  key,
}: {
  userId: string
  subId: string
  key: string
}) => {
  return getCurrentChatUploadList({ userId, subId })?.find?.((item) => item.key === key) ?? null
}

export const addCurrentChatUploadData = ({
  userId,
  subId,
  data,
}: {
  userId: string
  subId: string
  data: UploadFileData
}) => {
  const obj = getCurrentChatUploadCache({ userId, subId })
  obj.list.push(data)
  chatUploadStore.setState(userId, subId, obj)
}

export const removeCurrentChatUploadData = ({ userId, subId, key }: { userId: string; subId: string; key: string }) => {
  const obj = getCurrentChatUploadCache({ userId, subId })
  const list = obj.list
  const index = list?.findIndex?.((item) => item.key === key)
  if (index !== -1) {
    list.splice(index, 1)
  }
  chatUploadStore.setState(userId, subId, obj)
}

export const setCurrentChatUploadItemFileData = ({
  userId,
  subId,
  key,
  data,
}: {
  userId: string
  subId: string
  key: string
  data: any
}) => {
  const obj = getCurrentChatUploadCache({ userId, subId })
  const list = obj.list
  const result = list?.find?.((item) => item.key === key) ?? null
  if (result) {
    Object.assign(result, data)
  }
  chatUploadStore.setState(userId, subId, obj)
}

export const setCurrentChatFinalTime = ({
  userId,
  subId,
  finalTime,
}: {
  userId: string
  subId: string
  finalTime: number | null
}) => {
  if (!userId || !subId) {
    return
  }
  const obj = getCurrentChatUploadCache({ userId, subId })
  obj.finalTime = finalTime
  chatUploadStore.setCache(userId, subId, obj)
}

export const clearChatItemUploadNoFinishCache = ({ userId, subId }: { userId: string; subId: string }) => {
  if (!userId || !subId) {
    return
  }
  const obj = getCurrentChatUploadCache({ userId, subId })
  obj.list = obj.list?.filter?.((item) => item.isFinish) || []
  chatUploadStore.setCache(userId, subId, obj)
}

// 初始化上传素材
export const clearChatUploadAll = ({ userId, subId }: { userId: string; subId: string }) => {
  chatUploadStore.setState(userId, subId, initChatUploadStore())
}

// 最后停留在聊天会话的时间（进入和离开时，都更新为当前时间） 可能要跑个定时器定时check下有没有上传完但没发送的文件，超过2个小时把它丢弃掉
const maxTime = 1000 * 60 * 60 * 2
setInterval(() => {
  chatUploadStore?.circulateCacheMapCallback?.((userId, subid, data) => {
    if (!data?.finalTime) return
    const now = Date.now()
    const diff = now - data?.finalTime
    if (diff > maxTime) {
      chatUploadStore?.setCache(userId, subid, initChatUploadStore())
    }
  })
}, maxTime)
