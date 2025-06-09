/* eslint-disable */
import { request } from '@/common/request'

interface IpostSendCloseAccountCodeEmailRes {
  success: boolean
}
export async function postSendCloseAccountCodeEmail(): Promise<IpostSendCloseAccountCodeEmailRes> {
  const res: IpostSendCloseAccountCodeEmailRes = await request.post('/api/account/sendCloseAccountCodeEmail')
  console.log('postSendCloseAccountCodeEmail res: ', res)
  return res
}

interface IpostRestoreAccountRes {
  success: boolean
}
export async function postRestoreAccount(): Promise<IpostRestoreAccountRes> {
  const res: IpostRestoreAccountRes = await request.post('/api/account/setting/restoreAccount')
  console.log('postRestoreAccount res: ', res)
  return res
}

interface IpostCloseAccountData {
  closeReason: string[]
  verifyCode: string
}
interface IpostCloseAccountRes {
  success: boolean
}
export async function postCloseAccount(data: IpostCloseAccountData): Promise<IpostCloseAccountRes> {
  const res: IpostLinkGoogleAccountsRes = await request.post('/api/account/setting/closeAccount', data)
  console.log('postCloseAccount res: ', res)
  return res
}

interface IpostLinkGoogleAccountsData {
  googleCode: string
  redirectUrl: string
}
interface IpostLinkGoogleAccountsRes {
  success: boolean
}
export async function postLinkGoogleAccounts(data: IpostLinkGoogleAccountsData): Promise<IpostLinkGoogleAccountsRes> {
  const res: IpostLinkGoogleAccountsRes = await request.post('/api/account/setting/linkGoogleAccounts', data)
  console.log('postLinkGoogleAccounts res: ', res)
  return res
}

interface IpostUnlinkThirdAccountsData {
  thirdAccountId: number
}
interface IpostUnlinkThirdAccountsRes {
  success: boolean
}
export async function postUnlinkThirdAccounts(
  data: IpostUnlinkThirdAccountsData,
): Promise<IpostUnlinkThirdAccountsRes> {
  const res: IpostUnlinkThirdAccountsRes = await request.post('/api/account/setting/unlinkThirdAccounts', data)
  console.log('postUnlinkThirdAccounts res: ', res)
  return res
}

export interface IqueryThirdAccountsRes {
  thirdAccountType: number
  thirdAccountId: number
  email: string
}
export async function queryThirdAccounts(): Promise<IqueryThirdAccountsRes[]> {
  const res: IqueryThirdAccountsRes[] = await request.get('/api/account/setting/thirdAccounts')
  console.log('queryThirdAccounts res: ', res)
  return res
}

interface IpostChangeEmailData {
  oldCode: string
  newCode: string
  newEmail: string
}
interface IpostChangeEmailRes {
  success: boolean
}
export async function postChangeEmail(data: IpostChangeEmailData): Promise<IpostChangeEmailRes> {
  const res: IpostChangeEmailRes = await request.post('/api/account/setting/changeEmail', data)
  console.log('postChangeEmail res: ', res)
  return res
}

interface IpostVerifyChangeEmailOldCodeData {
  oldCode: string
}
interface IpostVerifyChangeEmailOldCodeRes {
  success: boolean
}
export async function postVerifyChangeEmailOldCode(
  data: IpostVerifyChangeEmailOldCodeData,
): Promise<IpostVerifyChangeEmailOldCodeRes> {
  const res: IpostVerifyChangeEmailOldCodeRes = await request.post(
    '/api/account/setting/verifyChangeEmailOldCode',
    data,
  )
  console.log('postVerifyChangeEmailOldCode res: ', res)
  return res
}

interface IpostSendChangeEmailNewData {
  newEmail: string
}
interface IpostSendChangeEmailNewRes {
  success: boolean
}
export async function postSendChangeEmailNew(data: IpostSendChangeEmailNewData): Promise<IpostSendChangeEmailNewRes> {
  const res: IpostSendChangeEmailNewRes = await request.post('/api/account/sendChangeEmailNew', data)
  console.log('postSendChangeEmailNew res: ', res)
  return res
}

interface IpostSendChangeEmailOldRes {
  success: boolean
}
export async function postSendChangeEmailOld(): Promise<IpostSendChangeEmailOldRes> {
  const res: IpostSendChangeEmailOldRes = await request.post('/api/account/sendChangeEmailOld')
  console.log('postSendChangeEmailOld res: ', res)
  return res
}

interface Iprops {
  verifyCode: string
  password: string
}
interface IpostModifyPasswordRes {
  success: boolean
}
export async function postModifyPassword(data: Iprops): Promise<IpostModifyPasswordRes> {
  const res: IpostModifyPasswordRes = await request.post('/api/account/setting/modifyPassword', data)
  console.log('postModifyPassword res: ', res)
  return res
}

interface IpostModifyPasswordVerifyBody {
  verifyCode: string
}
interface IpostModifyPasswordVerifyRes {
  success: boolean
}
export async function postModifyPasswordVerify(
  data: IpostModifyPasswordVerifyBody,
): Promise<IpostModifyPasswordVerifyRes> {
  const res: IpostModifyPasswordVerifyRes = await request.post('/api/account/setting/modifyPasswordVerify', data)
  console.log('postModifyPasswordVerify res: ', res)
  return res
}

interface IpostSendChangePasswordEmailRes {
  success: boolean
}
export async function postSendChangePasswordEmail(): Promise<IpostSendChangePasswordEmailRes> {
  const res: IpostSendChangePasswordEmailRes = await request.post('/api/account/sendChangePasswordEmail')
  console.log('postSendChangePasswordEmail res: ', res)
  return res
}

/** 修改邮箱往新的邮箱发送验证码 错误码

```
100007  邮箱格式不正确

100011 邮箱已被注册

100009 邮件发送频繁
``` POST /api/account/sendChangeEmailNew */
export async function postApiAccountSendChangeEmailNew(
  body: {
    /** 新邮箱 */
    newEmail: string
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/api/account/sendChangeEmailNew', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改邮箱往老邮箱发送验证码 错误码

```
100009 邮件发送频繁
``` POST /api/account/sendChangeEmailOld */
export async function postApiAccountSendChangeEmailOld(options?: { [key: string]: any }) {
  return request<{ success: boolean }>('/api/account/sendChangeEmailOld', {
    method: 'POST',
    ...(options || {}),
  })
}

/** 发送修改密码验证码 错误码：

```
100009  邮件发送频繁
``` POST /api/account/sendChangePasswordEmail */
export async function postApiAccountSendChangePasswordEmail(body: {}, options?: { [key: string]: any }) {
  return request<{ success: boolean }>('/api/account/sendChangePasswordEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 关闭账户发送验证码 错误码

```
100009 邮件发送频繁
``` POST /api/account/sendCloseAccountCodeEmail */
export async function postApiAccountSendCloseAccountCodeEmail(options?: { [key: string]: any }) {
  return request<{ success: boolean }>('/api/account/sendCloseAccountCodeEmail', {
    method: 'POST',
    ...(options || {}),
  })
}

/** 更改邮箱 错误码

```
100008 参数错误

100007 邮箱格式错误

100011 该邮箱已经注册


100006 验证码错误或者失效
``` POST /api/account/setting/changeEmail */
export async function postApiAccountSettingChangeEmail(
  body: {
    oldCode: string
    newCode: string
    newEmail: string
  },
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean }>('/api/account/setting/changeEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 删除账户 错误码

```
100008 参数错误

100006 验证码错误或者失效
``` POST /api/account/setting/closeAccount */
export async function postApiAccountSettingCloseAccount(
  body: {
    closeReason?: string[]
    /** 验证码 */
    verifyCode: string
  },
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean }>('/api/account/setting/closeAccount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 反馈 错误码

```
100008 参数错误
``` POST /api/account/setting/feedback */
export async function postApiAccountSettingFeedback(
  body: {
    feedback: string
  },
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean }>('/api/account/setting/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 地址编码接口 错误码：

```
100008：参数错误
``` POST /api/account/setting/geoCode */
export async function postApiAccountSettingGeoCode(
  body: {
    /** 地址 */
    address: string
  },
  options?: { [key: string]: any },
) {
  return request<{ address: string; lat: number; lng: number }[]>('/api/account/setting/geoCode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 连接谷歌账户 错误码

```
100008 参数错误

100010 谷歌授权失败

100018 该谷歌账户已连接其他账户
``` POST /api/account/setting/linkGoogleAccounts */
export async function postApiAccountSettingLinkGoogleAccounts(
  body: {
    /** googlecode */
    googleCode: string
    /** 前端重定向url */
    redirectUrl: string
  },
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean }>('/api/account/setting/linkGoogleAccounts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改Bio 错误码

```
100028  bio不合法
``` POST /api/account/setting/modifyBio */
export async function postApiAccountSettingModifyBio(
  body: {
    bio?: string
  },
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean }>('/api/account/setting/modifyBio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改图片 错误码

```
100008 参数错误
``` POST /api/account/setting/modifyImg */
export async function postApiAccountSettingModifyImg(
  body: {
    fileKey: string
    /** businessType  与上传文件的businessType一致 */
    businessType?: string
    /** 1 头像  2背景图 */
    imageType: number
  },
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean }>('/api/account/setting/modifyImg', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改Location 错误码

```
100029 location不合法
``` POST /api/account/setting/modifyLocation */
export async function postApiAccountSettingModifyLocation(
  body: {
    location?: string
  },
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean }>('/api/account/setting/modifyLocation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改昵称 错误码

```
100027  昵称不合法
``` POST /api/account/setting/modifyNickName */
export async function postApiAccountSettingModifyNickName(
  body: {
    nickName: string
  },
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean }>('/api/account/setting/modifyNickName', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改密码 错误码

```
100008 参数错误

100006 验证码错误或者失效

100004 密码不符合要求
``` POST /api/account/setting/modifyPassword */
export async function postApiAccountSettingModifyPassword(
  body: {
    verifyCode: string
    password: string
  },
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean }>('/api/account/setting/modifyPassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改密码验证验证 错误码：

```
100008 参数错误

100006 验证码错误或者失效
``` POST /api/account/setting/modifyPasswordVerify */
export async function postApiAccountSettingModifyPasswordVerify(
  body: {
    verifyCode: string
  },
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean }>('/api/account/setting/modifyPasswordVerify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改通知 错误码：

```
100008 参数错误
``` POST /api/account/setting/modifyPushNotification */
export async function postApiAccountSettingModifyPushNotification(
  body: {
    /** pushNewMsg，pushNewSub，pushSystemNotify，emailPayment，emailSystemUpdate */
    notify: string
    /** 0关 1开 */
    value: number
  },
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean }>('/api/account/setting/modifyPushNotification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改username 错误码：

```
100024 username修改超过次数

100026  username不合法

100023 username已存在
```

<br>
<br>
 POST /api/account/setting/modifyUserName */
export async function postApiAccountSettingModifyUserName(
  body: {
    /** username */
    userName: string
  },
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean }>('/api/account/setting/modifyUserName', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 查询我的profile getMyProfile GET /api/account/setting/myProfile */
export async function getApiAccountSettingMyProfile(options?: { [key: string]: any }) {
  return request<{
    userName?: string
    nickName?: string
    bio?: string
    location?: string
    headImgUrl?: string
    backgroundImgUrl?: string
    userNameEditEnabled?: boolean
  }>('/api/account/setting/myProfile', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 查询通知设置 GET /api/account/setting/notifications */
export async function getApiAccountSettingNotifications(options?: { [key: string]: any }) {
  return request<{
    pushNewMsg?: number
    pushNewSub?: number
    pushSystemNotify?: number
    emailPayment?: number
    emailSystemUpdate?: number
  }>('/api/account/setting/notifications', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 查询主页可见性 ```

``` GET /api/account/setting/privacySettingHome */
export async function getApiAccountSettingPrivacySettingHome(options?: { [key: string]: any }) {
  return request<{ homepageVisibility?: number }>('/api/account/setting/privacySettingHome', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 恢复账户 POST /api/account/setting/restoreAccount */
export async function postApiAccountSettingRestoreAccount(options?: { [key: string]: any }) {
  return request<{ success?: boolean }>('/api/account/setting/restoreAccount', {
    method: 'POST',
    ...(options || {}),
  })
}

/** 逆地址编码 错误码：

```
100008：参数错误
``` POST /api/account/setting/reverseGeoCode */
export async function postApiAccountSettingReverseGeoCode(
  body: {
    /** 经度 */
    lat: number
    /** 纬度 */
    lng: number
  },
  options?: { [key: string]: any },
) {
  return request<{ address: string; lat: number; lng: number }[]>('/api/account/setting/reverseGeoCode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取三方账号 GET /api/account/setting/thirdAccounts */
export async function getApiAccountSettingThirdAccounts(options?: { [key: string]: any }) {
  return request<{ thirdAccountType?: number; thirdAccountId?: number; email?: string }[]>(
    '/api/account/setting/thirdAccounts',
    {
      method: 'GET',
      ...(options || {}),
    },
  )
}

/** 解绑三方账户 错误码

```
100008参数错误


100019  密码为空
``` POST /api/account/setting/unlinkThirdAccounts */
export async function postApiAccountSettingUnlinkThirdAccounts(
  body: {
    thirdAccountId: number
  },
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean }>('/api/account/setting/unlinkThirdAccounts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改可见性 错误码

```
100008 参数错误
``` POST /api/account/setting/updateHomepageVisibility */
export async function postApiAccountSettingUpdateHomepageVisibility(
  body: {
    homepageVisibility: number
  },
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean }>('/api/account/setting/updateHomepageVisibility', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 验证老邮箱验证码 错误码

```
100008 参数错误

100006 验证码错误或者失效
``` POST /api/account/setting/verifyChangeEmailOldCode */
export async function postApiAccountSettingVerifyChangeEmailOldCode(
  body: {
    oldCode: string
  },
  options?: { [key: string]: any },
) {
  return request<{ success?: boolean }>('/api/account/setting/verifyChangeEmailOldCode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
