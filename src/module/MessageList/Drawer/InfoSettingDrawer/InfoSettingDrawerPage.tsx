'use client'

import { chatListHandleMute, chatListHandleReject } from '@/models/chat'
import { useContactMeta } from '@/models/chat/cache/meta'
import { setDisplayNameDrawerVisible, setInfoSettingDrawerVisible, useMessageListModel } from '@/models/message/model'
import { Divider, Drawer, Navbar, Switch, Text } from '@x-vision/design'
import { Icon } from '@x-vision/icons'
import React, { useState } from 'react'
import DisplayNameSettingDrawerPage from './DisplayNameSettingDrawerPage'

interface Iprops {
  toUserId: string
  userId: string
}

const InfoSettingDrawerPage = (props: Iprops) => {
  const { toUserId, userId } = props
  const { displayNameDrawerVisible } = useMessageListModel()
  const [muteIsLoading, setMuteIsLoading] = useState(false)
  const [rejectIsLoading, setRejectIsLoading] = useState(false)

  const { reject, mute, user } = useContactMeta(toUserId)

  return (
    <div className="w-screen">
      <Navbar
        leftArrow
        onLeftArrowClick={() => {
          setInfoSettingDrawerVisible(false)
        }}
      >
        Info
      </Navbar>
      <div className="p-4 flex flex-col gap-4">
        <div className="px-4 py-3 bg-(--grayscale-black-06) rounded-xl gap-1">
          <div className="flex justify-between" onClick={() => setDisplayNameDrawerVisible(true)}>
            <Text size="body1" strong>
              Display name
            </Text>
            <Icon icon="x:ArrowRight01StyleStroke" />
          </div>
          <Text size="body2" emphasis={1}>
            {user?.remarkName || ''}
          </Text>
        </div>
        <div className="bg-(--grayscale-black-06) rounded-xl">
          <div className="px-4 py-3 flex justify-between">
            <Text size="body1" strong>
              Mute
            </Text>
            <Switch
              checked={mute}
              onCheckedChange={async (v) => {
                if (muteIsLoading) return
                setMuteIsLoading(true)
                await chatListHandleMute(userId, toUserId, v)
                setMuteIsLoading(false)
              }}
            />
          </div>
          <Divider level={1} />
          <div className="px-4 py-3 flex justify-between">
            <Text size="body1" strong>
              Reject
            </Text>
            <Switch
              checked={reject}
              onCheckedChange={async (v) => {
                if (rejectIsLoading) return
                setRejectIsLoading(true)
                await chatListHandleReject(userId, toUserId, v)
                setRejectIsLoading(false)
              }}
            />
          </div>
        </div>
      </div>
      <Drawer
        open={displayNameDrawerVisible}
        onOpenChange={setDisplayNameDrawerVisible}
        direction="right"
        handleSlot={false}
        closeSlot={false}
        header={false}
        footer={false}
        nested
        className="max-w-[100vw] !w-[100vw]"
      >
        {displayNameDrawerVisible && (
          <div className="max-w-[100vw] !w-[100vw]">
            <DisplayNameSettingDrawerPage userId={userId} toUserId={toUserId} />
          </div>
        )}
      </Drawer>
    </div>
  )
}
export default InfoSettingDrawerPage
