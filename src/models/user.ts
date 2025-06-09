/**
 * 处理用户登入相关
 */
import { EnumClientUseType, EnumLoginMode, EnumUserType, IUserInfo } from '@/types'
import { create } from 'zustand'
import { ON_APP_EVENT_INIT } from './app'

interface UserStoreState {
  userInfo: IUserInfo | null
  useType: EnumClientUseType
  visibleGlobalLoginModal: boolean
  visibleRegisterLoginPageDialog: boolean
  visibleResetYourPasswordDrawer: boolean
  settingPasswordDrawerVisible: boolean
}
export const useUserStore = create<UserStoreState>(() => ({
  // 用户信息
  userInfo: null,
  /** 用户类型（注意 这是前端自己维护的） */
  useType: EnumClientUseType.Guest,
  /** 登陆注册弹窗是否可见 */
  visibleGlobalLoginModal: false,
  /** 登陆注册页面级别弹窗是否可见 */
  visibleRegisterLoginPageDialog: false,
  /** 重置密码弹窗是否显示 */
  visibleResetYourPasswordDrawer: false,
  /** 初次注册登录的设置密码弹窗是否显示 */
  settingPasswordDrawerVisible: false,
}))

export function getUserInfo() {
  const userInfo = useUserStore.getState().userInfo
  return userInfo
}

export function useUserInfo() {
  const userInfo = useUserStore((state) => state.userInfo)
  return userInfo
}

export function changeUserInfoItem(data: any) {
  const userInfo = useUserStore.getState().userInfo
  useUserStore.setState({
    userInfo: {
      ...userInfo,
      ...data,
    },
  })
}

export function useUserType() {
  const useType = useUserStore((state) => state.useType)
  return useType
}

export function useSettingPasswordDrawerVisible() {
  const settingPasswordDrawerVisible = useUserStore((state) => state.settingPasswordDrawerVisible)
  return settingPasswordDrawerVisible
}
export function showSettingPasswordDrawer() {
  useUserStore.setState({ settingPasswordDrawerVisible: true })
}
export function hideSettingPasswordDrawer() {
  useUserStore.setState({ settingPasswordDrawerVisible: false })
}

export function useResetYourPasswordDrawerVisible() {
  const visibleResetYourPasswordDrawer = useUserStore((state) => state.visibleResetYourPasswordDrawer)
  return visibleResetYourPasswordDrawer
}
export function showResetYourPasswordDrawer() {
  useUserStore.setState({ visibleResetYourPasswordDrawer: true })
}
export function hideResetYourPasswordDrawer() {
  useUserStore.setState({ visibleResetYourPasswordDrawer: false })
}

export function useRegisterLoginPageDialogVisible() {
  const visibleRegisterLoginPageDialog = useUserStore((state) => state.visibleRegisterLoginPageDialog)
  return visibleRegisterLoginPageDialog
}
export function showRegisterLoginPageDialog() {
  useUserStore.setState({ visibleRegisterLoginPageDialog: true })
}
export function hideRegisterLoginPageDialog() {
  useUserStore.setState({ visibleRegisterLoginPageDialog: false })
}

export function useGlobalLoginModalVisible() {
  const visibleGlobalLoginModal = useUserStore((state) => state.visibleGlobalLoginModal)
  return visibleGlobalLoginModal
}

export function showGlobalLoginModal() {
  console.log('showGlobalLoginModal')

  useUserStore.setState({ visibleGlobalLoginModal: true })
}

export function hideGlobalLoginModal() {
  useUserStore.setState({ visibleGlobalLoginModal: false })
}

export function initUserInfo(userInfo: IUserInfo | null) {
  let useType
  if (userInfo?.loginMode) {
    useType = EnumClientUseType.Guest
  } else {
    useType = userInfo?.userType as any
  }
  useUserStore.setState({ userInfo: userInfo, useType })
}

export function isUserLogined() {
  const userInfo = useUserStore.getState().userInfo
  return userInfo?.loginMode === EnumLoginMode.Normal
}

export function isUserCreator() {
  const userInfo = useUserStore.getState().userInfo
  return userInfo?.userType === EnumUserType.Creator
}

export function getActiveAccountId() {
  const userInfo = useUserStore.getState().userInfo
  return userInfo?.userId
}

/** 登入守卫模块 -- start -- */
const _loginCallbacks: (() => void)[] = []

function _onLogined(cb: () => void) {
  _loginCallbacks.push(cb)
}

function _triggerLogined() {
  while (_loginCallbacks.length) {
    const cb = _loginCallbacks.shift()!
    cb()
  }
}

export function loginGuard() {
  return new Promise<void>((resolve) => {
    if (isUserLogined()) {
      resolve()
      return
    }
    showGlobalLoginModal()
    _onLogined(resolve)
  })
}

/** 登入守卫模块 -- end -- */

/** 登入成功事件 */
export function ON_APP_EVENT_LOGIN_SUCCESS() {
  // 触发登入成功
  _triggerLogined()
  ON_APP_EVENT_INIT()
}
