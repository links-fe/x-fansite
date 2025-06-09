import dayjs from 'dayjs'

// 会话列表时间显示
export const formatChatTime = (time?: number) => {
  if (!time) return ''
  // 一天内的消息
  if (dayjs().diff(dayjs(time), 'day') < 1) {
    return dayjs(time).format('h:mm a')
  }
  // 一天外的消息
  // 如果是昨天 展示yesterday
  if (dayjs().diff(dayjs(time), 'day') === 1) {
    return 'yesterday'
  }
  // 如果是昨天之前 展示具体日期
  return dayjs(time).format('DD-MMM-YYYY')
}
