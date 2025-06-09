'use client'
import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { Input, Text } from '@x-vision/design'
import { Icon } from '@x-vision/icons'
import XButton from '@/components/XButton'
import { runValidEmail } from '@/utils'
import { postSendChangeEmailNew } from '@/services/setting'
import { showCommonErrorDrawer } from '@/models/abnormalDrawer'
import { useUpdate } from 'ahooks'
import { xLogger } from '@/common/logger'
interface Iprops {
  updateNewEmail: (email: string) => void
}
const SetNewEmail = ({ updateNewEmail }: Iprops, ref: any) => {
  const update = useUpdate()
  const [disabledBtn, setDisabledBtn] = useState<boolean>(false)
  const submitLoading = useRef<boolean>(false)
  const updateSumitLoading = (val: boolean) => {
    submitLoading.current = val
    update()
  }
  const [email, setEmail] = useState('')
  const [emailErrMsg, setEmailErrMsg] = useState<string>('')

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value?.trim?.()
    setEmail(inputValue)
  }
  const handleEmailFocus = () => {
    setEmailErrMsg('')
    setDisabledBtn(false)
  }

  const sendChangeEmailNew = async () => {
    try {
      const res = await postSendChangeEmailNew({
        newEmail: email,
      })
      if (!res?.success) {
        throw res
      }
      updateNewEmail(email)
    } catch (error: any) {
      if (error?.code === 100007) {
        // 邮箱格式不正确
        setEmailErrMsg('Incorrect mailbox format')
      } else if (error?.code === 100011) {
        // 邮箱已被注册
        setEmailErrMsg('Email already registered')
      } else if (error?.code === 100009) {
        // 邮件发送频繁
        setEmailErrMsg('Frequent mailings')
      } else {
        showCommonErrorDrawer({
          contentTxt: 'There was a problem communicating with X servers.',
        })
        xLogger.error('change email', {
          detail: 'sendChangeEmailNew postSendChangeEmailNew',
          newEmail: email,
          error,
        })
      }
    }
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
    if (submitLoading.current) return
    setEmailErrMsg('')
    updateSumitLoading(true)
    setDisabledBtn(true)
    await sendChangeEmailNew()
    setDisabledBtn(false)
    updateSumitLoading(false)
  }

  useImperativeHandle(ref, () => ({
    changeInputErrText: (txt: string) => {
      setEmailErrMsg(txt)
    },
  }))
  return (
    <div>
      <Text size="body1" strong className="text-(--typography-text-body1-strong) mb-(--sizing-named-micro)">
        Enter new email
      </Text>
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
      <XButton
        color="primary"
        className="w-full h-(--controls-huge-min-height) mt-(--sizing-named-medium)"
        disabled={!email?.length || disabledBtn}
        onClick={handleSubmit}
      >
        Next
      </XButton>
    </div>
  )
}
export default forwardRef(SetNewEmail)
