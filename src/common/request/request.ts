'use client'

import { API_BASE_URL } from '@/constants'
// import { initMeInfo } from '@/models'
// import { hbSendLog } from '@/utils/datadog'

import { createBearRequest, IBearRequestHooks } from '@hb-common/bear-request'
import type { AxiosError, AxiosResponse } from 'axios'
import { HANDLE_X_EXCEPTION, XException } from '../exception'
import { IRequestConfig } from './types'
import { requestErrorCapture } from './requestErrorCapture'

const onRequest: IBearRequestHooks['onRequest'] = (config: IRequestConfig) => {
  // 如果没有网络直接抛出错误
  if (!window.navigator.onLine) return Promise.reject({ code: 'NET-abort' })

  // TODO: 加request-id

  return config
}

function dealWithException(response: AxiosResponse<any, any> | undefined, exception: XException) {
  const responseConfig = response?.config as IRequestConfig

  if (XException.isXException(exception)) {
    // * 这是一个异常

    // 如果没有禁用错误处理 则执行错误处理
    if (!responseConfig?.disbaleErrorHandle) {
      HANDLE_X_EXCEPTION(exception)
    }

    if (responseConfig?.customErrorHandler) {
      responseConfig.customErrorHandler(exception)
    }

    // 不管是否处理异常 都抛出异常
    return Promise.reject(response?.data || response)
  } else {
    // * 这不是一个异常 (自定义处理为非异常) .. 这里的exception是一个正常的数据
    // 这里的Promise.resolve没有意义 仅仅为了增强阅读性
    return Promise.resolve(exception)
  }
}

const onResponse: IBearRequestHooks['onResponse'] = async (response) => {
  const responseConfig = response?.config as IRequestConfig

  if (responseConfig.customErrorCapture) {
    const exception = responseConfig.customErrorCapture(response)

    return dealWithException(response, exception)
  }
  return response.data
}

export const onResponseError: IBearRequestHooks['onResponseError'] = async (error: AxiosError<unknown>) => {
  const { response } = error
  // 捕获异常 - 这里不一定抛出异常
  const exception = requestErrorCapture(error)

  return dealWithException(response, exception)
}

export const request = createBearRequest<IRequestConfig>(
  {
    baseURL: API_BASE_URL,
    timeout: 12000,
    /** 不在header中添加时间戳 */
    notHeaderTimestamp: true,
    // 开启跨域请求时发送 cookie
    withCredentials: true,
  },
  {
    onRequest,
    // onRequestError,
    onResponse,
    onResponseError,
  },
)
