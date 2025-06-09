import { setTotalUnreadCount, useChatModels } from '@/models/chat/model'
import { mobileSelectMenu, useMobileActiveMenuKey } from '@/models/layout/mobileLayout'
import { getActiveAccountId } from '@/models/user'
import { getMessageUnreadCountApi } from '@/services/chat'
import { Tabbar } from '@x-vision/design'
import { Icon } from '@x-vision/icons'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const routeMenuConfig = {
  message: '/message',
  create: '/create',
  wallet: '/wallet',
  more: '/more',
}

export function MobileBottomTabbar() {
  const pathname = usePathname()
  const activeMenuKey = useMobileActiveMenuKey(pathname?.split('/')?.[1])
  const router = useRouter()
  const { totalUnreadCount } = useChatModels()
  const userId = getActiveAccountId()!

  // 初始化totalUnreadCount
  useEffect(() => {
    getMessageUnreadCountApi().then((res) => {
      if (userId) {
        setTotalUnreadCount(userId, res.totalUnreadCount)
      }
    })
  }, [])

  const tabs = [
    {
      key: 'message',
      label: 'Messages',
      activeIcon: <Icon icon="x:Message01StyleSolid" />,
      inactiveIcon: <Icon icon="x:Message01StyleStroke" />,
      extra: userId ? totalUnreadCount || null : null,
      content: 'message',
    },
    {
      key: 'create',
      label: 'Create',
      activeIcon: <Icon icon="x:PlusSignCircleStyleSolid" />,
      inactiveIcon: <Icon icon="x:PlusSignCircleStyleStroke" />,
    },
    {
      key: 'wallet',
      label: 'Wallet',
      activeIcon: <Icon icon="x:Wallet03StyleSolid" />,
      inactiveIcon: <Icon icon="x:Wallet03StyleStroke" />,
      content: 'wallet',
    },
    {
      key: 'more',
      label: 'More',
      activeIcon: <Icon icon="x:MoreHorizontalStyleSolid" />,
      inactiveIcon: <Icon icon="x:MoreHorizontalStyleStroke" />,
      content: 'more',
    },
  ]

  return (
    <Tabbar
      value={activeMenuKey}
      onChange={(v) => {
        mobileSelectMenu(v)

        const routePath = routeMenuConfig[v as keyof typeof routeMenuConfig]
        if (routePath) {
          router.push(routePath)
        }
      }}
      tabs={tabs}
    />
  )
}
