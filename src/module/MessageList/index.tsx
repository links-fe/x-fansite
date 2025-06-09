import React, { useEffect, useRef, useState } from 'react'
import MessageInput from './MessageInput'
import MessageTools from './MessageTools'
import Div100vh from 'react-div-100vh'
import { getActiveContactId } from '@/models/message'
import { getActiveAccountId } from '@/models/user'
import { setChatInfoByUserIdApi } from '@/models/chat'
import { setActiveContactId } from '@/models/message/model'
import InfoSettingDrawer from './Drawer/InfoSettingDrawer'
import MessageListView from './MessageListView'
import { refreshMessageListStoreState } from '@/models/message'
import { useParams } from 'next/navigation'
import MessagePageHeader from './MessagePageHeader'
import ResendMessageDrawer from './Drawer/ResendMessageDrawer'
import UnSendMessageDrawer from './Drawer/UnSendMessageDrawer'
import DeleteMessageDrawer from './Drawer/DeleteMessageDrawer'
import ReportMessageDrawer from './Drawer/ReportMessageDrawer'
import MediaHistoryDrawer from './Drawer/MediaHistoryDrawer'
import { Toaster } from 'sonner'

function MessageList() {
  const { id: toUserId } = useParams<{ id: string }>() || {}
  const [getChatInfoLoading, setGetChatInfoLoading] = useState(true)
  const userId = getActiveAccountId()!

  useEffect(() => {
    onMessageListEnter()
    return () => {
      onMessageListLeave()
    }
  }, [toUserId])

  const onMessageListEnter = async () => {
    if (!toUserId) return
    setActiveContactId(toUserId)
    setChatInfoByUserIdApi(userId, toUserId)
      .catch(() => {})
      .finally(() => {
        setGetChatInfoLoading(false)
      })
    // 进入页面，将缓存的数据还原消息列表中
    refreshMessageListStoreState(userId, toUserId)
  }

  const onMessageListLeave = () => {
    if (!toUserId) return
    setActiveContactId('')
  }
  if (!toUserId) return <div>Please select chat</div>
  if (getChatInfoLoading || !userId) return <></>
  if (toUserId !== getActiveContactId()) return <></>
  return <MessageListContent toUserId={toUserId} />
}

function MessageListContent({ toUserId }: { toUserId: string }) {
  const userId = getActiveAccountId()!
  const chatListRef = useRef<HTMLDivElement>(null)

  return (
    <Div100vh className="flex flex-col flex-3 overflow-hidden">
      <MessagePageHeader toUserId={toUserId} userId={userId} />
      <div className="flex flex-col flex-1 overflow-hidden ">
        <MessageListView userId={userId} toUserId={toUserId} chatListRef={chatListRef} />
        <div className="z-999 pt-2 bg-(--always-white-emphasis-00)">
          <MessageInput userId={userId} toUserId={toUserId} chatListRef={chatListRef} />
          <MessageTools userId={userId} toUserId={toUserId} />
        </div>
      </div>
      {/* Info setting drawer */}
      <InfoSettingDrawer userId={userId} toUserId={toUserId} />
      {/* 重发确认弹窗 */}
      <ResendMessageDrawer />
      {/* 撤回消息确认弹窗 */}
      <UnSendMessageDrawer userId={userId} toUserId={toUserId} />
      {/* 删除消息确认弹窗 */}
      <DeleteMessageDrawer userId={userId} toUserId={toUserId} />
      {/* 举报弹窗 */}
      <ReportMessageDrawer userId={userId} toUserId={toUserId} />
      {/* 媒体历史列表弹窗 */}
      <MediaHistoryDrawer userId={userId} toUserId={toUserId} />
      <Toaster position="top-center" richColors />
    </Div100vh>
  )
}

export default MessageList
