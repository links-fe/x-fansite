import { sendMessage } from '@/models/message'
import {
  clearChatInputSendDataCacheStore,
  getChatInputSendStoreData,
  updateChatInputSendData,
  useChatInputSendDataStore,
} from '@/models/chat-input-send'
import { MessageType } from '@/types/tables/message'
import { delay } from '@hb-common/utils'
import {
  checkCurrentChatNotHasUploaded,
  clearChatUploadAll,
  useCurrentChatSessionUploadAllList,
} from '@/models/chatUploadData'
import { useContactMeta } from '@/models/chat/cache/meta'
import { audioTypes, imageTypes, videoTypes } from '@/constants/upload'

interface Iprops {
  userId: string
  toUserId: string
  chatListRef: React.RefObject<HTMLDivElement | null>
}
export const useMessageInputViewHooks = (props: Iprops) => {
  const { userId, toUserId, chatListRef } = props
  const content = useChatInputSendDataStore((state) => state.content)
  const price = useChatInputSendDataStore((state) => state.price)
  const mediaList = useCurrentChatSessionUploadAllList()
  const contactMeta = useContactMeta(toUserId)
  // const replyMsgData = useChatInputSendDataStore((state) => state.replyMsgData)

  const sendDisabled = () => {
    const hasUnFinish = checkCurrentChatNotHasUploaded({ userId, subId: toUserId })
    if (contactMeta?.reject) return true
    if (price && price > 0) {
      // TODO 设置了价格 需要判断素材库素材
      if (mediaList?.length > 0) {
        return hasUnFinish
      }
      return true
    } else if (mediaList && mediaList.length > 0) {
      // 有素材 或者 有音频
      console.log('mediaList', [...mediaList], mediaList[0].isFinish, hasUnFinish)
      // 存在未上传完成的素材
      return hasUnFinish
    } else if (content?.trim()?.length > 0 && content?.trim()?.length <= 1000) {
      // 文本符合要求
      return false
    }
    // }
    return true
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return
      } else {
        e.preventDefault()
        handleSendMessage()
      }
    }
  }

  // 识别素材类型
  const handleFileChange = (type: string): 'video' | 'audio' | 'photo' => {
    console.log('handleFileChange', type)
    // 如果是图片类型则转化为image
    if (imageTypes.includes(`.${type.toLocaleLowerCase()}`)) {
      return 'photo'
    }
    if (videoTypes.includes(`.${type.toLocaleLowerCase()}`)) {
      return 'video'
    }
    if (audioTypes.includes(`.${type.toLocaleLowerCase()}`)) {
      return 'audio'
    }
    return 'photo'
  }

  // 发送消息
  const handleSendMessage = async () => {
    console.log('send----mediaList', mediaList)
    if (sendDisabled()) return
    // 所有输入框数据(除了本地上传的)
    const state = getChatInputSendStoreData()
    let msgType = MessageType.TEXT
    if (mediaList?.length) {
      msgType = MessageType.VAULT
    }
    // 发送消息并获取临时ID
    sendMessage({
      content: state.content,
      msgType: msgType,
      replyMsgId: state.replyMsgData?.id,
      replyMessage: state.replyMsgData || undefined,
      free: state.price ? state.free : undefined,
      price: state.price,
      mediaList: mediaList?.map((v) => {
        const mediaType = handleFileChange(v.fileType)
        return {
          type: mediaType,
          fileKey: v.fileKey || '',
          status: 'pending',
          thumbMidUrl: ['video'].includes(mediaType) ? v.thumbnailUrl : v.fileUrl,
          duration: v.duration,
          id: v.key,
          src: v.fileUrl,
          avUrl: mediaType === 'audio' ? v.fileUrl : undefined,
        }
      }),
    })
    if (chatListRef.current) {
      await delay(10)
      chatListRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }

    // 清空输入框
    clearChatInputSendDataCacheStore(toUserId)
    clearChatUploadAll({
      userId: userId,
      subId: toUserId,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateChatInputSendData(toUserId, {
      content: e.target.value,
    })
  }

  return {
    inputText: content,
    handleKeyDown,
    handleSendMessage,
    handleInputChange,
    sendDisabled,
  }
}
