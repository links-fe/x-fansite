import React from 'react'
import Image from 'next/image'
import { Drawer, DrawerDescription, DrawerHeader, DrawerTitle } from '@x-vision/design'
import sucessImg from './img/sucess-img.png'
import XButton from '@/components/XButton'
interface Iprops {
  visible: boolean
  changeVisible: (val: boolean) => void
  closeAll: () => void
}
const ResetYourPasswordSucessDrawer = ({ visible, changeVisible, closeAll }: Iprops) => {
  return (
    <Drawer
      title="Basic Drawer"
      open={visible}
      onOpenChange={changeVisible}
      className="mx-auto w-full max-w-lg h-[364px]"
      handleSlot={false}
      dismissible={false}
      repositionInputs={false}
    >
      <div className="mt-(--sizing-named-micro) px-(--sizing-named-small) pt-(--sizing-named-small) pb-(--sizing-named-large)">
        <div className="flex align-center justify-center mb-(--sizing-named-medium)">
          <Image src={sucessImg} width={80} height={80} alt=""></Image>
        </div>
        <div className="text-(--element-emphasis-00) typography-text-body1-base text-center mb-(--sizing-named-medium)">
          Your password has been reset. Remember to keep it safe.
        </div>

        <XButton
          color="primary"
          className="w-full h-(--controls-huge-min-height)"
          style={{ font: 'var(--typography-text-body1-strong) !important' }}
          onClick={closeAll}
        >
          Continue
        </XButton>
      </div>
    </Drawer>
  )
}
export default ResetYourPasswordSucessDrawer
