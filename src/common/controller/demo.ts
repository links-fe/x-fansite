import { ChatControllers } from '.'

export const setChatUnreadCountUnRead = async () => {
  const token = ChatControllers.unread.createToken()
  // 异步操作
  await new Promise((resolve) => setTimeout(resolve, 1000))
  if (!ChatControllers.unread.isValid(token)) return
  // setState操作
}
