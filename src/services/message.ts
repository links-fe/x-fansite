import { request } from '@/common/request'
import { XImChatMessageData } from '@/npm/x-im'
import { ChatInputSendServerData } from '@/types'
import { PagingResponse } from '@/types/common'
import { pick } from '@/utils/chat'

export interface QueryMessageListParams {
  toUserId: string
  cursor?: string
  limit?: number
}

export async function queryMessageList(params: QueryMessageListParams): Promise<PagingResponse<XImChatMessageData>> {
  if (!params?.toUserId) return Promise.reject('error')
  const res = await request.get('api/chat/message/list', {
    params: {
      limit: 10,
      ...params,
    },
  })
  return res
}

// 发送消息
export async function callSendMessageApi(params: ChatInputSendServerData): Promise<XImChatMessageData> {
  const res = await request.post(
    '/api/chat/message/send',
    pick(params, ['content', 'msgType', 'replyMsgId', 'frontendId', 'free', 'price', 'mediaList', 'toUserId', 'gifId']),
  )
  // @ts-expect-error 后端返回的数据目前是这样的
  return res
}

// 撤回消息
export async function callWithdrawMessageApi(params: { toUserId: string; msgId: string }): Promise<object> {
  const res = await request.post('/api/chat/message/withdraw', params)
  return res
}

// 删除消息
export async function callDelMessageApi(params: { toUserId: string; msgId: string }): Promise<object> {
  const res = await request.post('/api/chat/message/delete', params)
  return res
}

// 消息付费解锁
export async function callUnlockMessageApi(params: { toUserId: string; msgId: string }): Promise<boolean> {
  const res = await request.post('/api/chat/message/unlocked', params)
  return res.data
}

// 查询素材实际播放地址
export async function queryMediaViewUrl(params: {
  vaultIds: string
  toUserId: string
  msgId: string
}): Promise<{ [key: string]: { url: string } }> {
  const res = await request.get('/api/chat/vault/view', {
    params,
  })
  return res
}
