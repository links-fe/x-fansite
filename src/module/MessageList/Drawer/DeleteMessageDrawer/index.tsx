'use client'
import React, { useState } from 'react'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, Text, Button } from '@x-vision/design'

import { setDeleteMessageDrawerVisible, useMessageListModel } from '@/models/message/model'
import { handleMessageDelete } from '@/models/message'

interface IProps {
  toUserId: string
  userId: string
}

const DeleteMessageDrawer = (props: IProps) => {
  const { toUserId, userId } = props
  const { deleteMessageDrawerVisible, deleteMessageId } = useMessageListModel()
  const [loading, setLoading] = useState(false)

  return (
    <Drawer
      open={deleteMessageDrawerVisible}
      onOpenChange={setDeleteMessageDrawerVisible}
      handleSlot={false}
      closeSlot={false}
      header={false}
      footer={false}
      nested={true}
      className="w-full"
    >
      {deleteMessageDrawerVisible && (
        <div className="w-full">
          <div className="p-4 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center text-center gap-4 mt-9">
              <Text size="body1" strong>
                Delete message for you?
              </Text>
              <Text size="body1" emphasis={1}>
                Only your view of the message will be removed. The recipient can still view the message.
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
                if (deleteMessageId) {
                  handleMessageDelete(userId, toUserId, deleteMessageId, !deleteMessageId)
                  setDeleteMessageDrawerVisible(false)
                }
                setLoading(false)
              }}
            >
              Delete
            </Button>
            <Button size="huge" className="w-full" onClick={() => setDeleteMessageDrawerVisible(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  )
}
export default DeleteMessageDrawer
