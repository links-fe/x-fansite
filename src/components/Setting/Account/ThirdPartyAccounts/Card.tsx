'use client'
import { Icon } from '@x-vision/icons'
import { Text } from '@x-vision/design'
import XButton from '@/components/XButton'
import { useRef } from 'react'
import { IqueryThirdAccountsRes, postLinkGoogleAccounts } from '@/services/setting'
import { useUserInfo } from '@/models/user'
import { showCommonErrorDrawer } from '@/models/abnormalDrawer'
import { useGoogleAuthLogin } from '@/npm/x-google-auth-login'
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI, GOOGLE_SCOPE } from '@/constants'
import { xLogger } from '@/common/logger'
interface Iprops {
  data: IqueryThirdAccountsRes | undefined
  openSetPasswordDrawer: ({ id }: { id: number }) => void
  unlinkThirdAccounts: (id?: number) => void
  updateList: () => void
}
const ThirdPartyAccountsCard = ({ data, openSetPasswordDrawer, unlinkThirdAccounts, updateList }: Iprops) => {
  const { googleLoginBtnLoading, googleLogin } = useGoogleAuthLogin({
    googleClientId: GOOGLE_CLIENT_ID,
    googleRedirectPath: GOOGLE_REDIRECT_URI,
    googleAuthScope: GOOGLE_SCOPE,
    onSuccess: async (data) => {
      console.log('googleAuthLogin data: ', data)
      try {
        const res = await postLinkGoogleAccounts({
          googleCode: data?.code,
          redirectUrl: window.location.origin + GOOGLE_REDIRECT_URI,
        })
        if (!res?.success) {
          throw res
        }
        await updateList()
      } catch (error: any) {
        if (error?.code === 100010) {
          // 谷歌授权失败
          showCommonErrorDrawer({
            contentTxt: 'Google authorization failed.',
          })
        } else if (error?.code === 100018) {
          // 该谷歌账户已连接其他账户
          showCommonErrorDrawer({
            contentTxt: 'This Google account is already connected to another account.',
          })
        } else {
          showCommonErrorDrawer({
            contentTxt: 'There was a problem communicating with X servers.',
          })
        }
        xLogger.error('third party accounts error', {
          detail: 'ThirdPartyAccountsCard useGoogleAuthLogin onSuccess postLinkGoogleAccounts',
          googleCode: data?.code,
          redirectUrl: window.location.origin + GOOGLE_REDIRECT_URI,
          error,
        })
      }
    },
    onError: (error: any) => {
      console.error('googleAuthLogin error: ', error)
      showCommonErrorDrawer({
        contentTxt: 'There was a problem logging you in with Google.',
      })
      xLogger.error('third party accounts error', {
        detail: 'ThirdPartyAccountsCard useGoogleAuthLogin onError',
        redirectUrl: window.location.origin + GOOGLE_REDIRECT_URI,
        error,
      })
    },
  })
  const userInfo = useUserInfo()
  const deleteLoading = useRef<boolean>(false)
  const handleDelete = async () => {
    if (!data?.thirdAccountId) {
      return
    }
    if (deleteLoading.current) {
      return
    }
    deleteLoading.current = true
    if (!userInfo?.hasPassword) {
      openSetPasswordDrawer({ id: data?.thirdAccountId })
    } else {
      await unlinkThirdAccounts(data?.thirdAccountId)
    }
    deleteLoading.current = false
  }
  return (
    <div className="mt-(--sizing-named-small)">
      {data?.email ? (
        <div className="p-(--sizing-named-mini) rounded-(--surface-01-radius) bg-(--surface-level-00-emphasis-00)">
          <div className="flex justify-between mb-(--sizing-named-micro)">
            <div className="flex items-center justify-center">
              <Icon icon="x:LogosGoogleSquareColor" fontSize={24} />
              <Text size="body1" strong className="text-(--element-emphasis-00) ml-(--sizing-named-mini)">
                Google
              </Text>
            </div>
            <div className="flex items-center">
              <Text size="body1" className="text-(--element-signal-go-emphasis-00)">
                Connected
              </Text>
              <div className="w-(--primitives-divider-thickness) h-[28px] bg-(--surface-level-02-emphasis-00) mx-(--sizing-named-mini)"></div>
              <div
                onClick={handleDelete}
                className="w-(--controls-moderate-min-width) h-(--controls-moderate-min-height) rounded-[50%] flex justify-center items-center bg-(--surface-level-02-emphasis-00)"
              >
                <Icon icon="x:Delete01StyleStroke" fontSize={16} />
              </div>
            </div>
          </div>

          <Text size="body1" className="text-(--element-emphasis-00) mb-(--sizing-named-micro)">
            You have connected the following account
          </Text>
          <Text size="body1" strong className="text-(--element-emphasis-00) pb-(--sizing-named-small)">
            {data?.email}
          </Text>
        </div>
      ) : (
        <div className="p-(--sizing-named-mini) flex items-center justify-between rounded-(--surface-01-radius) bg-(--surface-level-00-emphasis-00)">
          <div className="flex items-center justify-center">
            <Icon icon="x:LogosGoogleSquareColor" fontSize={24} />
            <Text size="body1" strong className="text-(--element-emphasis-00) ml-(--sizing-named-mini)">
              Google
            </Text>
          </div>
          <XButton color="primary" onClick={googleLogin} loading={googleLoginBtnLoading}>
            Connect
          </XButton>
        </div>
      )}
    </div>
  )
}
export default ThirdPartyAccountsCard
