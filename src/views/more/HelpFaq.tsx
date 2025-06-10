'use client'

import { PageHeader } from '@/components/PageHeader/PageHeader'
import { Button, Cell, CellGroup, cln } from '@x-vision/design'
import { Icon } from '@x-vision/icons'
import { useRouter } from 'next/router'
import { HELP_FAQ_ITEMS } from './constants/menu-routes'
import { PageProps } from '@/types/page'

export default function HelpFaq({ title, className, onBack, ...props }: PageProps) {
  const router = useRouter()
  const type = router.query.type as string

  if (!type) return 404
  return (
    <div className={cln('relative', className)}>
      <PageHeader title={title || `For all ${type} FAQ`} back={onBack} />
      <div className="flex flex-col gap-(--named-large) p-(--named-small)">
        <CellGroup>
          {HELP_FAQ_ITEMS.map((item) => (
            <Cell
              className="**:data-[slot=cell-title]:whitespace-normal!"
              key={item.label}
              right={<Icon icon="x:ArrowRight01StyleStroke" />}
              onClick={() => router.push(item.to)}
            >
              {item.label}
            </Cell>
          ))}
        </CellGroup>
      </div>
    </div>
  )
}
