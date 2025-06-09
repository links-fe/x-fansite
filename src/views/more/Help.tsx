'use client'

import { PcMenuLayout, MobileNoTabbarLayout } from '@/components/Layout'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { Button, Cell, CellGroup, cln } from '@x-vision/design'
import { Icon } from '@x-vision/icons'
import { useRouter } from 'next/router'
import { HELP_ITEMS } from './constants/menu-routes'
import { PAGE_NAMES } from './constants/page-names'
import { PageProps } from '@/types/page'

export default function Help({ title = PAGE_NAMES.HELP, className, onBack, ...props }: PageProps) {
  const router = useRouter()

  return (
    <div className={cln('relative', className)}>
      <PageHeader title={title} back={onBack} />
      <div className="flex flex-col gap-(--named-large) p-(--named-small)">
        <CellGroup>
          {HELP_ITEMS.map((item) => (
            <Cell
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

Help.PcLayout = PcMenuLayout
Help.MobileLayout = MobileNoTabbarLayout
