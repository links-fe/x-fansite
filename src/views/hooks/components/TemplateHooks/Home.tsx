import { Button, Text } from '@x-vision/design/index.js'
import React, { useState } from 'react'
import Item from './Item'
import { CommonDialog } from '@/components/CommonDialog'
import AllHooks from './AllHooks'

function TemplatesHooks() {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const data = [1, 2, 3, 4]
  return (
    <React.Fragment>
      <div className="mt-(--sizing-named-large)">
        {/* header */}
        <div className="flex items-center justify-between">
          <Text size="heading4">Templates</Text>
          <Button color="primary" variant="link" className="p-0" onClick={() => setDrawerVisible(true)}>
            See all
          </Button>
        </div>
        {/* list */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((item) => (
            <Item key={item} />
          ))}
        </div>
      </div>
      <CommonDialog open={drawerVisible} onOpenChange={setDrawerVisible} direction="right" closeSlot={false}>
        <AllHooks onBack={() => setDrawerVisible(false)} />
      </CommonDialog>
    </React.Fragment>
  )
}

export default TemplatesHooks
