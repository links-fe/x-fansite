'use client'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@x-vision/icons'
import { Loading, Drawer, DrawerDescription, DrawerHeader, DrawerTitle } from '@x-vision/design'
import { postLoginByVerifyCode } from '@/services/user'
import { ON_APP_EVENT_LOGIN_SUCCESS } from '@/models/user'
import { useUpdate } from 'ahooks'
import XButton from '@/components/XButton'
import { PostLoginByVerifyCodeErrorMsg } from '@/constants/userHttpErrorCode'
import { hbSendLog } from '@/utils/datadog'
import VerificationCode from '@/components/VerificationCode'
interface IProps {
  visible: boolean
  close: () => void
  email: string
  resendCode: () => void
}
const EmailVerificationCodeDrawer = ({ visible, close, email, resendCode }: IProps) => {
  const update = useUpdate()
  const verificationloading = useRef<boolean>(false)
  const updateVerificationloading = (value: boolean) => {
    verificationloading.current = value
    update()
  }
  const [countDown, setCountDown] = useState<number>(60)
  const [errMsg, setErrMsg] = useState('')
  // const handleCheckEmail = () => {
  //   window.open('mailto:')
  // }
  const handleVerificationCodeComplete = async (value: string) => {
    console.log('handleVerificationCodeComplete value: ', value)
    if (verificationloading.current) {
      return
    }
    updateVerificationloading(true)
    try {
      const res: any = await postLoginByVerifyCode({
        verifyCode: value,
        email,
      })
      if (!res?.userId) {
        throw res
      }
      ON_APP_EVENT_LOGIN_SUCCESS()
      setErrMsg('')
      close?.()
    } catch (error: any) {
      //@ts-expect-error 忽略类型错误
      const msg = PostLoginByVerifyCodeErrorMsg[error?.code]
      setErrMsg(msg || 'Verification code is incorrect')
      hbSendLog({
        message: 'Login Registration postLoginByVerifyCode error',
        status: 'error',
        data: {
          verifyCode: value,
          email,
        },
        error,
      })
    } finally {
      updateVerificationloading(false)
    }
  }
  useEffect(() => {
    if (!visible) {
      setCountDown(60)
      setErrMsg('')
      updateVerificationloading(false)
      return
    }
    if (countDown > 0) {
      const timer = setTimeout(() => {
        setCountDown((count) => count - 1)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [visible, countDown])
  const verificationCodeRef = useRef<any>(null)
  const handleResendCode = async () => {
    setCountDown(60)
    setErrMsg('')
    await resendCode()
    verificationCodeRef.current?.clear()
  }

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
        <div className="mt-(--sizing-named-medium) flex items-center justify-center text-(--element-emphasis-01) typography-text-body2-base">
          Didn’t receive?
          <XButton onClick={handleResendCode} className="ml-(--sizing-named-small)">
            Resend code
          </XButton>
        </div>
      )
    }
    return (
      <div className="mt-(--sizing-named-medium) text-(--element-emphasis-01) typography-text-body2-base text-center">
        Didn’t receive? Resend code in {countDown}s
      </div>
    )
  }

  return (
    <Drawer
      title="Basic Drawer"
      open={visible}
      onOpenChange={close}
      className="mx-auto w-full max-w-lg h-[316px]"
      dismissible={false}
      repositionInputs={true}
    >
      {visible && (
        <>
          <div className="mt-(--sizing-named-micro) pt-(--sizing-named-small) pb-(--sizing-named-large) h-full px-(--sizing-named-small)">
            <div className="text-(--element-emphasis-00) typography-text-body1-base mb-(--sizing-named-medium) text-center break-words">
              Enter the verification code sent to {email}.
            </div>
            <div className="flex align-center justify-center">
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

            {/* TODO: 桌面用 Sniper Link https://growth.design/sniper-link    mobile 隐藏。 */}
            {/* <div className="flex align-center justify-center mt-(--sizing-named-large)">
              <XButton
                className="text-(--element-emphasis-00)"
                style={{ font: 'var(--typography-text-body2-strong) !important' }}
                onClick={handleCheckEmail}
              >
                Check my email
              </XButton>
            </div> */}
          </div>
        </>
      )}
    </Drawer>
  )
}
export default EmailVerificationCodeDrawer
