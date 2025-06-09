import { queryMe } from '@/services/user'
import { create } from 'zustand'
import { hideSettingPasswordDrawer, initUserInfo, showSettingPasswordDrawer } from './user'
import { xim } from '@/common/im'
import { xLogger } from '@/common/logger'
import { EnumLoginMode } from '@/types'
import { hbSendLog, setDataDogUserScope } from '@/utils/datadog'

export const useAppStore = create(() => ({
  /** 是否正在初始化应用 */
  isAppIniting: false,
  /** 是否已经初始化 */
  hadInit: false,
  /** 是否显示全局错误状态 */
  visibleGlobalError: false,
}))
export function useVisibleGlobalError() {
  const visibleGlobalError = useAppStore((state) => state.visibleGlobalError)
  return visibleGlobalError
}
export function showGlobalError() {
  useAppStore.setState({ visibleGlobalError: true })
}
export function hideGlobalError() {
  useAppStore.setState({ visibleGlobalError: false })
}

export async function initMeInfo() {
  try {
    // 请求me接口
    const meInfo = await queryMe()
    if (!meInfo?.userId) {
      throw meInfo
    }
    initUserInfo(meInfo)
    setDataDogUserScope(meInfo)
    console.log('meInfo: ', meInfo)
    hideGlobalError()
    return meInfo
  } catch (error: any) {
    console.error('queryMe error: ', error)
    hbSendLog({
      message: 'Login Registration initMeInfo me error',
      status: 'error',
      error,
    })
    showGlobalError()
  }
}
/** 初始化应用 */
export async function ON_APP_EVENT_INIT() {
  if (useAppStore.getState().isAppIniting) {
    return
  }
  useAppStore.setState({ isAppIniting: true })
  console.log('ON_APP_EVENT_INIT')
  try {
    // 请求me接口
    const meInfo = await initMeInfo()
    if (meInfo?.loginMode === EnumLoginMode.Normal && !meInfo?.hasPassword) {
      // 未设置密码，打开设置密码弹窗
      showSettingPasswordDrawer()
    } else {
      // 已设置密码，关闭设置密码弹窗
      hideSettingPasswordDrawer()
    }
  } catch (error: any) {
    console.error('ON_APP_EVENT_INIT error: ', error)
  } finally {
    // 初始化完成
    useAppStore.setState({ hadInit: true })
  }

  try {
    xim.connect()
  } catch (error) {
    xLogger.error('xim connect error', { error })
  }
  useAppStore.setState({ isAppIniting: false })
}
