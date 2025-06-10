import React from 'react'
import MenuItem from './MenuItem'
import { usePcCollapseMenu } from '@/models/layout'
import { useChatModels } from '@/models/chat/model'
import { Icon } from '@x-vision/icons/index.js'
import { Badge } from '@x-vision/design/index.js'

function PcMessageMenuItem() {
  const pcMenu = usePcCollapseMenu()
  const { totalUnreadCount } = useChatModels()

  return (
    <MenuItem
      path={`/message`}
      icon={
        <div className="relative">
          <Icon icon="x:Message01StyleStroke" />
          {totalUnreadCount > 0 ? (
            <Badge color={'stop'} text={totalUnreadCount} className="absolute top-[-5px] right-[-5px]"></Badge>
          ) : null}
        </div>
      }
      activeIcon={
        <div className="relative">
          <Icon icon="x:Message01StyleSolid" />
          {totalUnreadCount > 0 ? (
            <Badge color={'stop'} text={totalUnreadCount} className="absolute top-[-5px] right-[-5px]"></Badge>
          ) : null}
        </div>
      }
      isCollapse={pcMenu.isCollapseMenu}
    >
      Message
    </MenuItem>
  )
}

export default PcMessageMenuItem
