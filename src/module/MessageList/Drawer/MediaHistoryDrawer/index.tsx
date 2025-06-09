'use client'
import React from 'react'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@x-vision/design'

import MediaHistoryWrap from './MediaHistoryWrap'
import { setMediaHistoryDrawerVisible, useMessageListModel } from '@/models/message/model'

interface Iprops {
  toUserId: string
  userId: string
}
const MediaHistoryDrawer = (props: Iprops) => {
  const { toUserId, userId } = props
  const { mediaHistoryDrawerVisible } = useMessageListModel()

  return (
    <Drawer
      open={mediaHistoryDrawerVisible}
      onOpenChange={setMediaHistoryDrawerVisible}
      direction="right"
      handleSlot={false}
      closeSlot={false}
      header={false}
      footer={false}
      nested={true}
      className="max-w-[100vw] !w-[100vw]"
      // dismissible={false}
    >
      {mediaHistoryDrawerVisible && (
        <div className="max-w-[100vw] !w-[100vw]">
          <MediaHistoryWrap toUserId={toUserId} userId={userId} />
        </div>
      )}
    </Drawer>
  )
}
export default MediaHistoryDrawer
