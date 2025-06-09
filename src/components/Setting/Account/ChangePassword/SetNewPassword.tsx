'use clinet'
import { useState } from 'react'
import { Text } from '@x-vision/design'
import SetPasswordInput from '@/components/SetPasswordInput'
import useSetPassword from '@/hooks/useSetPassword'
import XButton from '@/components/XButton'
import ExtraSecuityStepDrawer from './ExtraSecuityStepDrawer'
import { postModifyPassword } from '@/services/setting'
import { showCommonErrorDrawer } from '@/models/abnormalDrawer'
import { xLogger } from '@/common/logger'
import ChangeSuccessDrawer from './ChangeSuccessDrawer'
interface Iprops {
  verifyCode: string
  backAccountPage?: () => void
}
const SetNewPassword = ({ verifyCode, backAccountPage }: Iprops) => {
  const { setPasswordInputRef, password, changePassword, updateInputErrText, checkZxcvbn } = useSetPassword()
  const [disabledNext, setDisabledNext] = useState<boolean>(true)
  const [showChangeSuccessDrawer, setShowChangeSuccessDrawer] = useState<boolean>(false)
  const closeChangeSuccessDrawer = () => {
    setShowChangeSuccessDrawer(false)
    setShowExtraSecuityStepDrawer(true)
  }
  const [showExtraSecuityStepDrawer, setShowExtraSecuityStepDrawer] = useState<boolean>(false)
  const closeExtraSecuityStepDrawer = () => {
    setShowExtraSecuityStepDrawer(false)
    backAccountPage?.()
  }
  const changeDisabledNext = (val: boolean) => {
    setDisabledNext(val)
  }
  const handleSetPassword = async () => {
    if (!password || !verifyCode) {
      return
    }
    if (!checkZxcvbn()) {
      return
    }
    try {
      const res = await postModifyPassword({
        password,
        verifyCode,
      })
      if (!res?.success) {
        throw res
      }
      setShowChangeSuccessDrawer(true)
    } catch (error: any) {
      if (error?.code === 100006) {
        //  验证码错误或者失效
        updateInputErrText('Captcha is wrong or invalid')
      } else if (error?.code === 100004) {
        // 密码不符合要求
        updateInputErrText('Password does not meet the requirements')
      } else {
        showCommonErrorDrawer({
          contentTxt: 'There was a problem setting your password.',
        })
        xLogger.error('change password error', { detail: 'handleSetPassword postModifyPassword', verifyCode, error })
      }
    }
  }
  return (
    <div>
      <Text size="body1" strong className="text-(--typography-text-body1-strong)">
        New password
      </Text>
      <SetPasswordInput
        className="mt-(--sizing-named-micro)"
        ref={setPasswordInputRef}
        changeDisabledNext={changeDisabledNext}
        password={password}
        changePassword={changePassword}
      ></SetPasswordInput>
      <XButton
        color="primary"
        className="w-full h-(--controls-huge-min-height) mt-(--sizing-named-medium)"
        style={{ font: 'var(--typography-text-body1-strong) !important' }}
        disabled={disabledNext}
        onClick={handleSetPassword}
      >
        Reset password
      </XButton>

      <ChangeSuccessDrawer visible={showChangeSuccessDrawer} close={closeChangeSuccessDrawer} />
      <ExtraSecuityStepDrawer
        visible={showExtraSecuityStepDrawer}
        close={closeExtraSecuityStepDrawer}
      ></ExtraSecuityStepDrawer>
    </div>
  )
}
export default SetNewPassword
