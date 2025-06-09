'use client'

import { MobileNoTabbarLayout, PcMenuLayout } from '@/components/Layout'
import LogoutDrawer from '@/components/LogoutDrawer'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { Button, cln, Navbar } from '@x-vision/design'
import { useState } from 'react'
import Account from '@/components/Setting/Account'
import DeleteAccount from '@/components/Setting/DeleteAccount'
import { CellGroupItems, ICellItem } from '@/components/Setting/CellGroupItems'
import { SETTING_ITEMS } from './constants/menu-routes'
import Privacy from './Privacy'
import { PAGE_NAMES } from './constants/page-names'
import { PageProps } from '@/types/page'
import Notifications from './Notifications'

export default function Setting({ title = PAGE_NAMES.Setting, className, onBack, ...props }: PageProps) {
  const [showAccountPage, setShowAccountPage] = useState<boolean>(false)
  const closeAccountPage = () => {
    setShowAccountPage(false)
  }

  const [showDeleteAccountPage, setShowDeleteAccountPage] = useState<boolean>(false)
  const closeDeleteAccountPage = () => {
    setShowDeleteAccountPage(false)
  }

  const [showLogoutDrawer, setShowLogoutDrawer] = useState<boolean>(false)
  const handleClickLogout = () => {
    setShowLogoutDrawer(true)
  }
  const closeLogoutDrawer = () => {
    setShowLogoutDrawer(false)
  }

  const [page, setPage] = useState<string | null>(null)
  return (
    <div className={cln('size-full overflow-hidden flex flex-col relative', className)}>
      <PageHeader title={title} back={onBack} />
      <div className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col gap-(--named-large) p-(--named-small)">
        <CellGroupItems
          items={SETTING_ITEMS}
          cellClick={(item) => {
            // 如果不需要路由跳转, 需要删除 item.to 的配置, 否则会自动路由跳转
            if (item.label === 'Account') setShowAccountPage(true)
            else if (item.label === 'Delete account') setShowDeleteAccountPage(true)
            else setPage(item.label)
          }}
        />
        <Button size="huge" onClick={handleClickLogout}>
          Logout
        </Button>
      </div>

      {page === PAGE_NAMES.PRIVACY && <Privacy rootClassName="absolute inset-0" onBack={() => setPage(null)} />}
      {page === PAGE_NAMES.NOTIFICATIONS && (
        <Notifications rootClassName="absolute inset-0" onBack={() => setPage(null)} />
      )}

      {showAccountPage && (
        <Account visible={showAccountPage} back={closeAccountPage} className="absolute top-0 left-0"></Account>
      )}
      {showDeleteAccountPage && (
        <DeleteAccount
          visible={showDeleteAccountPage}
          back={closeDeleteAccountPage}
          className="absolute top-0 left-0"
        ></DeleteAccount>
      )}
      <LogoutDrawer visible={showLogoutDrawer} close={closeLogoutDrawer}></LogoutDrawer>
    </div>
  )
}

Setting.PcLayout = PcMenuLayout
Setting.MobileLayout = MobileNoTabbarLayout
