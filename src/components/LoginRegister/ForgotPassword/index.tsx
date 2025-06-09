'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Icon } from '@x-vision/icons'
import { Input } from '@x-vision/design'
import CheckYourEmail from '@/components/LoginRegister/ForgotPassword/CheckYourEmail'
import { classMerge, runValidEmail } from '@/utils'
import { postForgotPasswordEmail } from '@/services/user'
import { showCommonErrorDrawer } from '@/models/abnormalDrawer'
import { useUpdate } from 'ahooks'
import XButton from '@/components/XButton'
import { PostForgotPasswordEmailErrorMsg } from '@/constants/userHttpErrorCode'
import { hbSendLog } from '@/utils/datadog'
interface Iprops {
  className?: string
  visible: boolean
  close: () => void
}
const ForgotPassword = ({ className, visible, close }: Iprops) => {
  const update = useUpdate()
  const [disabledBtn, setDisabledBtn] = useState<boolean>(false)
  const submitLoading = useRef<boolean>(false)
  const updateSumitLoading = (val: boolean) => {
    submitLoading.current = val
    update()
  }

  // 定义邮箱和密码的状态
  const [email, setEmail] = useState('')
  const [emailErrMsg, setEmailErrMsg] = useState<string>('')
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setEmail(inputValue)
  }
  const handleEmailFocus = () => {
    setEmailErrMsg('')
    setDisabledBtn(false)
  }

  const handleSubmit = async () => {
    console.log('handleSubmit email: ', email)
    if (email?.length < 1) {
      // empty
      setEmailErrMsg('Email is required')
      setDisabledBtn(true)
      return
    }
    if (!runValidEmail(email)) {
      setEmailErrMsg('Please enter a valid email address')
      setDisabledBtn(true)
      return
    }
    updateSumitLoading(true)
    setEmailErrMsg('')
    setDisabledBtn(true)
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
      changeShowCheckYourEmail()
    } catch (error: any) {
      console.error('postForgotPasswordEmail error: ', error)
      //@ts-expect-error 忽略类型错误
      const msg = PostForgotPasswordEmailErrorMsg[error?.code]
      if (msg) {
        setEmailErrMsg(msg)
      } else {
        showCommonErrorDrawer({
          contentTxt: 'There was a problem communicating with X servers.',
        })
      }
      hbSendLog({
        message: 'Login Registration ForgotPassword postForgotPasswordEmail error',
        status: 'error',
        data: {
          toEmail: email?.trim?.(),
          forgotPasswordUrl: newUrl,
        },
        error,
      })
    } finally {
      setDisabledBtn(false)
      updateSumitLoading(false)
    }
  }

  const [showCheckYourEmail, setShowCheckYourEmail] = useState<boolean>(false)
  const changeShowCheckYourEmail = () => {
    setShowCheckYourEmail((v) => !v)
  }

  const handleBackLogin = () => {
    changeShowCheckYourEmail()
    close()
  }

  useEffect(() => {
    if (!visible) {
      setDisabledBtn(false)
      updateSumitLoading(false)
      setEmailErrMsg('')
      setDisabledBtn(false)
      setShowCheckYourEmail(false)
    }
  }, [visible])
  if (!visible) {
    return null
  }
  return (
    <div
      className={classMerge(
        'bg-(--surface-level-01-emphasis-opaque-00) py-(--sizing-named-micro) px-(--sizing-named-mini) relative',
        className,
      )}
    >
      <div className="p-(--control-generous-padding-both) mb-(--sizing-named-small)">
        <Icon icon="x:ArrowLeft02StyleSolid" fontSize={20} onClick={close} />
      </div>

      <div className="mb-(--sizing-named-medium)">
        <div className="text-(--element-emphasis-00) typography-text-heading1-strong mb-(--sizing-named-medium)">
          Forgot password?
        </div>
        <Input
          size="huge"
          type="email"
          placeholder="me@example.com"
          value={email}
          variant={emailErrMsg?.length > 0 ? 'stop' : null}
          onChange={handleEmailChange}
          onFocus={handleEmailFocus}
        />
        {emailErrMsg?.length > 0 && (
          <div className="mt-(--sizing-named-micro) text-(--element-signal-stop-emphasis-00) flex items-center">
            <Icon icon="x:AlertCircleStyleStroke" fontSize={16} />
            <span className="ml-(--sizing-named-micro)">{emailErrMsg}</span>
          </div>
        )}
      </div>

      <div>
        <XButton
          color="primary"
          className="w-full h-(--controls-huge-min-height)"
          style={{ font: 'var(--typography-text-body1-strong) !important' }}
          disabled={!email?.length || disabledBtn}
          onClick={handleSubmit}
        >
          Send password reset link
        </XButton>
      </div>

      <CheckYourEmail
        className="absolute w-screen h-screen top-0 left-0"
        visible={showCheckYourEmail}
        close={changeShowCheckYourEmail}
        email={email}
        backLogin={handleBackLogin}
      ></CheckYourEmail>
    </div>
  )
}
export default ForgotPassword
