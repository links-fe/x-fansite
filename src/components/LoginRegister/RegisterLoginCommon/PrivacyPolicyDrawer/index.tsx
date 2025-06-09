'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import { Drawer, DrawerDescription, DrawerHeader, DrawerTitle } from '@x-vision/design'
import { PageLoading } from '@/components/PageLoading'

const PrivacyPolicy = dynamic(() => import('@/components/PrivacyPolicy'), {
  ssr: false,
  loading: () => <PageLoading></PageLoading>,
})
interface TermsAndConditionsDrawerProps {
  visible: boolean
  close: () => void
}
const PrivacyPolicyDrawer = ({ visible, close }: TermsAndConditionsDrawerProps) => {
  // if (!visible) return null
  return (
    <Drawer
      title="Basic Drawer"
      open={visible}
      onOpenChange={close}
      className="mx-auto w-full max-w-lg h-[99vh]!"
      handleSlot={false}
      dismissible={false}
      repositionInputs={false}
    >
      {visible && (
        <>
          <div className="mt-(--sizing-named-micro) pt-(--sizing-named-small) pb-(--sizing-named-large) h-full">
            <PrivacyPolicy></PrivacyPolicy>
          </div>
        </>
      )}
    </Drawer>
  )
}
export default PrivacyPolicyDrawer
