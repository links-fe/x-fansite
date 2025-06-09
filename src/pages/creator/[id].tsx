import { CreatorPage } from './components/CreatorPage'
import { PageHeader } from '@/components/PageHeader'

export default function Page() {
  return (
    <div>
      <PageHeader title="Creator" />
      <CreatorPage />
      <div>Creator default</div>
    </div>
  )
}
