import { Icon } from '@x-vision/icons'
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRoot,
  MenubarSeparator,
  MenubarTrigger,
} from '@x-vision/design'
import { updateChatInputSendData } from '@/models/chat-input-send'
import { isSelfSendMessage } from '@/utils/chat'
import { MessageStatus } from '@/types/tables/message'
import {
  setDeleteMessageDrawerVisible,
  setReportMessageDrawerVisible,
  setResendMessageDrawerVisible,
  setUnsendMessageDrawerVisible,
} from '@/models/message/model'
import { onCopyText } from '@/utils'
import dayjs from 'dayjs'
import { XImChatMessageData } from '@/npm/x-im'
interface Iprops {
  id: string
  messageItemInfo: Partial<XImChatMessageData>
  toUserId: string
  userId: string
  visibleMoreMenu: undefined | string
  setVisibleMoreMenu: (v: undefined | string) => void
  listRef?: React.RefObject<HTMLDivElement | null>
}
function MessageMoreBtn(props: Iprops) {
  const { id, messageItemInfo, toUserId, visibleMoreMenu, setVisibleMoreMenu, listRef } = props
  const isMe = isSelfSendMessage(messageItemInfo.fromId)

  const handleDeleteMessage = () => {
    setDeleteMessageDrawerVisible(true, id)
  }

  const handleWithdrawMessage = () => {
    setUnsendMessageDrawerVisible(true, id)
  }

  const onResendMessage = () => {
    setResendMessageDrawerVisible(true, id)
  }

  const onCopy = () => {
    onCopyText(messageItemInfo.content || '')
  }

  const onReport = () => {
    console.log('report')
    setReportMessageDrawerVisible(true)
  }

  const onReply = () => {
    if (messageItemInfo) {
      updateChatInputSendData(toUserId, {
        replyMsgData: messageItemInfo,
      })
    }
  }

  return (
    <MenubarRoot value={visibleMoreMenu} onValueChange={setVisibleMoreMenu}>
      <MenubarMenu value="more">
        <MenubarTrigger>
          <Icon icon="x:MoreVerticalStyleSolid" />
        </MenubarTrigger>
        <MenubarContent className="w-2" collisionBoundary={listRef?.current}>
          {messageItemInfo.msgType !== undefined &&
            [0, 1].includes(messageItemInfo.msgType) &&
            messageItemInfo.sendStatus === MessageStatus.SENT && (
              <MenubarItem onClick={onReply}>
                <Icon icon="x:LinkForwardStyleStroke" />
                Reply
              </MenubarItem>
            )}
          {isMe &&
            messageItemInfo.sendStatus === MessageStatus.SENT &&
            // 判断不是 付费消息并且解锁
            !(
              ((messageItemInfo.price && messageItemInfo.price > 0) || !messageItemInfo.free) &&
              messageItemInfo.unlock
            ) &&
            dayjs().isBefore(dayjs(messageItemInfo?.gmtCreate).add(24, 'hour')) && (
              <MenubarItem onClick={handleWithdrawMessage}>
                <Icon icon="x:ArrowTurnDownStyleStroke" />
                Unsend
              </MenubarItem>
            )}
          {messageItemInfo.sendStatus === MessageStatus.FAILED && (
            <MenubarItem onClick={onResendMessage}>
              <Icon icon="x:Exchange01StyleStroke" />
              Resend
            </MenubarItem>
          )}
          {messageItemInfo.content && (
            <MenubarItem onClick={onCopy}>
              <Icon icon="x:Copy01StyleStroke" />
              Copy
            </MenubarItem>
          )}
          {!isMe && messageItemInfo.sendStatus === MessageStatus.SENT && (
            <MenubarItem onClick={onReport}>
              <Icon icon="x:Alert02StyleStroke" />
              Report
            </MenubarItem>
          )}
          {messageItemInfo.sendStatus !== MessageStatus.PENDING &&
            (messageItemInfo?.free || !messageItemInfo?.unlock) && (
              <>
                <MenubarSeparator />
                <MenubarItem className="text-(--element-signal-stop-emphasis-00)" onClick={handleDeleteMessage}>
                  <Icon icon="x:Delete01StyleStroke" />
                  Delete for you
                </MenubarItem>
              </>
            )}
        </MenubarContent>
      </MenubarMenu>
    </MenubarRoot>
  )
}

export default MessageMoreBtn
