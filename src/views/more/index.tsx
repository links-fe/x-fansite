import { PageHeader } from '@/components/PageHeader/PageHeader'
import { Cell } from '@x-vision/design'
import { Icon } from '@x-vision/icons'
import { useRouter } from 'next/router'

const ITEMS = [
  {
    label: 'My profile',
    to: '/more/profile',
    icon: <Icon icon="x:UserCircleStyleStroke" />,
  },
  {
    label: 'Settings',
    to: '/more/setting',
    icon: <Icon icon="x:Settings01StyleStroke" />,
  },
]
export default function MorePage() {
  const router = useRouter()

  return (
    <div>
      <PageHeader title="More" />

      <div className="flex flex-col gap-(--named-small) p-(--named-small)">
        {ITEMS.map((item) => (
          <Cell
            key={item.label}
            left={item.icon}
            right={<Icon icon="x:ArrowRight01StyleStroke" />}
            onClick={() => router.push(item.to)}
          >
            {item.label}
          </Cell>
        ))}
      </div>
    </div>
  )
}
