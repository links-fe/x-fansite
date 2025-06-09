'use client'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@x-vision/icons'
import { Loading, Text } from '@x-vision/design'
import VerificationCode from '@/components/VerificationCode'
import XButton from '@/components/XButton'
import {
  postChangeEmail,
  postSendChangeEmailNew,
  postSendChangeEmailOld,
  postVerifyChangeEmailOldCode,
} from '@/services/setting'
import { showCommonErrorDrawer } from '@/models/abnormalDrawer'
import { useUpdate } from 'ahooks'
import ChangeSuccessDrawer from './ChangeSuccessDrawer'
import { initMeInfo } from '@/models'
import { xLogger } from '@/common/logger'
import { encryptEmail } from '@/utils'
interface Iprops {
  email: string
  isOldEmail: boolean
  oldCode?: string | number
  codeVerificationEnd: (code: string) => void
}
const VerificationEmail = ({ email, isOldEmail, oldCode, codeVerificationEnd }: Iprops) => {
  const update = useUpdate()
  const verificationCodeRef = useRef<any>(null)
  const verificationloading = useRef<boolean>(false)
  const updateVerificationloading = (value: boolean) => {
    verificationloading.current = value
    update()
  }
  const [countDown, setCountDown] = useState<number>(60)
  const [errMsg, setErrMsg] = useState('')

  const sendChangeEmailNew = async () => {
    try {
      const res = await postSendChangeEmailNew({
        newEmail: email,
      })
      if (!res?.success) {
        throw res
      }
      await initMeInfo()
    } catch (error: any) {
      let msg = 'There was a problem communicating with X servers.'
      if (error?.code === 100007) {
        // 邮箱格式不正确
        msg = 'Incorrect mailbox format'
      } else if (error?.code === 100011) {
        // 邮箱已被注册
        msg = 'Email already registered'
      } else if (error?.code === 100009) {
        // 邮件发送频繁
        msg = 'Frequent mailings'
      } else {
        xLogger.error('change email error', {
          detail: 'sendChangeEmailNew postSendChangeEmailNew',
          newEmail: email,
          error,
        })
      }
      showCommonErrorDrawer({
        contentTxt: msg,
      })
    }
  }
  const sendChangeEmailOld = async () => {
    try {
      const res = await postSendChangeEmailOld()
      if (!res?.success) {
        throw res
      }
    } catch (error: any) {
      let msg = 'There was a problem communicating with X servers.'
      if (error?.code === 100009) {
        // 邮件发送频繁
        msg = 'Frequent mailings'
      } else {
        xLogger.error('change email error', { detail: 'sendChangeEmailOld postSendChangeEmailOld', error })
      }
      showCommonErrorDrawer({
        contentTxt: msg,
      })
    }
  }
  const sendEmailCode = () => {
    if (isOldEmail) {
      sendChangeEmailOld()
    } else {
      sendChangeEmailNew()
    }
  }

  const handleResendCode = async () => {
    setCountDown(60)
    setErrMsg('')
    await sendEmailCode()
    verificationCodeRef.current?.clear()
  }

  const verifyChangeEmailOldCode = async (code: string) => {
    if (!isOldEmail) return false
    try {
      const res = await postVerifyChangeEmailOldCode({
        oldCode: code,
      })
      if (!res?.success) {
        throw res
      }
      return true
    } catch (error: any) {
      if (error?.code === 100006) {
        // 验证码错误或者失效
        setErrMsg('Captcha is wrong or invalid')
      } else {
        showCommonErrorDrawer({
          contentTxt: 'There was a problem communicating with X servers.',
        })
        xLogger.error('change email error', {
          detail: 'verifyChangeEmailOldCode postVerifyChangeEmailOldCode',
          oldCode: code,
          error,
        })
      }
    }
    return false
  }
  const handleSetNewEmail = async (value: string) => {
    if (isOldEmail) return false
    try {
      const res = await postChangeEmail({
        oldCode: oldCode as string,
        newCode: value,
        newEmail: email,
      })
      if (!res?.success) {
        throw res
      }
      setshowChangeSuccessDrawer(true)
      return true
    } catch (error: any) {
      if (error?.code === 100007) {
        // 邮箱格式错误
        setErrMsg('Mailbox format error')
      } else if (error?.code === 100011) {
        // 该邮箱已经注册
        setErrMsg('This e-mail address is already registered')
      } else if (error?.code === 100006) {
        // 验证码错误或者失效
        setErrMsg('Captcha is wrong or invalid')
      } else {
        showCommonErrorDrawer({
          contentTxt: 'There was a problem communicating with X servers.',
        })
        xLogger.error('change email error', {
          detail: 'handleSetNewEmail postChangeEmail',
          oldCode: oldCode as string,
          newCode: value,
          newEmail: email,
          error,
        })
      }
    }
    return false
  }
  const handleVerificationCodeComplete = async (value: string) => {
    console.log('handleVerificationCodeComplete value: ', value)
    if (!value) return
    if (verificationloading.current) {
      return
    }
    updateVerificationloading(true)
    let result = false
    if (isOldEmail) {
      result = await verifyChangeEmailOldCode(value)
    } else {
      result = await handleSetNewEmail(value)
    }
    if (result) {
      codeVerificationEnd(value)
    }
    updateVerificationloading(false)
  }

  const [showChangeSuccessDrawer, setshowChangeSuccessDrawer] = useState<boolean>(false)
  const closeChangeSuccessDrawer = () => {
    setshowChangeSuccessDrawer(false)
  }

  useEffect(() => {
    if (!email || !isOldEmail) return
    sendChangeEmailOld()
  }, [email, isOldEmail])
  useEffect(() => {
    if (countDown > 0) {
      const timer = setTimeout(() => {
        setCountDown((count) => count - 1)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [countDown])
  useEffect(() => {
    return () => {
      setCountDown(60)
      setErrMsg('')
      updateVerificationloading(false)
      closeChangeSuccessDrawer()
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
  return (
    <div>
      <div>
        <Text size="body1" className="text-(--element-emphasis-00)">
          Enter the verification code sent to
        </Text>
        <Text size="body1" className="text-(--element-emphasis-00)">
          {encryptEmail(email)}.
        </Text>
      </div>

      <div className="mt-(--sizing-named-large) flex justify-center">
        <VerificationCode onComplete={handleVerificationCodeComplete} ref={verificationCodeRef}></VerificationCode>
      </div>

      {errMsg && (
        <div className="flex items-center justify-center mt-(--sizing-named-small) text-(--element-spectrum-saffron-emphasis-00) typography-text-body1-base">
          <Icon icon="x:Alert02StyleStroke" color="currentColor" />
          <span className="ml-(--sizing-named-micro)">{errMsg}</span>
        </div>
      )}
      {renderResendCode()}

      <ChangeSuccessDrawer visible={showChangeSuccessDrawer} close={closeChangeSuccessDrawer}></ChangeSuccessDrawer>
    </div>
  )
}
export default VerificationEmail
