import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
// state 每次发生变化都将输出日志
const log = (config: any) => (set: any, get: any, api: any) =>
  config(
    (...args: any) => {
      console.log('x-userInfo  applying', args)
      set(...args)
      console.log('x-userInfo  new state', get())
    },
    get,
    api,
  )

export interface UserInfoState {
  userInfo: any
  setUserInfo: (isSignedIn: boolean) => void
}
export const useAppStore = create<UserInfoState>()(
  log(
    devtools(
      persist(
        immer((set) => ({
          userInfo: null,
          setUserInfo: (userInfo: any) => set({ userInfo }),
          setUserInfoImmerDemo: (v: any) =>
            set((state: UserInfoState) => {
              if (!state.userInfo) {
                state.userInfo = {
                  abc: v,
                }
              } else {
                state.userInfo.abc = v
              }
            }),
        })),
        {
          name: 'x-userInfo',
          storage: createJSONStorage(() => sessionStorage),
        },
      ),
    ),
  ),
)
export const getUserInfo = () => {
  return useAppStore.getState().userInfo
}
export const setUserInfo = (userInfo: any) => {
  useAppStore.setState({ userInfo })
}
