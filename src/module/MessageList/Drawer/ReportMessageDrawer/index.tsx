'use client'
import React from 'react'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@x-vision/design'

import { setReportMessageDrawerVisible, useMessageListModel } from '@/models/message/model'
import ReportMessageMain from './ReportMessageMain'

interface IProps {
  toUserId: string
  userId: string
}

const ReportMessageDrawer = (props: IProps) => {
  const { reportMessageDrawerVisible } = useMessageListModel()

  return (
    <Drawer
      open={reportMessageDrawerVisible}
      onOpenChange={setReportMessageDrawerVisible}
      direction="right"
      handleSlot={false}
      closeSlot={false}
      header={false}
      footer={false}
      nested={true}
      className="max-w-[100vw] !w-[100vw]"
      // dismissible={false}
    >
      {reportMessageDrawerVisible && (
        <div className="max-w-[100vw] !w-[100vw]">
          <ReportMessageMain {...props} />
        </div>
      )}
    </Drawer>
  )
}
export default ReportMessageDrawer
