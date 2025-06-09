'use client'
import React, { useState } from 'react'
import { Drawer, DrawerDescription, DrawerHeader, DrawerTitle } from '@x-vision/design'
import Image from 'next/image'
import useSetPassword from '@/hooks/useSetPassword'

import rectangle1 from './img/rectangle1.png'
import { postSetPassword } from '@/services/user'
import { showCommonErrorDrawer } from '@/models/abnormalDrawer'
import XButton from '@/components/XButton'
import { PostSetPasswordErrorMsg } from '@/constants/userHttpErrorCode'
import SetPasswordInput from '@/components/SetPasswordInput'
import { xLogger } from '@/common/logger'
import { changeUserInfoItem } from '@/models/user'

interface Iprops {
  visible: boolean
  close: () => void
  onSuccess: () => void
}
const DeleteThirdPartyAccountSetPasswordDrawer = ({ visible, close, onSuccess }: Iprops) => {
  const [disabledNext, setDisabledNext] = useState<boolean>(true)
  const changeDisabledNext = (val: boolean) => {
    setDisabledNext(val)
  }

  const { setPasswordInputRef, password, changePassword, updateInputErrText, checkZxcvbn } = useSetPassword()

  const handleSetPassword = async () => {
    if (!checkZxcvbn()) {
      return
    }
    try {
      setDisabledNext(true)
      const res = await postSetPassword({
        password,
      })
      if (!res?.success) {
        throw res
      }
      changeUserInfoItem({
        hasPassword: true,
      })
      await onSuccess()
    } catch (error: any) {
      console.error('postSetPassword error: ', error)
      //@ts-expect-error 忽略类型错误
      const msg = PostSetPasswordErrorMsg[error?.code]
      if (msg) {
        updateInputErrText(msg)
      } else {
        showCommonErrorDrawer({
          contentTxt: 'There was a problem setting your password.',
        })
        xLogger.error('third party accounts error', {
          detail: 'DeleteThirdPartyAccountSetPasswordDrawer handleSetPassword postSetPassword',
          error,
        })
      }
    } finally {
      setDisabledNext(false)
    }
  }

  return (
    <Drawer
      title="Basic Drawer"
      open={visible}
      onOpenChange={close}
      className="mx-auto w-full max-w-lg h-[436px]"
      handleSlot={false}
      dismissible={false}
      repositionInputs={true}
    >
      {visible && (
        <>
          <div className="mt-(--sizing-named-micro) px-(--sizing-named-small) pt-(--sizing-named-small) pb-(--sizing-named-large)">
            <div className="flex align-center justify-center">
              <Image src={rectangle1} width={80} height={80} alt=""></Image>
            </div>
            <div className="text-(--element-emphasis-00) typography-text-body1-base mt-(--sizing-named-medium)">
              You must set a password for your account before disconnecting the third party account.
            </div>

            <SetPasswordInput
              className="mt-(--sizing-named-large)"
              ref={setPasswordInputRef}
              changeDisabledNext={changeDisabledNext}
              password={password}
              changePassword={changePassword}
            ></SetPasswordInput>

            <div className="flex align-center justify-center mt-(--sizing-named-small)">
              <XButton
                color="primary"
                className="w-full h-(--controls-huge-min-height)"
                style={{ font: 'var(--typography-text-body1-strong) !important' }}
                disabled={disabledNext}
                onClick={handleSetPassword}
              >
                Set password
              </XButton>
            </div>
          </div>
        </>
      )}
    </Drawer>
  )
}
export default DeleteThirdPartyAccountSetPasswordDrawer
