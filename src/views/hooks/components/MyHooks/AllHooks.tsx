import { PageHeader } from '@/components/PageHeader'
import React from 'react'
import Item from './Item'
import { Icon } from '@x-vision/icons/index.js'
import { Text } from '@x-vision/design/index.js'

function AllHooks({ onBack }: { onBack: () => void }) {
  const data = Array.from({ length: 10 }, (_, index) => index)
  return (
    <div className="h-full flex flex-col">
      <PageHeader
        onBack={onBack}
        left={
          <div className="flex items-center gap-2">
            <Icon icon="x:ArrowLeft02StyleSolid" fontSize={20} className="mr-(--sizing-named-mini)" />
            <Text size="heading3">My chat hooks</Text>
          </div>
        }
      />
      {/* list */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
          {data.map((item) => (
            <Item key={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AllHooks
