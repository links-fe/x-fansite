'use client'
import { pcSelectMenu, usePcActiveMenuKey, usePcCollapseMenu } from '@/models/layout/pcLayout'
import styles from './layout.module.scss'
import { useRouter } from 'next/navigation'
import classNames from 'classnames'
import { Icon } from '@x-vision/icons'
import { Badge } from '@x-vision/design/index.js'
import { setTotalUnreadCount, useChatModels } from '@/models/chat/model'
import { getActiveAccountId } from '@/models/user'
import { useEffect } from 'react'
import { getMessageUnreadCountApi } from '@/services/chat'
import { AppLayout } from './AppLayout'
import MenuItem from './components/MenuItem'
import PcMessageMenuItem from './components/PcMessageMenuItem'

interface MenuItemProps {
  children: React.ReactNode
  path: string
  icon?: React.ReactNode
  activeIcon?: React.ReactNode
  isCollapse?: boolean
}

export function PcMenuLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pcMenu = usePcCollapseMenu()
  return (
    <AppLayout>
      <div className={styles['pc-menu-layout']}>
        <div className={styles['menu-column']} style={{ width: pcMenu.menuWidth }}>
          <div
            className={classNames(styles['menu-header'], {
              [styles['collapse']]: pcMenu.isCollapseMenu,
            })}
          >
            <Icon
              icon="x:SidebarLeftStyleStroke"
              style={{ cursor: 'pointer' }}
              onClick={() => pcMenu.pcToggleCollapseMenu()}
            />
          </div>
          <PcMessageMenuItem />
          <MenuItem
            path={`/shop`}
            icon={<Icon icon="x:Store02StyleStroke" />}
            activeIcon={<Icon icon="x:Store02StyleSolid" />}
            isCollapse={pcMenu.isCollapseMenu}
          >
            Shop
          </MenuItem>
          <MenuItem
            path={`/wallet`}
            icon={<Icon icon="x:Wallet03StyleStroke" />}
            activeIcon={<Icon icon="x:Wallet03StyleSolid" />}
            isCollapse={pcMenu.isCollapseMenu}
          >
            Wallet
          </MenuItem>
          <MenuItem
            path={`/analytics`}
            icon={<Icon icon="x:ChartLineData01StyleStroke" />}
            activeIcon={<Icon icon="x:ChartLineData01StyleSolid" />}
            isCollapse={pcMenu.isCollapseMenu}
          >
            Analytics
          </MenuItem>
          <MenuItem
            path={`/setting`}
            icon={<Icon icon="x:FilterHorizontalStyleStroke" />}
            activeIcon={<Icon icon="x:FilterHorizontalStyleSolid" />}
            isCollapse={pcMenu.isCollapseMenu}
          >
            Setting
          </MenuItem>
          <MenuItem
            path="/more"
            icon={<Icon icon="x:MoreHorizontalStyleStroke" />}
            activeIcon={<Icon icon="x:MoreHorizontalStyleSolid" />}
            isCollapse={pcMenu.isCollapseMenu}
          >
            More
          </MenuItem>
        </div>
        <div className={styles['content-column']} style={{ width: `calc(100vw - ${pcMenu.menuWidth})` }}>
          {children}
        </div>
      </div>
    </AppLayout>
  )
}
