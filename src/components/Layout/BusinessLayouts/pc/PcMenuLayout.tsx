'use client'
import { usePcCollapseMenu } from '@/models/layout/pcLayout'
import styles from '../../layout.module.scss'
import classNames from 'classnames'
import { Icon } from '@x-vision/icons'
import MenuItem from '../../components/MenuItem'
import PcMessageMenuItem from '../../components/PcMessageMenuItem'
import { AppLayout } from '../../AppLayout'
import TotalUnreadCountInit from '../components/TotalUnreadCountInit'

export default function PcMenuLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pcMenu = usePcCollapseMenu()

  return (
    <AppLayout>
      <TotalUnreadCountInit />
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
          <MenuItem
            path={`/home`}
            icon={<Icon icon="x:Home05StyleStroke" />}
            activeIcon={<Icon icon="x:Home05StyleSolid" />}
            isCollapse={pcMenu.isCollapseMenu}
          >
            Home
          </MenuItem>
          <MenuItem
            path={`/hooks`}
            icon={<Icon icon="x:HookStyleStroke" />}
            activeIcon={<Icon icon="x:HookStyleSolid" />}
            isCollapse={pcMenu.isCollapseMenu}
          >
            Chat Hooks
          </MenuItem>
          <PcMessageMenuItem />
          <MenuItem
            path="/more"
            icon={<Icon icon="x:MoreHorizontalStyleStroke" />}
            activeIcon={<Icon icon="x:MoreHorizontalStyleSolid" />}
            isCollapse={pcMenu.isCollapseMenu}
          >
            More
          </MenuItem>
        </div>
        <div
          className={styles['content-column']}
          style={{ width: `calc(100vw - ${pcMenu.menuWidth})`, position: 'relative' }}
        >
          {children}
        </div>
      </div>
    </AppLayout>
  )
}
