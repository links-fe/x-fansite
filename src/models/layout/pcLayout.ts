import { create } from 'zustand'
import { LAYOUT_CONFIG } from './config'
export const usePcLayoutStore = create(() => ({
  /** 是否折叠菜单 */
  isCollapseMenu: false,
  /** 菜单宽度 */
  menuWidth: LAYOUT_CONFIG.pc.menuExpandWidth,
  /** 当前选中的menuKey */
  activeMenuKey: '',
}))

/** 收起菜单 */
export function pcCollapseMenu() {
  usePcLayoutStore.setState({ isCollapseMenu: true, menuWidth: LAYOUT_CONFIG.pc.menuCollapseWidth })
}

/** 打开菜单 */
export function pcExpandMenu() {
  usePcLayoutStore.setState({ isCollapseMenu: false, menuWidth: LAYOUT_CONFIG.pc.menuExpandWidth })
}

export function pcToggleCollapseMenu() {
  const { isCollapseMenu } = usePcLayoutStore.getState()
  if (isCollapseMenu) {
    pcExpandMenu()
  } else {
    pcCollapseMenu()
  }
}

/** 获取菜单是否折叠 */
export function getPcCollapseStatus() {
  return usePcLayoutStore.getState().isCollapseMenu
}

/** 是否折叠菜单 */
export function usePcCollapseMenu() {
  const isCollapseMenu = usePcLayoutStore((state) => state.isCollapseMenu)
  const menuWidth = usePcLayoutStore((state) => state.menuWidth)
  return { isCollapseMenu, menuWidth, pcToggleCollapseMenu, pcCollapseMenu, pcExpandMenu }
}

/** 设置当前选中的menuKey */
export function pcSelectMenu(menuKey: string) {
  usePcLayoutStore.setState({ activeMenuKey: menuKey })
}
export function usePcActiveMenuKey() {
  const activeMenuKey = usePcLayoutStore((state) => state.activeMenuKey)
  return activeMenuKey
}
