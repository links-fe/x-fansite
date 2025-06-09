'use client'
import React from 'react'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@x-vision/design'

import InfoSettingDrawerPage from './InfoSettingDrawerPage'
import { setInfoSettingDrawerVisible, useMessageListModel } from '@/models/message/model'

interface Iprops {
  toUserId: string
  userId: string
}
const InfoSettingDrawer = (props: Iprops) => {
  const { toUserId, userId } = props
  const { infoSettingDrawerVisible } = useMessageListModel()

  return (
    <Drawer
      open={infoSettingDrawerVisible}
      onOpenChange={setInfoSettingDrawerVisible}
      direction="right"
      handleSlot={false}
      closeSlot={false}
      header={false}
      footer={false}
      nested={true}
      className="max-w-[100vw] !w-[100vw]"
      // dismissible={false}
    >
      {infoSettingDrawerVisible && (
        <div className="max-w-[100vw] !w-[100vw]">
          <InfoSettingDrawerPage toUserId={toUserId} userId={userId} />
        </div>
      )}
    </Drawer>
  )
}
export default InfoSettingDrawer
