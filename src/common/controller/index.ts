import { AsyncController } from './AsyncController'

// 统一管理所有的控制器
export const ChatControllers = {
  // 未读状态控制器
  unread: new AsyncController(),
  // 静音状态控制器
  mute: new AsyncController(),
  // 消息发送控制器
  message: new AsyncController(),
  // 可以添加更多控制器...
} as const
