'use client'

import { useEffect, useMemo, useState } from 'react'
import { useBlockedValue } from './PrivacyBlocked.data'
import { useVisibilityValue } from './PrivacyVisibility.data'
import { PcMenuLayout, MobileNoTabbarLayout } from '@/components/Layout'
import { CellGroupItems } from '@/components/Setting/CellGroupItems'
import { PAGE_NAMES } from './constants/page-names'
import { PageProps } from '@/types/page'
import { PageContent } from '@/components/Setting/PageContent'
import PrivacyBlocked from './PrivacyBlocked'
import PrivacyVisibility from './PrivacyVisibility'

export default function Privacy({ title = PAGE_NAMES.PRIVACY, ...props }: PageProps) {
  const {
    loading: visiblityLoading,
    visibilityValue,
    visibilityValueString,
    updateVisibilityValue,
  } = useVisibilityValue()
  const { loading: blockLoading, blockTotal, fetchBlocked } = useBlockedValue()
  const [page, setPage] = useState<string | null>(null)

  const ITEMS = useMemo(
    () => [
      {
        label: 'Visibility',
        // to: '/more/setting/privacy/visibility',
        extra: visibilityValueString,
        loading: visiblityLoading,
      },
      // { label: 'Blocked', to: '/more/setting/privacy/blocked', extra: blockTotal, loading: blockLoading },
      { label: 'Blocked', extra: blockTotal, loading: blockLoading },
    ],
    [blockTotal, visibilityValueString, visiblityLoading, blockLoading],
  )

  useEffect(() => {
    fetchBlocked(1)
  }, [])

  return (
    <PageContent title={title} {...props}>
      <CellGroupItems items={{ group: true, children: ITEMS }} cellClick={(item) => setPage(item.label)} />

      {page === PAGE_NAMES.VISIBILITY && (
        <PrivacyVisibility
          rootClassName="absolute inset-0"
          value={visibilityValue}
          setValue={updateVisibilityValue}
          onBack={() => setPage(null)}
        />
      )}
      {page === PAGE_NAMES.BLOCKED && (
        <PrivacyBlocked
          rootClassName="absolute inset-0"
          onBack={() => {
            fetchBlocked(1)
            setPage(null)
          }}
        />
      )}
    </PageContent>
  )
}

Privacy.PcLayout = PcMenuLayout
Privacy.MobileLayout = MobileNoTabbarLayout
