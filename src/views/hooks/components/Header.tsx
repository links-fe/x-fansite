import { Text } from '@x-vision/design/index.js'
import { Icon } from '@x-vision/icons/index.js'
import React from 'react'

interface IProps {
  openEditHook: () => void
}

function Header(props: IProps) {
  const { openEditHook } = props
  return (
    <div className="flex items-center justify-between h-(--sizing-named-generous)">
      <div className="flex items-center gap-2">
        <div className="w-(--sizing-named-generous) h-(--sizing-named-generous) flex items-center justify-center">
          <Icon icon="x:Menu01StyleSolid" />
        </div>
        <Text size="heading3">Chat hooks</Text>
      </div>
      <div
        className="w-(--sizing-named-generous) h-(--sizing-named-generous) flex items-center justify-center"
        onClick={openEditHook}
      >
        <Icon icon="x:PlusSignStyleSolid" />
      </div>
    </div>
  )
}

export default Header
