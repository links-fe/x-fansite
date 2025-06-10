import { Button, Text } from '@x-vision/design/index.js'
import { Icon } from '@x-vision/icons/index.js'
import React from 'react'

function Header({ onSave }: { onSave: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Icon icon="x:ArrowLeft02StyleSolid" fontSize={20} className="mr-(--sizing-named-mini)" />
        <Text size="heading3">Create</Text>
      </div>
      <Button className="mr-[40px]" onClick={onSave}>
        Done
      </Button>
    </div>
  )
}

export default Header
