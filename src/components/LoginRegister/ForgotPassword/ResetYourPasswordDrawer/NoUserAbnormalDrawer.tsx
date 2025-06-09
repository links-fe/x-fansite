'use client'
import React from 'react'
import Image from 'next/image'
import { Drawer, DrawerDescription, DrawerHeader, DrawerTitle } from '@x-vision/design'
import { hideNoUserAbnormalDrawer, showCommonErrorDrawer, useNoUserAbnormalVisible } from '@/models/abnormalDrawer'
import passwordAbnormalIcon from './img/password-abnormal-icon.png'
import { useUserInfo } from '@/models/user'
import { useSearchParams } from 'next/navigation'
import { postLogout } from '@/services/user'
import XButton from '@/components/XButton'
import useRemoveQueryParams from '@/hooks/useRemoveQueryParams'
import { hbSendLog } from '@/utils/datadog'
const NoUserAbnormalDrawer = () => {
  const noUserAbnormalVisible = useNoUserAbnormalVisible()
  const userInfo = useUserInfo()
  const searchParams = useSearchParams()
  const email = searchParams?.get?.('email') as string
  const { removeQueryParams } = useRemoveQueryParams()
  const handleCloseDrawer = () => {
    hideNoUserAbnormalDrawer()
    removeQueryParams(['ticket', 'email'])
  }
  const handleLogout = async () => {
    try {
      const res = await postLogout()
      if (!res?.success) {
        throw res
      }
      console.log('logout success')
      handleCloseDrawer()
    } catch (error: any) {
      console.error('logout failed', error)
      showCommonErrorDrawer({
        contentTxt: 'There was a problem communicating with X servers.',
      })
      hbSendLog({
        message: 'Login Registration NoUserAbnormalDrawer postLogout error',
        status: 'error',
        error,
      })
    }
  }
  return (
    <Drawer
      title="Basic Drawer"
      open={noUserAbnormalVisible}
      onOpenChange={handleCloseDrawer}
      className="mx-auto w-full max-w-lg h-[493px]"
      handleSlot={false}
      closeSlot={false}
      dismissible={false}
      repositionInputs={false}
    >
      {noUserAbnormalVisible && (
        <>
          <div className="mt-(--sizing-named-micro) px-(--sizing-named-small) pt-(--sizing-named-small)">
            <div className="flex items-center justify-center mb-(--sizing-named-medium)">
              <Image src={passwordAbnormalIcon} width={80} height={80} alt=""></Image>
            </div>
            <div className="text-(--element-emphasis-00) typography-text-body1-base text-center mb-(--sizing-named-medium)">
              <div className="mb-5">
                You are attempting to reset the password for {userInfo?.email}, while logged in as
                {email}.
              </div>
              <div>
                You need to logout first before you can reset the password. Please logout, then click the reset password
                link again.
              </div>
            </div>

            <XButton color="primary" size="huge" className="w-full" onClick={handleLogout}>
              Logout
            </XButton>
            <XButton size="huge" className="w-full mt-(--sizing-named-small)" onClick={handleCloseDrawer}>
              Cancel
            </XButton>
          </div>
        </>
      )}
    </Drawer>
  )
}
export default NoUserAbnormalDrawer
