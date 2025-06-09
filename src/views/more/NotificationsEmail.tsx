'use client'

import { PcMenuLayout, MobileNoTabbarLayout } from '@/components/Layout'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { Cell, cln, Loading, Switch } from '@x-vision/design'
import { useMemo, useState } from 'react'
import { useNotificationData } from './Notifications.data'
import { PAGE_NAMES } from './constants/page-names'
import { PageProps } from '@/types/page'
import { OverlayLoading } from '@/components/Setting/OverlayLoading'
import { PageContent } from '@/components/Setting/PageContent'

export default function NotificationsEmail({
  title = PAGE_NAMES.NOTIFICATION_EMAIL,
  className,
  ...props
}: { value?: string | number; setValue?: (v: number) => void } & PageProps) {
  const { loading, setLoading, data, updateData } = useNotificationData()

  const items = useMemo(
    () => [
      { key: 'emailPayment', label: 'Payment', value: 'payment', checked: Boolean(data['emailPayment']) },
      { key: 'emailSystemUpdate', label: 'X updates', value: 'x_updates', checked: Boolean(data['emailSystemUpdate']) },
    ],
    [data],
  )

  function submit(v: boolean, item: { key: string; label: string; value: string; checked: boolean }) {
    const { key } = item
    if (!key) return
    updateData({ notify: key, value: v ? 1 : 0 })
  }

  return (
    <PageContent
      className={cln('relative flex flex-col gap-(--named-small)', className)}
      loading={loading}
      title={title}
      {...props}
    >
      {items.map((item) => (
        <Cell key={item.label} right={<Switch checked={item.checked} onCheckedChange={(v) => submit(v, item)} />}>
          {item.label}
        </Cell>
      ))}
    </PageContent>
  )
}

NotificationsEmail.PcLayout = PcMenuLayout
NotificationsEmail.MobileLayout = MobileNoTabbarLayout
