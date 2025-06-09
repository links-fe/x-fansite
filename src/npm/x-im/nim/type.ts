// export interface I

/** 漫游消息 */
export interface INimRoamMessage {
  msgs: INimMessage[]
  scene: string
  to: string
  sessionId: string
  timetag: number
}

/** 离线消息 */
export interface INimOfflineMessage {
  msgs: INimMessage[]
  scene: string
  to: string
  sessionId: string
  timetag: number
}

export interface INimMessage {
  scene: string
  from: string
  fromNick: string
  fromClientType: string
  to: string
  time: number
  type: string
  text: string
  isHistoryable: boolean
  isRoamingable: boolean
  isSyncable: boolean
  cc: boolean
  isPushable: boolean
  isOfflinable: boolean
  isUnreadable: boolean
  isReplyMsg: boolean
  needPushNick: boolean
  needMsgReceipt: boolean
  isLocal: boolean
  idClient: string
  idServer: string
  userUpdateTime: number
  custom: string
  apns: {
    accounts: any[]
    content: string
    forcePush: boolean
  }
  status: string
  target: string
  sessionId: string
  flow: string
}
