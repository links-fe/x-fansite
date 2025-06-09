'use client'
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Drawer, DrawerDescription, DrawerHeader, DrawerTitle } from '@x-vision/design'
import {
  hideResetYourPasswordDrawer,
  showResetYourPasswordDrawer,
  useResetYourPasswordDrawerVisible,
  useUserInfo,
} from '@/models/user'
import useSetPassword from '@/hooks/useSetPassword'
import ResetYourPasswordSucessDrawer from './Success'
import { postResetPassword } from '@/services/user'
import { showCommonErrorDrawer } from '@/models/abnormalDrawer'
import XButton from '@/components/XButton'
import { PostResetPasswordErrorMsg } from '@/constants/userHttpErrorCode'
import useRemoveQueryParams from '@/hooks/useRemoveQueryParams'
import { hbSendLog } from '@/utils/datadog'
import SetPasswordInput from '@/components/SetPasswordInput'

const ResetYourPasswordDrawer = () => {
  const searchParams = useSearchParams()
  const { removeQueryParams } = useRemoveQueryParams()
  const userInfo = useUserInfo()
  const visibleResetYourPasswordDrawer = useResetYourPasswordDrawerVisible()
  const [sucessDrawerVisible, setSucessDrawerVisible] = useState<boolean>(false)
  const changeSucessDrawerVisible = (val: boolean) => {
    setSucessDrawerVisible(val)
    if (!val) {
      handleDrawerOpenChange(false)
    }
  }

  const { setPasswordInputRef, password, changePassword, updateInputErrText, checkZxcvbn } = useSetPassword()

  const [disabledNext, setDisabledNext] = useState<boolean>(true)
  const changeDisabledNext = (val: boolean) => {
    setDisabledNext(val)
  }

  const handleResetPassword = async () => {
    const ticket = searchParams?.get?.('ticket') as string
    const email = searchParams?.get?.('email') as string
    if (!ticket || !email) {
      console.error('resetPassword ticket or email fail', ticket, email)
      hbSendLog({
        message: 'Login Registration ResetYourPasswordDrawer ticket or email fail',
        status: 'error',
        data: {
          ticket,
          email,
        },
      })
      return
    }
    if (userInfo?.email && email !== userInfo?.email) {
      console.error('resetPassword email fail', userInfo?.email, userInfo)
      hbSendLog({
        message: 'Login Registration ResetYourPasswordDrawer email !== userInfo?.email',
        status: 'error',
        data: {
          userEmail: userInfo?.email,
          email,
        },
      })
      return
    }
    if (!checkZxcvbn()) {
      hbSendLog({
        message: 'Login Registration ResetYourPasswordDrawer checkZxcvbn fail',
        status: 'error',
        data: {
          // 设置密码时 不通过强度的密码 （非敏感信息）
          password,
        },
      })
      return
    }
    try {
      const res = await postResetPassword({
        ticket,
        password,
        email,
      })
      if (!res?.success) {
        throw res
      }
      changeSucessDrawerVisible(true)
    } catch (error: any) {
      console.error('postResetPassword error', error)
      //@ts-expect-error 忽略类型错误
      const msg = PostResetPasswordErrorMsg[error?.code]
      if (msg) {
        updateInputErrText(msg)
      } else {
        showCommonErrorDrawer({
          contentTxt: 'There was a problem setting your password.',
        })
      }
      hbSendLog({
        message: 'Login Registration ResetYourPasswordDrawer postResetPassword error',
        status: 'error',
        data: {
          ticket,
          email,
        },
        error,
      })
    }
  }

  const handleCloseAll = () => {
    changeSucessDrawerVisible(false)
  }
  const handleDrawerOpenChange = (val: boolean) => {
    if (val) {
      showResetYourPasswordDrawer()
    } else {
      hideResetYourPasswordDrawer()
      removeQueryParams(['ticket', 'email'])
    }
  }
  return (
    <Drawer
      title="Basic Drawer"
      open={visibleResetYourPasswordDrawer}
      onOpenChange={handleDrawerOpenChange}
      className="mx-auto w-full max-w-lg h-[360px]"
      handleSlot={false}
      dismissible={false}
      repositionInputs={true}
    >
      <div className="mt-(--sizing-named-micro) px-(--sizing-named-small) pt-(--sizing-named-small) pb-(--sizing-named-large)">
        <div className="text-(--element-emphasis-00) typography-text-heading1-strong mb-(--sizing-named-medium)">
          Reset your password
        </div>

        <div className="mb-(--sizing-named-medium)">
          <div className="text-(--element-emphasis-00) typography-text-body1-base mb-(--sizing-named-micro)">
            Choose a new password
          </div>
          <SetPasswordInput
            changeDisabledNext={changeDisabledNext}
            password={password}
            changePassword={changePassword}
            ref={setPasswordInputRef}
          />
        </div>

        <XButton
          color="primary"
          className="w-full h-(--controls-huge-min-height) text-(--element-reverse-emphasis-00)"
          style={{ font: 'var(--typography-text-body1-strong) !important' }}
          disabled={disabledNext}
          onClick={handleResetPassword}
        >
          Reset password
        </XButton>

        <ResetYourPasswordSucessDrawer
          visible={sucessDrawerVisible}
          changeVisible={changeSucessDrawerVisible}
          closeAll={handleCloseAll}
        ></ResetYourPasswordSucessDrawer>
      </div>
    </Drawer>
  )
}
export default ResetYourPasswordDrawer
