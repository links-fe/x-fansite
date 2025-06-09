'use client'
import { initTracker, LogOptions, sendLog, setGlobalContext, setUserScope } from '@hb-common/crm-browser-tracker'
import { APP_ENV, DATADOG_CLIENT_TOKEN } from '@/constants'
import pkg from '../../package.json'
import { IUserInfo } from '@/types'
const trackerConfig = {
  clientToken: DATADOG_CLIENT_TOKEN,
  service: 'x-fansite',
  // 'development':开发环境, 'test': 测试环境, 'production': 线上环境(包括灰度环境)
  env: APP_ENV,
  // TODO 后续上线后 关闭测试环境的埋点 @leonard
  //   enableTracking: process.env.NEXT_PUBLIC_ENV === 'production',
  enableTracking: process.env.NODE_ENV !== 'development', // 是否开启埋点
  version: pkg.version,
}
// 初始化datadog
initTracker(trackerConfig)
export function hbSendLog(logOptions: LogOptions) {
  sendLog(logOptions)
}
export function setDataDogUserScope(user: IUserInfo) {
  setUserScope(user as any)
  setGlobalContext({
    userInfo: user,
  })
}
