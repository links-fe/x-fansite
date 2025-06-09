'use client'
import XButton from '@/components/XButton'
import { PostForgotPasswordEmailErrorMsg } from '@/constants/userHttpErrorCode'
import { showCommonErrorDrawer } from '@/models/abnormalDrawer'
import { postForgotPasswordEmail } from '@/services/user'
import { classMerge } from '@/utils'
import { hbSendLog } from '@/utils/datadog'
import { Icon } from '@x-vision/icons'
import React, { useEffect, useState } from 'react'
interface Iprops {
  className?: string
  visible: boolean
  close: () => void
  email: string
  backLogin: () => void
}
const CheckYourEmail = ({ className, visible, close, email, backLogin }: Iprops) => {
  const [countDown, setCountDown] = useState<number>(60)
  useEffect(() => {
    if (!visible) {
      setCountDown(60)
      return
    }
    if (countDown > 0) {
      const timer = setTimeout(() => {
        setCountDown((count) => count - 1)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [visible, countDown])
  const handleResetSendEmail = async () => {
    // 去除 ticket 和 email 参数
    const url = new URL(window.location.href)
    url.searchParams.delete('ticket')
    url.searchParams.delete('email')
    const newUrl = url.toString()
    try {
      const res = await postForgotPasswordEmail({
        toEmail: email?.trim?.(),
        forgotPasswordUrl: newUrl,
      })
      if (!res?.success) {
        throw res
      }
      setCountDown(60)
    } catch (error: any) {
      console.error('postForgotPasswordEmail error: ', error)
      //@ts-expect-error 忽略类型错误
      const msg = PostForgotPasswordEmailErrorMsg[error?.code]
      showCommonErrorDrawer({
        contentTxt: msg || 'There was a problem communicating with X servers.',
      })
      hbSendLog({
        message: 'Login Registration ForgotPassword CheckYourEmail postForgotPasswordEmail error',
        status: 'error',
        data: {
          toEmail: email?.trim?.(),
          forgotPasswordUrl: newUrl,
        },
        error,
      })
    }
  }
  const renderResendCode = () => {
    if (countDown <= 0) {
      return (
        <div className="flex items-center justify-center text-(--element-emphasis-01) typography-text-body2-base">
          Didn’t receive?
          <XButton onClick={handleResetSendEmail} className="ml-(--sizing-named-small)">
            Resend it now
          </XButton>
        </div>
      )
    }
    return (
      <div className="text-(--element-emphasis-01) typography-text-body2-base text-center">
        Didn’t receive? Resend in {countDown}s
      </div>
    )
  }
  if (!visible) {
    return null
  }
  return (
    <div
      className={classMerge(
        'bg-(--surface-level-01-emphasis-opaque-00) py-(--sizing-named-micro) px-(--sizing-named-mini)',
        className,
      )}
    >
      <div className="p-(--control-generous-padding-both) mb-(--sizing-named-small)">
        <Icon icon="x:ArrowLeft02StyleSolid" fontSize={20} onClick={close} />
      </div>

      <div className="text-(--element-emphasis-00) typography-text-heading1-strong mb-(--sizing-named-medium)">
        Check your email
      </div>

      <div className="text-(--element-emphasis-00) typography-text-body1-base mb-(--sizing-named-medium)">
        If your email address is registered, you will receive an email containing a link to reset the password.
        <br />
        <br />
        It may take a few minutes for the email to arrive. Remember to check your spam or junk folders.
      </div>

      <XButton
        color="primary"
        className="w-full h-(--controls-huge-min-height) mb-(--sizing-named-medium)"
        style={{ font: 'var(--typography-text-body1-strong) !important' }}
        onClick={backLogin}
      >
        Back to login
      </XButton>

      {/* <div className="flex justify-center items-center">
        <XButton
          className="text-(--element-emphasis-00)"
          style={{ font: 'var(--typography-text-body2-strong) !important' }}
          onClick={handleResetSendEmail}
          disabled={disabledReSendBtn}
        >
          Didn’t receive the email? Resend it now
        </XButton>
      </div> */}
      {renderResendCode()}
    </div>
  )
}
export default CheckYourEmail
