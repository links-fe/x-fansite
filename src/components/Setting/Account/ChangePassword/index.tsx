'use client'
import { useEffect, useRef, useState } from 'react'
import { useUpdate } from 'ahooks'
import { Icon } from '@x-vision/icons'
import { Loading, Text } from '@x-vision/design'
import VerificationCode from '@/components/VerificationCode'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import XButton from '@/components/XButton'
import SetNewPassword from './SetNewPassword'
import { postModifyPasswordVerify, postSendChangePasswordEmail } from '@/services/setting'
import { showCommonErrorDrawer } from '@/models/abnormalDrawer'
import { useUserInfo } from '@/models/user'
import { xLogger } from '@/common/logger'
import { classMerge, encryptEmail } from '@/utils'

interface IProps {
  className?: string
  visible?: boolean
  back?: () => void
}
const ChangePasswordPage = (props: IProps) => {
  const update = useUpdate()
  const userInfo = useUserInfo()
  const verificationloading = useRef<boolean>(false)
  const updateVerificationloading = (value: boolean) => {
    verificationloading.current = value
    update()
  }
  const verificationCodeRef = useRef<any>(null)
  const [countDown, setCountDown] = useState<number>(60)
  const [errMsg, setErrMsg] = useState('')
  const [showSetNewPassword, setShowSetNewPassword] = useState<boolean>(false)
  const [verifyCode, setVerifyCode] = useState<string>('')
  const sendChangePasswordEmail = async () => {
    try {
      const res = await postSendChangePasswordEmail()
      if (!res?.success) {
        throw res
      }
    } catch (error: any) {
      let msg = 'There was a problem communicating with X servers.'
      if (error?.code === 100009) {
        // 邮件发送频繁
        msg = 'Frequent mailings'
      }
      showCommonErrorDrawer({
        contentTxt: msg,
      })
      xLogger.error('change password error', {
        detail: 'sendChangePasswordEmail postSendChangePasswordEmail',
        error,
      })
    }
  }
  const handleVerificationCodeComplete = async (value: string) => {
    console.log('handleVerificationCodeComplete value: ', value)
    setVerifyCode(value)
    if (verificationloading.current) {
      return
    }
    updateVerificationloading(true)
    try {
      const res = await postModifyPasswordVerify({
        verifyCode: value,
      })
      if (!res?.success) {
        throw res
      }
      setShowSetNewPassword(true)
    } catch (error: any) {
      if (error?.code === 100006) {
        // 验证码错误或者失效
        setErrMsg('Captcha is wrong or invalid')
      } else {
        showCommonErrorDrawer({
          contentTxt: 'There was a problem communicating with X servers.',
        })
        xLogger.error('change password error', {
          detail: 'handleVerificationCodeComplete postModifyPasswordVerify',
          verifyCode: value,
          error,
        })
      }
    } finally {
      updateVerificationloading(false)
    }
  }
  const handleResendCode = async () => {
    setCountDown(60)
    setErrMsg('')
    await sendChangePasswordEmail()
    verificationCodeRef.current?.clear()
  }

  useEffect(() => {
    if (countDown > 0) {
      const timer = setTimeout(() => {
        setCountDown((count) => count - 1)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [countDown])

  useEffect(() => {
    sendChangePasswordEmail()
    return () => {
      setCountDown(60)
      setErrMsg('')
      updateVerificationloading(false)
    }
  }, [])

  const renderResendCode = () => {
    if (verificationloading.current) {
      return (
        <div className="mt-(--sizing-named-medium) flex items-center justify-center text-(--element-emphasis-01) typography-text-body2-base">
          <Loading fontSize={28} />
        </div>
      )
    }
    if (countDown <= 0) {
      return (
        <Text size="body2" className="mt-(--sizing-named-large) text-(--element-emphasis-01) text-center">
          Didn’t receive?
          <XButton onClick={handleResendCode} className="ml-(--sizing-named-small)">
            Resend code
          </XButton>
        </Text>
      )
    }
    return (
      <Text size="body2" className="mt-(--sizing-named-large) text-(--element-emphasis-01) text-center">
        Didn’t receive? Resend code in {countDown}s
      </Text>
    )
  }

  if (props?.hasOwnProperty('visible') && !props?.visible) {
    return null
  }

  return (
    <div className={classMerge('w-screen h-screen bg-(--surface-level-01-emphasis-opaque-00)', props?.className)}>
      <PageHeader title="Change password" back={props?.back}></PageHeader>
      <div className="px-(--sizing-named-small)">
        <div className="py-(--sizing-named-small)">
          {showSetNewPassword ? (
            <SetNewPassword verifyCode={verifyCode} backAccountPage={props?.back}></SetNewPassword>
          ) : (
            <>
              <div>
                <Text size="body1" className="text-(--element-emphasis-00)">
                  Enter the verification code sent to
                </Text>
                <Text size="body1" className="text-(--element-emphasis-00)">
                  {encryptEmail(userInfo?.email ?? '')}.
                </Text>
              </div>

              <div className="mt-(--sizing-named-large) flex justify-center">
                <VerificationCode
                  onComplete={handleVerificationCodeComplete}
                  ref={verificationCodeRef}
                ></VerificationCode>
              </div>

              {errMsg && (
                <div className="flex items-center justify-center mt-(--sizing-named-small) text-(--element-spectrum-saffron-emphasis-00) typography-text-body1-base">
                  <Icon icon="x:Alert02StyleStroke" color="currentColor" />
                  <span className="ml-(--sizing-named-micro)">{errMsg}</span>
                </div>
              )}
              {renderResendCode()}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
export default ChangePasswordPage
