'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import { Icon } from '@x-vision/icons'
// import { Drawer, DrawerDescription, DrawerHeader, DrawerTitle } from '@x-vision/design'
import { useGlobalLoginModalVisible, hideGlobalLoginModal } from '@/models/user'
import { PageLoading } from '@/components/PageLoading'
import { EnumCheckSource } from '@/types'

const RegisterLogin = dynamic(() => import('@/components/LoginRegister/RegisterLoginCommon'), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] flex items-center justify-center">
      <PageLoading></PageLoading>
    </div>
  ),
})

const GlobalLoginDrawer = () => {
  const visible = useGlobalLoginModalVisible()

  const handleLogin = () => {
    hideGlobalLoginModal()
  }

  const renderTopText = (showPassWord: boolean) => {
    return (
      <div className="text-(--element-emphasis-00) typography-text-body1-base mb-(--sizing-named-medium) text-center">
        {showPassWord
          ? 'Log in to receive the link to your purchase'
          : 'Enter your email to keep your purchase secure and easy to access.'}
      </div>
    )
  }
  // return (
  //   <>
  //     <Drawer
  //       title="Basic Drawer"
  //       open={visible}
  //       onOpenChange={hideGlobalLoginModal}
  //       className="mx-auto w-full max-w-lg h-[590px]"
  //       handleSlot={false}
  //       dismissible={false}
  //       repositionInputs={false}
  //     >
  //       {visible && (
  //         <>
  //           <div className="mt-(--sizing-named-micro) px-(--sizing-named-small) pt-(--sizing-named-small) pb-(--sizing-named-large)">
  //             <RegisterLogin
  //               checkSource={EnumCheckSource.BuyMaterial}
  //               renderTopText={renderTopText}
  //               onSucess={handleLogin}
  //             ></RegisterLogin>
  //           </div>
  //         </>
  //       )}
  //     </Drawer>
  //   </>
  // )
  if (!visible) return null
  return (
    <div
      className="fixed top-0 bottom-0 left-0 w-screen h-screen"
      style={{ background: 'rgba(0, 0, 0, 0.8)' }}
      onClick={(e) => {
        e?.stopPropagation?.()
        e?.preventDefault?.()
      }}
    >
      <div
        className="absolute top-12 bottom-0 left-0 w-screen bg-white"
        style={{ borderRadius: '12px 12px 0px 0px' }}
        onClick={(e) => {
          e?.stopPropagation?.()
          e?.preventDefault?.()
        }}
      >
        <div className="flex justify-end items-center px-4" style={{ height: '52px' }} onClick={hideGlobalLoginModal}>
          <Icon icon="x:Cancel01StyleSolid" fontSize={20} />
        </div>

        <div className="box-border mt-(--sizing-named-micro) px-4 pt-(--sizing-named-small) pb-[160px] h-[calc(100% - 52px)] max-h-[76vh] overflow-y-auto">
          <RegisterLogin
            checkSource={EnumCheckSource.BuyMaterial}
            renderTopText={renderTopText}
            onSucess={handleLogin}
          ></RegisterLogin>
        </div>
      </div>
    </div>
  )
}
export default GlobalLoginDrawer
