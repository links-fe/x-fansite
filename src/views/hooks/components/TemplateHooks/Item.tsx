import { Avatar, Text } from '@x-vision/design/index.js'
import React from 'react'

function Item() {
  const imgSrc =
    'https://images.unsplash.com/photo-1748973752341-e265470ae47d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  return (
    <div className="flex flex-col">
      <div className="flex flex-col rounded-(--surface-01-radius) bg-(--surface-level-00-emphasis-00) overflow-hidden">
        <Avatar src={imgSrc} shape="square" className="w-full !rounded-none !h-[112px]" />
      </div>
      <div className="py-(--sizing-named-micro) px-(--sizing-named-mini)">
        <Text size="body2">Flirtatious sale</Text>
      </div>
    </div>
  )
}

export default Item
