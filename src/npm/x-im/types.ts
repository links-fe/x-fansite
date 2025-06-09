import { MessageStatus, MessageType } from '@/types/tables/message'

export enum XImMessageType {
  /** 聊天相关 *************************************** */
  /** 聊天消息 */
  Chat = 1,
  /** 超长文本 */
  LongText = 2,
  /** 消息已发送 */
  MessageSend = 3,
  /** 消息已读 */
  MessageRead = 4,
  /** 消息撤回 */
  MessageWithdraw = 5,
  /** 消息已付费 */
  MessagePay = 6,
  /** 未读消息数 */
  unreadMessage = 7,
  /** 会话mute */
  ChatMute = 8,
  /** 消息拒绝 */
  MessageReject = 9,
  /** 会话未读 */
  ChatUnread = 10,
  /** 消息删除 */
  MessageDelete = 11,
  /** 素材转码状态变更通知 */
  VaultStatusChange = 12,
  /** -------------------------------------------------- */
  /** 粉丝输入中 */
  Typing = 110,
  /** 群发消息更新 */
  QueueUpdate = 111,
  /** 群发消息完成 */
  QueueFinish = 112,
  /** 粉丝给消息点赞 */
  LikeMessage = 127,
  /** 粉丝取消点赞 */
  UnLikeMessage = 128,
  /** 消息更新 */
  ChatMessageUpdate = 129,
  /** -------------------------------------------------- */

  /** 通知消息 */
  // Notice = 2,

  /** 上线 */
  // UserOnline = 4,
  /** 在线状态 */
  // UserOnlineStatus = 5,

  /** 通知的未读数 */
  NotificationUnread = 13,
  /** 拉黑我 */
  BlockMe = 14,
  /** 解除拉黑我 */
  UnblockMe = 15,

  /** 敏感词变化*/
  SensitiveUpdate = 18,
}

interface XImMessageCommon {
  /** 后端生成的发送id */
  id: string
  type: XImMessageType
  data?: unknown
  /** 排序时间戳 */
  sortTime: number

  /** 未读消息数 */
  unreadCount: {
    toUserId: string
    totalUnreadCount: number
    unreadCount: number
    updateTime: number
    userId: string
  }
}

// 素材信息对象
export interface XImMessageMediaType {
  duration?: number
  id: string
  // pending,processing,completed,failed video ext status: processing_transcoding、processing_drm
  status: 'completed' | 'processing' | 'pending' | 'processing_transcoding' | 'processing_drm' | 'failed'
  likesCount?: number // 点赞数
  thumbUrl?: string
  thumbWidth?: number
  thumbHeight?: number
  thumbMidUrl?: string
  thumbMidWidth?: number
  thumbMidHeight?: number
  thumbLargeUrl?: string
  thumbLargeWidth?: number
  thumbLargeHeight?: number
  avPreviewUrl?: string // 视频预览图url
  avUrl?: string // 音频的播放地址  后端处理付费前的3秒
  type: 'video' | 'audio' | 'photo'
  fileKey?: string
  src?: string // 获取的播放地址 本地拼接
}

export interface XImChatMessageData {
  id: string
  frontendId: string
  chatId: string
  fromId: string
  toId: string
  toUserId: string
  msgType: MessageType // 0：文本消息、 1：图片消息、2：语音消息 、3：视频消息 4、gif消息 5、tips消息
  content: string // 消息文本内容
  queueId?: number
  sendStatus: MessageStatus
  read?: boolean
  auditsStatus?: number
  mediaList?: XImMessageMediaType[] // 消息素材信息对象
  previewIdList?: Array<unknown> // 可查询素材信息列表
  gifId?: string
  gifUrl?: string
  free: boolean
  price?: number
  unlock?: boolean // true是解锁了，false是未解锁
  sourceMsgId?: string
  replyMessage?: Partial<XImChatMessageData>
  replyMsgId?: string
  gmtCreate: number
  gmtModified?: number
  gmtDeleted?: number
  isLocalSend?: boolean
}

/** 聊天消息 */
export interface XImChatMessage extends XImMessageCommon {
  type: XImMessageType.Chat
  data: XImChatMessageData
  /** 聊天历史记录消息id */
  msgId: string
  frontendId: string
}

export interface XImMessagePay extends XImMessageCommon {
  type: XImMessageType.MessagePay
  data: XImChatMessageData
  /** 聊天历史记录消息id */
  msgId: string
  frontendId: string
}

export interface XImChatUnreadMessage extends XImMessageCommon {
  type: XImMessageType.ChatUnread
  data: {
    userId: string
    toUserId: string
  }
}

export interface XImChatMuteMessage extends XImMessageCommon {
  type: XImMessageType.ChatMute
  data: {
    userId: string
    toUserId: string
    mute: boolean
  }
}

export interface XImMessageRejectMessage extends XImMessageCommon {
  type: XImMessageType.MessageReject
  data: {
    userId: string
    toUserId: string
    reject: boolean
  }
}

export interface XImVaultStatusChangeMessage extends XImMessageCommon {
  type: XImMessageType.VaultStatusChange
  data: XImChatMessageData
  msgId: string
  frontendId: string
}

export interface XImWithdrawMessage extends XImMessageCommon {
  type: XImMessageType.MessageWithdraw
  data: {
    /** 消息id */
    msgId: string
    userId: string
    toUserId: string
  }
}

export interface XImDeleteMessage extends XImMessageCommon {
  type: XImMessageType.MessageDelete
  data: {
    userId: string
    toUserId: string
    msgId: string
  }
}
export interface XImTypingMessage extends XImMessageCommon {
  type: XImMessageType.Typing
  data: {
    userId: number
  }
}

export interface XImQueueUpdateMessage extends XImMessageCommon {
  type: XImMessageType.QueueUpdate
  data: {
    queueId: number
  }
}

export interface XImQueueFinishMessage extends XImMessageCommon {
  type: XImMessageType.QueueFinish
  data: {
    queueId: number
  }
}

export interface XImLikeMessage extends XImMessageCommon {
  type: XImMessageType.LikeMessage
  data: {
    userId: number
    msgId: string
  }
}

export interface XImUnLikeMessage extends XImMessageCommon {
  type: XImMessageType.UnLikeMessage
  data: {
    userId: number
    msgId: string
  }
}

export interface XImChatMessageUpdate extends XImMessageCommon {
  type: XImMessageType.ChatMessageUpdate
  data: XImChatMessageData
}

export interface XImLongTextMessage extends XImMessageCommon {
  type: XImMessageType.LongText
  data: {
    type: XImMessageType
    url: string
  }
}

// export interface XImNoticeMessage extends XImMessageCommon {
//   type: XImMessageType.Notice
//   data: {
//     content: string
//   }
// }

// export interface XImUserOnlineMessage extends XImMessageCommon {
//   type: XImMessageType.UserOnline
//   data: {
//     userId: number
//   }
// }

// export interface XImUserOnlineStatusMessage extends XImMessageCommon {
//   type: XImMessageType.UserOnlineStatus
//   data: {
//     userOnlineStatusMap: {
//       [userId: number]: boolean
//     }
//   }
// }

export interface XImSensitiveUpdateMessage extends XImMessageCommon {
  type: XImMessageType.SensitiveUpdate
  data: {
    content: string
  }
}

export interface XImBlockMeMessage extends XImMessageCommon {
  type: XImMessageType.BlockMe
  data: {
    userId: number
  }
}

export interface XImUnBlockMeMessage extends XImMessageCommon {
  type: XImMessageType.UnblockMe
  data: {
    userId: number
  }
}

export type XImMessage =
  | XImChatMessage
  | XImChatUnreadMessage
  | XImWithdrawMessage
  | XImTypingMessage
  | XImQueueUpdateMessage
  | XImQueueFinishMessage
  | XImLikeMessage
  | XImUnLikeMessage
  | XImChatMessageUpdate
  | XImLongTextMessage
  // | XImNoticeMessage
  // | XImUserOnlineMessage
  // | XImUserOnlineStatusMessage
  | XImSensitiveUpdateMessage
  | XImBlockMeMessage
  | XImUnBlockMeMessage
  | XImChatMuteMessage
  | XImDeleteMessage
  | XImMessageRejectMessage
  | XImVaultStatusChangeMessage
  | XImMessagePay
