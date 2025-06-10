'use client'

import { PageHeader } from '@/components/PageHeader/PageHeader'
import { Cell, cln, Loading, Switch } from '@x-vision/design'
import { useMemo, useState } from 'react'
import { useNotificationData } from './Notifications.data'
import { PAGE_NAMES } from './constants/page-names'
import { PageProps } from '@/types/page'
import { OverlayLoading } from '@/components/Setting/OverlayLoading'
import { PageContent } from '@/components/Setting/PageContent'

export default function NotificationsPush({ title = PAGE_NAMES.NOTIFICATION_PUSH, className, ...props }: PageProps) {
  const { loading, setLoading, data, updateData } = useNotificationData()

  const items = useMemo(
    () => [
      { key: 'pushNewMsg', label: 'New message', value: 'message', checked: Boolean(data['pushNewMsg']) },
      { key: 'pushNewSub', label: 'New follower', value: 'follower', checked: Boolean(data['pushNewSub']) },
      { key: 'pushSystemNotify', label: 'X', value: 'x', checked: Boolean(data['pushSystemNotify']) },
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
        <Cell key={item.key} right={<Switch checked={item.checked} onCheckedChange={(v) => submit(v, item)} />}>
          {item.label}
        </Cell>
      ))}
    </PageContent>
  )
}
