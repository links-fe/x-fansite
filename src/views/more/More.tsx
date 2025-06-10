import { PageHeader } from '@/components/PageHeader/PageHeader'
import { MORE_ITEMS } from './constants/menu-routes'
import { CellSpaceItems } from '@/components/Setting/CellGroupItems'
import { PAGE_NAMES } from './constants/page-names'
import { PageProps } from '@/types/page'
import { cln } from '@x-vision/design'

export default function More({ title = PAGE_NAMES.MORE, className, onBack, ...props }: PageProps) {
  return (
    <div className={cln('relative', className)}>
      <PageHeader title={title} back={onBack} />
      <CellSpaceItems className="p-(--named-small)" items={MORE_ITEMS} />
    </div>
  )
}
