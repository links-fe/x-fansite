import { create } from 'zustand'

interface IMessageListModel {
  activeContactId?: string
  shouldMessageListMount: boolean
  // 信息设置弹窗是否可见
  infoSettingDrawerVisible: boolean
  // 修改昵称弹窗是否可见
  displayNameDrawerVisible: boolean
  // 重发消息弹窗是否可见
  resendMessageDrawerVisible: boolean
  resendMessageId?: string
  // 撤回消息弹窗是否可见
  unsendMessageDrawerVisible: boolean
  unsendMessageId?: string
  // 删除消息弹窗是否可见
  deleteMessageDrawerVisible: boolean
  deleteMessageId?: string
  // 媒体历史弹窗是否可见
  mediaHistoryDrawerVisible: boolean
  // 举报弹窗是否可见
  reportMessageDrawerVisible: boolean
  // 聊天列表中返回底部按钮是否可见
  messageListBackBottomVisible: boolean
}

export const useMessageListModel = create<IMessageListModel>(() => ({
  activeContactId: undefined,
  shouldMessageListMount: true,
  infoSettingDrawerVisible: false,
  displayNameDrawerVisible: false,
  resendMessageDrawerVisible: false,
  unsendMessageDrawerVisible: false,
  deleteMessageDrawerVisible: false,
  mediaHistoryDrawerVisible: false,
  reportMessageDrawerVisible: false,
  messageListBackBottomVisible: false,
}))

export const setActiveContactId = (contactId: string) => {
  useMessageListModel.setState({
    activeContactId: contactId,
  })
}

export const setShouldMessageListMount = (shouldMount: boolean) => {
  useMessageListModel.setState({
    shouldMessageListMount: shouldMount,
  })
}

export const getActiveContactId = () => {
  return useMessageListModel.getState().activeContactId
}

export const setInfoSettingDrawerVisible = (visible: boolean) => {
  useMessageListModel.setState({
    infoSettingDrawerVisible: visible,
  })
}

export const setDisplayNameDrawerVisible = (visible: boolean) => {
  useMessageListModel.setState({
    displayNameDrawerVisible: visible,
  })
}

export const setResendMessageDrawerVisible = (visible: boolean, id?: string) => {
  useMessageListModel.setState({
    resendMessageDrawerVisible: visible,
    resendMessageId: id,
  })
}

export const setUnsendMessageDrawerVisible = (visible: boolean, id?: string) => {
  useMessageListModel.setState({
    unsendMessageDrawerVisible: visible,
    unsendMessageId: id,
  })
}

export const setDeleteMessageDrawerVisible = (visible: boolean, id?: string) => {
  useMessageListModel.setState({
    deleteMessageDrawerVisible: visible,
    deleteMessageId: id,
  })
}

export const setMediaHistoryDrawerVisible = (visible: boolean) => {
  useMessageListModel.setState({
    mediaHistoryDrawerVisible: visible,
  })
}

export const setReportMessageDrawerVisible = (visible: boolean) => {
  useMessageListModel.setState({
    reportMessageDrawerVisible: visible,
  })
}

export const setMessageListBackBottomVisible = (visible: boolean) => {
  useMessageListModel.setState({
    messageListBackBottomVisible: visible,
  })
}
