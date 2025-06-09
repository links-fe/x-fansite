'use client'

import { PcMenuLayout, MobileNoTabbarLayout } from '@/components/Layout'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { Button, Cell, CellGroup, cln } from '@x-vision/design'
import { Icon } from '@x-vision/icons'
import { useRouter } from 'next/router'
import { NOTIFICATIONS_ITEMS } from './constants/menu-routes'
import { PAGE_NAMES } from './constants/page-names'
import { PageProps } from '@/types/page'
import { PageContent } from '@/components/Setting/PageContent'
import { CellGroupItems } from '@/components/Setting/CellGroupItems'
import { useState } from 'react'
import { useNotificationData } from './Notifications.data'
import NotificationsEmail from './NotificationsEmail'
import NotificationsPush from './NotificationsPush'

export default function Notifications({ title = PAGE_NAMES.NOTIFICATIONS, ...props }: PageProps) {
  const [page, setPage] = useState<string | null>(null)

  return (
    <PageContent title={title} {...props}>
      <CellGroupItems
        items={{ group: true, children: NOTIFICATIONS_ITEMS }}
        cellClick={(item) => {
          //  router.push(item.to)
          setPage(item.label)
        }}
      />

      {page === PAGE_NAMES.NOTIFICATION_PUSH && (
        <NotificationsPush rootClassName="absolute inset-0" onBack={() => setPage(null)} />
      )}
      {page === PAGE_NAMES.NOTIFICATION_EMAIL && (
        <NotificationsEmail rootClassName="absolute inset-0" onBack={() => setPage(null)} />
      )}
    </PageContent>
  )
}

Notifications.PcLayout = PcMenuLayout
Notifications.MobileLayout = MobileNoTabbarLayout
