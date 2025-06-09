import { create } from 'zustand'
const btnDefaultTxt = 'Try again later'
interface CommonErrorDrawerDataState {
  visible?: boolean
  contentTxt?: string
  btnTxt?: string
}
interface AbnormalDrawerState {
  commonErrorDrawerData: CommonErrorDrawerDataState
  noUserAbnormalVisible: boolean
}
export const useAbnormalDrawerStore = create<AbnormalDrawerState>(() => ({
  commonErrorDrawerData: {
    visible: false,
    contentTxt: '',
    btnTxt: btnDefaultTxt,
  },
  noUserAbnormalVisible: false,
}))
export const useNoUserAbnormalVisible = () => {
  return useAbnormalDrawerStore((state) => state.noUserAbnormalVisible)
}
export const showNoUserAbnormalDrawer = () => {
  useAbnormalDrawerStore.setState({ noUserAbnormalVisible: true })
}
export const hideNoUserAbnormalDrawer = () => {
  useAbnormalDrawerStore.setState({ noUserAbnormalVisible: false })
}

export const useCommonErrorDrawerData = () => {
  return useAbnormalDrawerStore((state) => state.commonErrorDrawerData)
}
export const showCommonErrorDrawer = ({ contentTxt, btnTxt = btnDefaultTxt }: CommonErrorDrawerDataState) => {
  useAbnormalDrawerStore.setState({
    commonErrorDrawerData: { visible: true, contentTxt, btnTxt },
  })
}
export const hideCommonErrorDrawer = () => {
  useAbnormalDrawerStore.setState({
    commonErrorDrawerData: { visible: false, contentTxt: '', btnTxt: btnDefaultTxt },
  })
}
