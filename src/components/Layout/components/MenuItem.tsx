import { pcSelectMenu, usePcActiveMenuKey } from '@/models/layout'
import classNames from 'classnames'
import { useRouter } from 'next/navigation'
import React from 'react'
import styles from '../layout.module.scss'

interface MenuItemProps {
  children: React.ReactNode
  path: string
  icon?: React.ReactNode
  activeIcon?: React.ReactNode
  isCollapse?: boolean
}
function MenuItem(props: MenuItemProps) {
  const { children, path } = props
  const route = useRouter()
  const activeMenuKey = usePcActiveMenuKey()
  const isActive = path === activeMenuKey

  return (
    <div
      className={classNames(styles['menu-item'], {
        [styles['active']]: isActive,
        [styles['collapse']]: props.isCollapse,
      })}
      onClick={() => {
        route.push(path)
        pcSelectMenu(path)
      }}
    >
      <span style={{ marginRight: 14, fontSize: 26, width: 30 }}>
        {!isActive && props.icon}
        {isActive && props.activeIcon}
      </span>
      {!props.isCollapse && children}
    </div>
  )
}

export default MenuItem
