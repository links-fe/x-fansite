import { XImChatMessageData, XImMessageMediaType } from '@/npm/x-im'
import { MessageType } from './tables/message'

/** 语音数据 */
export interface AudioItem {
  // 上传进度
  upLoadProgress?: number
  uploadKey?: string
  // 播放地址
  url: string
  duration: number
  // 是否上传失败
  isError?: boolean
  // 是否上传完成
  isFinish?: boolean
}

/** 输入框相关数据 */
export interface ChatInputSendData {
  content: string
  showAudio?: boolean
  free?: boolean
  // ppv价格
  price?: number
  // 打赏价格
  tipsPrice?: number
  showGIF?: boolean
  // gif数据 TODO 格式待定
  GIF?: string
  // 引用消息数据
  replyMsgData?: Partial<XImChatMessageData>
}

/** 发送消息接口参数 */
export interface ChatInputSendServerData {
  content: string
  mediaList?: XImMessageMediaType[]
  free?: boolean
  msgType?: MessageType
  // ppv价格
  price?: number
  // 打赏价格
  tipsPrice?: number
  // gif数据
  gifId?: string
  // 转发消息id (MVP没有)
  sourceMsgId?: string
  // 引用消息id
  replyMsgId?: string

  toUserId: string
  frontendId?: string
}
