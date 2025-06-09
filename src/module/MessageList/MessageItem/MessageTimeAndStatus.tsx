import { XImChatMessageData } from '@/npm/x-im'
import { MessageStatus } from '@/types/tables/message'
import { Loading, Text } from '@x-vision/design'
import { Icon } from '@x-vision/icons'
import { useEffect, useRef, useState } from 'react'

interface IProps {
  messageItemInfo: Partial<XImChatMessageData>
  timeShow: boolean
}

function MessageTimeAndStatus(props: IProps) {
  const { timeShow, messageItemInfo } = props
  const [loading, setLoading] = useState(false)

  const time = useRef<NodeJS.Timeout>(null)

  useEffect(() => {
    // 实现发送消息3秒后展示loading状态
    if (messageItemInfo?.sendStatus === MessageStatus.PENDING) {
      time.current = setTimeout(() => {
        setLoading(true)
      }, 3000)
    } else {
      setLoading(false)
      if (time.current) {
        clearTimeout(time.current)
      }
    }

    return () => {
      setLoading(false)
      if (time.current) {
        clearTimeout(time.current)
      }
    }
  }, [messageItemInfo?.sendStatus])

  // 时间显示规则
  function formatTimestamp(timestamp: number): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      hourCycle: 'h12',
    })
      .format(new Date(timestamp))
      .replace('AM', 'am')
      .replace('PM', 'pm')
  }

  if (loading) return <Loading />

  const timeRender = messageItemInfo?.gmtCreate && (
    <Text size="body2" emphasis={1}>
      {formatTimestamp(messageItemInfo?.gmtCreate)}
    </Text>
  )

  // 发送失败的时间栏
  if (messageItemInfo?.sendStatus === MessageStatus.FAILED) {
    return (
      <div className="flex">
        {timeRender}
        <Icon icon="x:AlertCircleStyleStroke" className="ml-1" fontSize={16} color="rgba(234, 99, 87, 1)" />
      </div>
    )
  }

  // 包含敏感词的时间栏
  if (messageItemInfo?.sendStatus === MessageStatus.CONTAINS_PROHIBITED_WORDS) {
    return (
      <div className="flex">
        {timeRender}
        <Icon icon="x:Alert02StyleStroke" className="ml-1" fontSize={16} color="rgba(234, 99, 87, 1)" />
      </div>
    )
  }

  if (timeShow && messageItemInfo?.gmtCreate) {
    return timeRender
  }

  return null
}

export default MessageTimeAndStatus
