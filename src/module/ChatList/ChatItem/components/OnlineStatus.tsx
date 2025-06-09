import { useOnlineStatus } from '@/models/chat/hooks/useOnlineStatus'
import React from 'react'

function OnlineStatus(props: { toUserId: string }) {
  const { toUserId } = props
  const { onlineStatus } = useOnlineStatus(toUserId)
  return (
    <>
      {onlineStatus && (
        <div className="absolute bottom-(--named-nano) right-(--named-nano) size-(--sizing-named-micro) ring-2 ring-white bg-(--light-spectrum-lichen-00) rounded-full" />
      )}
    </>
  )
}

export default OnlineStatus
