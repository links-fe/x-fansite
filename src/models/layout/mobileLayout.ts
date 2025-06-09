import { create } from 'zustand'

export const useMobileLayoutStore = create(() => ({
  /** 当前选中的menuKey */
  activeMenuKey: '',
}))

/** 设置当前选中的menuKey */
export function mobileSelectMenu(menuKey: string) {
  useMobileLayoutStore.setState({ activeMenuKey: menuKey })
}
export function useMobileActiveMenuKey(defaultMenuKey?: string) {
  const activeMenuKey = useMobileLayoutStore((state) => state.activeMenuKey)
  if (defaultMenuKey) return defaultMenuKey
  return activeMenuKey
}
