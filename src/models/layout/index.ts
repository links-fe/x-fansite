'use client'

import { isMobile } from '@/npm/x-utils'
import { create } from 'zustand'

export const useLayoutStore = create(() => ({
  /** 开启pc模式 */
  enablePcMode: false,
}))

/** 切换pc模式 */
export function openLayoutPcMode() {
  useLayoutStore.setState({ enablePcMode: true })
  // 添加layout-pc类
  document.documentElement.classList.add('layout-pc')
  // 删除layout-mobile类
  document.documentElement.classList.remove('layout-mobile')
}

/** 关闭pc模式 */
export function closeLayoutPcMode() {
  useLayoutStore.setState({ enablePcMode: false })
  // 从html删除layout-pc类
  document.documentElement.classList.remove('layout-pc')
  // 如果不存在layout-mobile类则添加
  document.documentElement.classList.add('layout-mobile')
}

/** 是否开启pc模式 */
export function isEnableLayoutPcMode() {
  const enablePcMode = useLayoutStore.getState().enablePcMode
  return enablePcMode
}

export function useEnableLayoutPcMode() {
  const enablePcMode = useLayoutStore((state) => state.enablePcMode)
  return enablePcMode
}

export function INIT_LAYOUT_MODEL() {
  if (isMobile()) {
    closeLayoutPcMode()
  } else {
    openLayoutPcMode()
  }
}

export * from './pcLayout'
export * from './config'
