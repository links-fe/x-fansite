'use client'
import React, { useState } from 'react'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, Text, Button } from '@x-vision/design'

import { setUnsendMessageDrawerVisible, useMessageListModel } from '@/models/message/model'
import { handleMessageWithdraw } from '@/models/message'

interface IProps {
  toUserId: string
  userId: string
}

const UnSendMessageDrawer = (props: IProps) => {
  const { toUserId, userId } = props
  const { unsendMessageDrawerVisible, unsendMessageId } = useMessageListModel()
  const [loading, setLoading] = useState(false)

  return (
    <Drawer
      open={unsendMessageDrawerVisible}
      onOpenChange={setUnsendMessageDrawerVisible}
      handleSlot={false}
      closeSlot={false}
      header={false}
      footer={false}
      nested={true}
      className="w-full"
    >
      {unsendMessageDrawerVisible && (
        <div className="w-full">
          <div className="p-4 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center text-center gap-4 mt-9">
              <Text size="body1" strong>
                Unsend message?
              </Text>
              <Text size="body1" emphasis={1}>
                The message will be removed for both you and the recipient.
              </Text>
            </div>
            <Button
              color="stop"
              size="huge"
              className="w-full"
              loading={loading}
              onClick={async () => {
                setLoading(true)
                if (loading) return
                if (unsendMessageId) {
                  handleMessageWithdraw(userId, toUserId, unsendMessageId)
                  setUnsendMessageDrawerVisible(false)
                }
                setLoading(false)
              }}
            >
              Unsend
            </Button>
            <Button size="huge" className="w-full" onClick={() => setUnsendMessageDrawerVisible(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  )
}
export default UnSendMessageDrawer
