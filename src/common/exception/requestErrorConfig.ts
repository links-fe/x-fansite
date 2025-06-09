/**
 * 网络公共错误
 */

import { RequestErrorCodeEnum } from './requestCodeEnum'
import { IExceptionConfig } from './types'

export const requestErrorConfig: Record<string, IExceptionConfig> = {
  /** 401 */
  [RequestErrorCodeEnum['NET-401']]: {
    handleType: 'toast',
    copywriting: {
      content: '401',
    },
    effect: async () => {},
  },
  /** nwtwork error */
  [RequestErrorCodeEnum['NET-error']]: {
    handleType: 'toast',
    copywriting: {
      content: 'Network Error',
    },
  },
  /** timeout error */
  [RequestErrorCodeEnum['NET-timeout']]: {
    handleType: 'toast',
    copywriting: {
      content: 'Timeout Error',
    },
  },
  /** 前端主动终止 */
  [RequestErrorCodeEnum['NET-abort']]: {
    handleType: 'silent',
    copywriting: {
      content: 'Proactive',
    },
  },
  /** http error */
  [RequestErrorCodeEnum['NET-http']]: {
    handleType: 'toast',
    copywriting: {
      content: 'http Error',
    },
  },
  /** unknown error */
  [RequestErrorCodeEnum['NET-unknown']]: {
    handleType: 'toast',
    copywriting: {
      content: 'Unknown Error',
    },
  },
}
