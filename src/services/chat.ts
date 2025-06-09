import { request } from '@/common/request'
import { PagingResponse, Response } from '@/types/common'
import { TableChatListItem } from '@/types/tables/chat'

export interface QueryChatListParams {
  cursor?: string
  limit: number
}

export async function queryChatList(params: QueryChatListParams): Promise<PagingResponse<TableChatListItem>> {
  console.log('queryChatList', params)
  const res = await request.get('/api/chat/chats', {
    params: {
      ...params,
      limit: 10,
    },
  })
  return res
}

// 消息已读
export async function callMessageReadApi(params: { toUserId: string; lastMsgId: string }): Promise<Response<object>> {
  const res = await request.post('/api/chat/message/read', params)
  return res?.data
}

// 会话未读
export async function callMessageUnReadApi(params: { toUserId: string }): Promise<Response<object>> {
  const res = await request.post('/api/chat/unread/mark', params)
  return res?.data
}

// 会话消息免打扰
export async function callMessageMuteApi(params: { toUserId: string; mute: boolean }): Promise<Response<object>> {
  const res = await request.post('/api/chat/mute/edit', params)
  return res?.data
}

// 会话消息拒收
export async function callMessageRejectApi(params: { toUserId: string; reject: boolean }): Promise<Response<object>> {
  const res = await request.post('/api/chat/reject/edit', params)
  return res?.data
}

// 获取会话未读数
export async function getChatUnreadCountApi(): Promise<Response<object>> {
  const res = await request.get('/api/chat/unread/chat/count')
  return res?.data
}

// 获取消息未读数
export async function getMessageUnreadCountApi(): Promise<{ totalUnreadCount: number }> {
  const res = await request.get('/api/chat/unread/message/count')
  return res
}

// 根据userId获取会话信息
export async function getChatInfoByUserIdApi(userId: string): Promise<TableChatListItem> {
  const res = await request.get(`/api/chat/one`, {
    params: {
      toUserId: userId,
    },
  })
  return res
}
