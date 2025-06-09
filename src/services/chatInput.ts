import { request } from '@/common/request'
import { PagingResponse } from '@/types/common'

export interface GIFDataListItem {
  id: string
  url: string
  images?: {
    original: {
      url: string
      width: number
      height: number
    }
    downsized?: {
      url: string
      width: number
      height: number
    }
  }
}

interface QueryGIFListParams {
  offset?: number
  limit?: number
  keyword?: string
}

// 获取GIF列表
export async function queryGIFList(params: QueryGIFListParams): Promise<PagingResponse<GIFDataListItem>> {
  const res = await request.post('/api/chat/gif/search', {
    ...params,
  })
  // @ts-expect-error 后端返回的数据目前是这样的
  return res
}

export interface QueryMessageHistoryVaultListParams {
  toUserId: string
  send?: boolean
  vaultType?: string
  free?: boolean | undefined
  cursor?: string
  limit?: number
}

// 随机Id
// const randomId = () => {
//   return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
// }

// const TEST_LIST = [
//   {
//     id: '1',
//     userId: '1',
//     toUserId: '2',
//     chatId: '1',
//     messageId: '1',
//     vaultId: randomId(),
//     vaultType: 'image',
//     free: true,
//     unlock: false,
//     createdAt: 1746777211864,
//     thumbUrl:
//       'https://media0.giphy.com/media/v1.Y2lkPWNhM2RiMjY1enI5bTd3YmFqYW5jYWpnN21obWpudWR1Z3hsZ3I4OGE0NTJ4aDhiZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/pkqnVgAiYQx2w/200_s.gif',

//     url: 'https://media0.giphy.com/media/v1.Y2lkPWNhM2RiMjY1enI5bTd3YmFqYW5jYWpnN21obWpudWR1Z3hsZ3I4OGE0NTJ4aDhiZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/pkqnVgAiYQx2w/200.gif',
//     duration: 22,
//   },
//   {
//     id: '2',
//     userId: '1',
//     toUserId: '2',
//     chatId: '1',
//     messageId: '1',
//     vaultId: randomId(),
//     vaultType: 'video',
//     free: false,
//     unlock: false,
//     createdAt: 1746696225936,
//     thumbUrl:
//       'https://media3.giphy.com/media/v1.Y2lkPWNhM2RiMjY1enI5bTd3YmFqYW5jYWpnN21obWpudWR1Z3hsZ3I4OGE0NTJ4aDhiZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/XweOsBl72PFcc/200_s.gif',
//     url: 'https://media3.giphy.com/media/v1.Y2lkPWNhM2RiMjY1enI5bTd3YmFqYW5jYWpnN21obWpudWR1Z3hsZ3I4OGE0NTJ4aDhiZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/XweOsBl72PFcc/200.webp',
//     duration: 33,
//   },
//   {
//     id: '3',
//     userId: '1',
//     toUserId: '2',
//     chatId: '1',
//     messageId: '1',
//     vaultId: randomId(),
//     vaultType: 'image',
//     free: true,
//     unlock: false,
//     createdAt: 1746696225936,
//     thumbUrl:
//       'https://media3.giphy.com/media/v1.Y2lkPWNhM2RiMjY1Z2UxOTJmNjFiaDh1cGUxbWl6NW5nNjI4cmo0eWZhM3ZtZmh0MTJreCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/pkqnVgAiYQx2w/200_s.gif',
//     url: 'https://media3.giphy.com/media/v1.Y2lkPWNhM2RiMjY1Z2UxOTJmNjFiaDh1cGUxbWl6NW5nNjI4cmo0eWZhM3ZtZmh0MTJreCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/pkqnVgAiYQx2w/200_s.gif',
//     duration: 44,
//   },
//   {
//     id: '4',
//     userId: '1',
//     toUserId: '2',
//     chatId: '1',
//     messageId: '1',
//     vaultId: randomId(),
//     vaultType: 'image',
//     free: true,
//     unlock: false,
//     createdAt: 1746696325936,
//     thumbUrl:
//       'https://media1.giphy.com/media/v1.Y2lkPWNhM2RiMjY1Z2UxOTJmNjFiaDh1cGUxbWl6NW5nNjI4cmo0eWZhM3ZtZmh0MTJreCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oEduGKltktmcJ7HKo/200_s.gif',
//     url: 'https://media1.giphy.com/media/v1.Y2lkPWNhM2RiMjY1Z2UxOTJmNjFiaDh1cGUxbWl6NW5nNjI4cmo0eWZhM3ZtZmh0MTJreCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oEduGKltktmcJ7HKo/200_s.gif',
//     duration: 512,
//   },
//   {
//     id: '5',
//     userId: '1',
//     toUserId: '2',
//     chatId: '1',
//     messageId: '1',
//     vaultId: randomId(),
//     vaultType: 'video',
//     free: true,
//     unlock: false,
//     createdAt: 1746696325236,
//     thumbUrl:
//       'https://media2.giphy.com/media/v1.Y2lkPWNhM2RiMjY1Z2UxOTJmNjFiaDh1cGUxbWl6NW5nNjI4cmo0eWZhM3ZtZmh0MTJreCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ph6ewybUlGbW8/200_s.gif',
//     url: 'https://media2.giphy.com/media/v1.Y2lkPWNhM2RiMjY1Z2UxOTJmNjFiaDh1cGUxbWl6NW5nNjI4cmo0eWZhM3ZtZmh0MTJreCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ph6ewybUlGbW8/200_s.gif',
//     duration: 51,
//   },
//   {
//     id: '6',
//     userId: '1',
//     toUserId: '2',
//     chatId: '1',
//     messageId: '1',
//     vaultId: randomId(),
//     vaultType: 'image',
//     free: true,
//     unlock: false,
//     createdAt: 1746396235936,
//     thumbUrl:
//       'https://media2.giphy.com/media/v1.Y2lkPWNhM2RiMjY1Z2UxOTJmNjFiaDh1cGUxbWl6NW5nNjI4cmo0eWZhM3ZtZmh0MTJreCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2Qs2hKWMvEzdu/200_s.gif',
//     url: 'https://media2.giphy.com/media/v1.Y2lkPWNhM2RiMjY1Z2UxOTJmNjFiaDh1cGUxbWl6NW5nNjI4cmo0eWZhM3ZtZmh0MTJreCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2Qs2hKWMvEzdu/200_s.gif',
//     duration: 51,
//   },
//   {
//     id: '7',
//     userId: '1',
//     toUserId: '2',
//     chatId: '1',
//     messageId: '1',
//     vaultId: randomId(),
//     vaultType: 'image',
//     free: true,
//     unlock: false,
//     createdAt: 1746396285936,
//     thumbUrl:
//       'https://media4.giphy.com/media/v1.Y2lkPWNhM2RiMjY1aTg3NjEwcmY3bHAwbHY3NzlobWNhb3FlczE2OGZ4Yjl0ZHlwNno0NSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dZ858lbbBTDwI/200_s.gif',
//     url: 'https://media4.giphy.com/media/v1.Y2lkPWNhM2RiMjY1aTg3NjEwcmY3bHAwbHY3NzlobWNhb3FlczE2OGZ4Yjl0ZHlwNno0NSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dZ858lbbBTDwI/200_s.gif',
//     duration: 51,
//   },
//   {
//     id: '8',
//     userId: '1',
//     toUserId: '2',
//     chatId: '1',
//     messageId: '1',
//     vaultId: randomId(),
//     vaultType: 'image',
//     free: true,
//     unlock: false,
//     createdAt: 1746398235936,
//     thumbUrl:
//       'https://media4.giphy.com/media/v1.Y2lkPWNhM2RiMjY1aTg3NjEwcmY3bHAwbHY3NzlobWNhb3FlczE2OGZ4Yjl0ZHlwNno0NSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xUPGcEM0urw9A3v7os/200_s.gif',
//     url: 'https://media4.giphy.com/media/v1.Y2lkPWNhM2RiMjY1aTg3NjEwcmY3bHAwbHY3NzlobWNhb3FlczE2OGZ4Yjl0ZHlwNno0NSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xUPGcEM0urw9A3v7os/200_s.gif',
//     duration: 51,
//   },
//   {
//     id: '9',
//     userId: '1',
//     toUserId: '2',
//     chatId: '1',
//     messageId: '1',
//     vaultId: randomId(),
//     vaultType: 'image',
//     free: true,
//     unlock: false,
//     createdAt: 1746777202864,
//     thumbUrl:
//       'https://media3.giphy.com/media/v1.Y2lkPWNhM2RiMjY1NTk3aXQ5eHBhZW9mdmgycHBsbWl3OXJ2cHg2cXAweTh3NXQ5Y2J2bCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xT3i14Ddnbl75cEN4A/200_s.gif',
//     url: 'https://media3.giphy.com/media/v1.Y2lkPWNhM2RiMjY1NTk3aXQ5eHBhZW9mdmgycHBsbWl3OXJ2cHg2cXAweTh3NXQ5Y2J2bCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xT3i14Ddnbl75cEN4A/200_s.gif',
//     duration: 51,
//   },
// ]

// 获取历史素材列表
export async function queryMessageHistoryVaultList(params: QueryMessageHistoryVaultListParams) {
  // console.log('queryMessageHistoryVaultList---', params)
  // return {
  //   data: TEST_LIST,
  //   hasMore: true,
  // }
  const res = await request.get('/api/chat/message/vaults', {
    params: { ...params },
  })
  return res
}

interface UpdataFansRemarkNameData {
  remarkName: string
  remarkUserId: string
}

//  设置备注名
export async function updataFansRemarkName(data: UpdataFansRemarkNameData) {
  const res = await request.post('/api/relation/setRemarkName', {
    ...data,
  })
  return res
}
