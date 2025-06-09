'use client'
import React, { useState } from 'react'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, Text, Button } from '@x-vision/design'

import { setResendMessageDrawerVisible, useMessageListModel } from '@/models/message/model'
import { resendMessage } from '@/models/message'

const ResendMessageDrawer = () => {
  const { resendMessageDrawerVisible, resendMessageId } = useMessageListModel()
  const [loading, setLoading] = useState(false)

  return (
    <Drawer
      open={resendMessageDrawerVisible}
      onOpenChange={setResendMessageDrawerVisible}
      handleSlot={false}
      closeSlot={false}
      header={false}
      footer={false}
      nested={true}
      className="w-full"
    >
      {resendMessageDrawerVisible && (
        <div className="w-full">
          <div className="p-4 flex flex-col items-center gap-6">
            <Text>Message was not sent</Text>
            <Button
              color="primary"
              size="huge"
              className="w-full"
              loading={loading}
              onClick={async () => {
                setLoading(true)
                if (loading) return
                if (resendMessageId) {
                  await resendMessage(resendMessageId)
                  setResendMessageDrawerVisible(false)
                }
                setLoading(false)
              }}
            >
              Resend
            </Button>
            <Button size="huge" className="w-full" onClick={() => setResendMessageDrawerVisible(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  )
}
export default ResendMessageDrawer
