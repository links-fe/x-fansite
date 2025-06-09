import { XImChatMessageData } from '@/npm/x-im'

// 消息发送状态
export enum MessageStatus {
  PENDING = 1, // 发送中
  SENT = 2, // 发送成功
  FAILED = 3, // 发送失败
  WITHDRAW = 4, // 撤回
  CONTAINS_PROHIBITED_WORDS = 5, // 包含敏感词
}

// 消息类型
export enum MessageType {
  TEXT = 0, // 文本
  VAULT = 1, // 素材
  GIF = 2, // gif
  TIPS = 3, // 小费
  PAID = 4, // 付费
}

export type IMessageItemMeta = XImChatMessageData
