import type { AxiosError, AxiosResponse } from 'axios'
import { XException } from '../exception'
import { IRequestConfig } from './types'
import { initMeInfo } from '@/models'
import { getUserInfo, initUserInfo } from '@/models/user'

function defaultErrorCapture(error: AxiosError<unknown>): XException {
  const { response } = error
  const axiosErrCode = error?.code

  // 客户端网络存在问题(可能到cloudflare或aws网络存在问题)
  if (axiosErrCode === 'ERR_NETWORK') return new XException('NET-error')
  // 客户端请求超时或连接被中止。用户网络断开、客户端唤醒等
  if (axiosErrCode === 'ECONNABORTED') return new XException('NET-timeout')
  // 前端主动终止
  if (axiosErrCode === 'NET-abort') return new XException('NET-abort')

  if (response?.status === 401) {
    // if (getUserInfo()) {
    //   initUserInfo(null)
    //   initMeInfo()
    // }
    // 登录过期了 刷新页面
    location.reload()
    return new XException('NET-401')
  }

  return new XException('NET-http')
}

export function requestErrorCapture(error: AxiosError<unknown>): XException | any {
  const { response } = error
  const responseConfig = response?.config as IRequestConfig

  const exception = defaultErrorCapture(error)

  if (responseConfig?.customErrorCapture) {
    // * ⚠️ 注意: 这里没有抛出异常, 而是交由业务方处理
    return responseConfig.customErrorCapture(response as AxiosResponse<any, any>, exception)
  }
  return exception
}
