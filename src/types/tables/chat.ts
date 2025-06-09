import { XImChatMessageData } from '@/npm/x-im'

export interface UserInfo {
  backgroundImgUrl: string
  closeStatus: number
  email: string
  headImgUrl: string
  nickName: string
  remarkName?: string
  online: boolean
  onlineTimeStamp: number
  userId: string
  userName: string
  userType: number
}

export interface TableChatListItem {
  id: string
  userId: string
  toUserId: string
  chatId: string
  unreadCount: number
  sortTime: number
  mute: boolean
  reject: boolean
  lastMsg: Partial<XImChatMessageData>
  user: Partial<UserInfo>
}

export interface TableContact {
  userId: number
  nickname: string
  avatar: string
  isBlock: boolean
  isMute: boolean
  isStar: boolean
}

interface ChatListItemBasic {
  toUserId?: string
}

export interface ChatListItemUnreadType extends ChatListItemBasic {
  lastMsgId?: string
  unreadCount: number
}

export interface ChatListItemMuteType extends ChatListItemBasic {
  mute: boolean
}
export interface ChatListItemRejectType extends ChatListItemBasic {
  reject: boolean
}

export interface IContactMeta {
  /** 正在请求用户信息 */
  loadingQueryContactView: boolean
  /** 拒收 */
  reject: boolean
  /** 静音  */
  mute: boolean
  /** 未读数 */
  unreadCount: number
  /** 最后一条消息时间 */
  sortTime: number
  /** 最后一条消息内容 */
  lastMsg: Partial<XImChatMessageData>
  /** 最后一条消息类型 */
  lastMsgType: number
  /** 用户信息 */
  user: Partial<UserInfo>
}
