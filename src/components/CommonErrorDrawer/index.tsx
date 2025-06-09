'use client'
import React from 'react'
import Image from 'next/image'
import { Drawer, DrawerDescription, DrawerHeader, DrawerTitle } from '@x-vision/design'
import { hideCommonErrorDrawer, useCommonErrorDrawerData } from '@/models/abnormalDrawer'
import XButton from '@/components/XButton'
import errorLoadingData from '@/assets/error-loading-data.png'
const CommonErrorDrawer = () => {
  const abnormalDrawerState = useCommonErrorDrawerData()
  return (
    <Drawer
      title="Basic Drawer"
      open={abnormalDrawerState.visible}
      onOpenChange={hideCommonErrorDrawer}
      className="mx-auto w-full max-w-lg h-[344px]"
      dismissible={false}
      repositionInputs={false}
    >
      {abnormalDrawerState.visible && (
        <>
          <div className="mt-(--sizing-named-micro) px-(--sizing-named-small) pt-(--sizing-named-small) pb-20 h-full">
            <div className="flex items-center justify-center mb-(--sizing-named-medium)">
              <Image src={errorLoadingData} width={80} height={80} alt=""></Image>
            </div>
            <div className="text-(--element-emphasis-00) typography-text-body1-base mb-(--sizing-named-medium) text-center">
              {abnormalDrawerState?.contentTxt ?? ''}
            </div>
            <XButton color="primary" className="w-full h-(--controls-huge-min-height)" onClick={hideCommonErrorDrawer}>
              {abnormalDrawerState?.btnTxt ?? ''}
            </XButton>
          </div>
        </>
      )}
    </Drawer>
  )
}
export default CommonErrorDrawer
