import XButton from '@/components/XButton'
import React, { useEffect } from 'react'
import { setInfoSettingDrawerVisible, setMediaHistoryDrawerVisible } from '@/models/message/model'
import { useContactMeta } from '@/models/chat/cache/meta'
import { useOnlineStatus } from '@/models/chat/hooks/useOnlineStatus'
import { Icon } from '@x-vision/icons'
import { Badge, Navbar, Text } from '@x-vision/design'
import { useRouter } from 'next/router'
import { checkCurrentChatNotHasUploaded } from '@/models/chatUploadData'
interface MessagePageHeaderProps {
  toUserId: string
  userId: string
}
function MessagePageHeader(props: MessagePageHeaderProps) {
  const { toUserId, userId } = props
  const router = useRouter()
  const contactMeta = useContactMeta(toUserId)
  const { onlineStatus } = useOnlineStatus(toUserId)
  const gotoHistory = () => {
    setMediaHistoryDrawerVisible(true)
  }

  useEffect(() => {
    const handleBeforePopState = () => {
      const hasUpload = checkCurrentChatNotHasUploaded({ userId, subId: toUserId })
      if (hasUpload) {
        const confirmLeave = window.confirm(
          `You have material being uploaded. If you leave, you'll lose it. Are you sure you want to leave?`,
        )
        if (!confirmLeave) {
          // 阻止浏览器历史记录变化
          window.history.pushState(null, '', router.asPath)
          return false
        }
      }
      return true
    }

    // 监听路由变化事件
    router.beforePopState(handleBeforePopState)

    return () => {
      router.beforePopState(() => true)
    }
  }, [router, userId, toUserId])

  return (
    <div className="fix t-0 z-999 h-(--sizing-named-huge) bg-(--always-white-emphasis-00)">
      <Navbar
        className="fixed my-(--sizing-named-micro) pl-(--sizing-named-mini)"
        style={{ width: '-webkit-fill-available' }}
        leftArrow
        onLeftArrowClick={() => {
          router.back()
        }}
        right={
          <>
            <XButton onClick={gotoHistory} color="primary" variant="text" shape="circle" size="generous">
              <Icon icon="x:ImageHistoryStyleStroke" />
            </XButton>
            <XButton
              onClick={() => {
                setInfoSettingDrawerVisible(true)
              }}
              color="primary"
              variant="text"
              shape="circle"
              size="generous"
            >
              <Icon icon="x:MoreHorizontalStyleSolid" fontSize={20} />
            </XButton>
          </>
        }
      >
        <div className="flex flex-col items-center">
          <div
            style={{ font: 'var(--typography-text-body1-strong)' }}
            className="text-(--element-emphasis-00) flex items-center gap-1"
          >
            <div className=" max-w-[200px] text-ellipsis overflow-hidden">
              {contactMeta?.user?.remarkName || contactMeta?.user?.nickName || contactMeta?.user?.userName}
            </div>
            <div className="text-(--grayscale-black-01) flex items-center ml-1">
              {contactMeta?.reject ? (
                <Icon icon="x:UnavailableStyleSolid" fontSize={16} color="currentColor" />
              ) : contactMeta?.mute ? (
                <Icon icon="x:NotificationOff01StyleStroke" fontSize={16} color="currentColor" />
              ) : null}
            </div>
          </div>
          <div className="flex items-center">
            <Badge shape="dot" color={onlineStatus ? 'go' : undefined} size="small" />
            <Text size="caption3" emphasis={1} strong className="ml-1">
              {/* TODO 等后端给离线时长 */}
              {onlineStatus ? 'Active now' : 'Active 30 minutes ago'}
            </Text>
          </div>
        </div>
      </Navbar>
    </div>
  )
}

export default MessagePageHeader
