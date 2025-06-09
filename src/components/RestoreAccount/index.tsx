'use client'
import { Text } from '@x-vision/design'
import XButton from '@/components/XButton'
import { postRestoreAccount } from '@/services/setting'
import { showCommonErrorDrawer } from '@/models/abnormalDrawer'
import { postLogout } from '@/services/user'
import { initMeInfo } from '@/models'
import { formatLocalizedDate } from '@/utils'
import { useUserInfo } from '@/models/user'
import { xim } from '@/common/im'
import { xLogger } from '@/common/logger'
const RestoreAccount = () => {
  const userInfo = useUserInfo()
  const handleRestoreAccount = async () => {
    try {
      const res = await postRestoreAccount()
      if (!res?.success) {
        throw res
      }
      await initMeInfo()

      try {
        xim.connect()
      } catch (error) {
        xLogger.error('xim connect error', { error })
      }
    } catch (error: any) {
      console.error('handleRestoreAccount: ', error)
      showCommonErrorDrawer({
        contentTxt: 'There was a problem communicating with X servers.',
      })
    }
  }
  const handleLogout = async () => {
    try {
      const res = await postLogout()
      if (!res?.success) {
        throw res
      }
      console.log('logout success')
    } catch (error) {
      console.error('logout failed', error)
      showCommonErrorDrawer({
        contentTxt: 'There was a problem communicating with X servers.',
      })
    }
  }
  return (
    <div>
      <div className="py-(--sizing-named-micro) px-(--sizing-named-mini) mb-(--sizing-named-small)">
        <Text size="heading3" className="text-(--element-emphasis-00)">
          Restore account
        </Text>
      </div>
      <div className="px-(--sizing-named-small)">
        <Text size="body1" className="text-(--element-emphasis-00) mb-[1em]">
          You requested to delete your account and your account will be permanently deleted on [
          {formatLocalizedDate(Number(userInfo?.closeDate) * 1000)}].{' '}
        </Text>
        <Text size="body1" className="text-(--element-emphasis-00)">
          If you wish to continue using X, please restore your account. Once you choose to restore your account, your
          account will no longer be deleted.{' '}
        </Text>
        <XButton
          type="submit"
          className="w-full h-(--controls-huge-min-height) mt-(--sizing-named-medium)"
          color="primary"
          onClick={handleRestoreAccount}
        >
          Restore account
        </XButton>
        <XButton
          onClick={handleLogout}
          className="w-full h-(--controls-huge-min-height) mt-(--sizing-named-medium)"
          color="primary"
        >
          Cancel
        </XButton>
      </div>
    </div>
  )
}
export default RestoreAccount
