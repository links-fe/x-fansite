import { request } from '@/common/request'

/** 拉黑某人blockUser 错误码：

```
800000  参数错误

800001  用户不存在
``` POST /api/relation/blockUser */
export async function postApiRelationBlockUser(
  body: {
    /** 拉黑userid */
    blockUserId: number
  },
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean }>('/api/relation/blockUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 查询拉黑列表queryBlockUserList GET /api/relation/queryBlockUserList */
export async function getApiRelationQueryBlockUserList(
  params: {
    /** 分页大小 */
    size?: number
    /** 当前页 */
    page?: number
  },
  options?: { [key: string]: any },
) {
  return request<{
    items?: {
      userId?: number
      userName?: string
      nickName?: string
      headImgUrl?: string
      gmtCreate?: number
    }[]
    cursor?: string
    hasNext?: boolean
    total?: number
  }>('/api/relation/queryBlockUserList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 设置备注名 错误码：

```
800000 参数错误

800001 用户不存在
``` POST /api/relation/setRemarkName */
export async function postApiRelationSetRemarkName(
  body: {
    /** 备注名 */
    remarkName?: string
    /** 需要备注的用户id */
    remarkUserId: number
  },
  options?: { [key: string]: any },
) {
  return request<{ success: boolean }>('/api/relation/setRemarkName', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 解除拉黑unblockUser 错误码：

```
800000 参数错误
``` POST /api/relation/unblockUser */
export async function postApiRelationUnblockUser(
  body: {
    /** 用户id */
    blockUserId: number
  },
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean }>('/api/relation/unblockUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
