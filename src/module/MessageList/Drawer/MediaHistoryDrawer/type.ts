import { XImMessageMediaType } from '@/npm/x-im'

export enum SendTypeEnum {
  Sent = 'Sent',
  Received = 'Received',
}

export type FreeType = undefined | boolean
export type MediaType = undefined | 'video' | 'photo' | 'audio'
export type PpvTypeListType = {
  id: FreeType
  name: string
}

export type mediaTypeListType = {
  id: string
  value: MediaType
  shape: 'pill' | 'circle'
  render: React.ReactNode
}

export interface MediaListType {
  items: IItem[]
  displayDate: string
}

export interface IItem {
  id: string
  userId: string
  toUserId: string
  chatId: string
  msgId: string
  vaultId: string
  vaultType: 'image' | 'video' | 'audio'
  free: boolean
  unlock: boolean
  gmtCreate: number
  thumbUrl: string
  url: string
  duration: number
  vaultData: XImMessageMediaType
}
