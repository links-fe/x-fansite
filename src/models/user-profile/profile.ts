import { getApiAccountSettingMyProfile } from '@/services/setting'
import { create } from 'zustand'

export interface IMyProfile {
  /** username */
  userName: string
  /** 昵称 */
  nickName: string
  /** 简介 */
  bio: string
  /** 位置 */
  location: string
  /** 头像 */
  headImgUrl: string
  /** 背景图 */
  backgroundImgUrl: string
  /** username是否能修改 */
  userNameEditEnabled: boolean
}

const createCommonState = () => ({
  initialized: false,
  loading: false,
  error: null as any,
})

const createDefaultMyProfile = (): IMyProfile => ({
  nickName: '',
  userName: '',
  headImgUrl: '',
  backgroundImgUrl: '',
  bio: '',
  location: '',
  userNameEditEnabled: false,
})

export const useMyProfileStore = create(() => ({
  ...createDefaultMyProfile(),
  ...createCommonState(),
}))

/** 从接口中拉取profile */
export const fetchMyProfile = async () => {
  try {
    useMyProfileStore.setState({ loading: true })
    const res = await getApiAccountSettingMyProfile()
    if (!res) return
    useMyProfileStore.setState({ ...res, initialized: true })
  } catch (error) {
    useMyProfileStore.setState({ error })
  } finally {
    useMyProfileStore.setState({ loading: false })
  }
}

/** 更新profile */
export const updateMyProfile = (data: Partial<IMyProfile>) => {
  useMyProfileStore.setState({ ...data })
}
