// import { RtmMessage } from 'agora-rtm-sdk'
// import { ReceivedMessageProperties } from './type'

export enum EnumRTMClientEvent {
  NewChannelMessage = 'new-channel-message',
  OfflineChannelMessage = 'offline-channel-message',
  /** 漫游消息 */
  RoamingChannelMessage = 'roaming-channel-message',
  // ConnectionStateChanged = 'ConnectionStateChanged',
  // MessageFromPeer = 'MessageFromPeer',
  // RemoteInvitationReceived = 'RemoteInvitationReceived',
  // TokenExpired = 'TokenExpired',
  /** 连接成功 */
  Connected = 'connected',
  /** 连接失败 - 需要上报 */
  Disconnected = 'disconnected',
  /** 当前联机嗯 */
  WillReconnect = 'willReconnect',
  Error = 'error',
}

// export interface IChannelMessage {
//   channelName: string
//   message: RtmMessage
//   memberId: string
//   messagePros: ReceivedMessageProperties
// }
