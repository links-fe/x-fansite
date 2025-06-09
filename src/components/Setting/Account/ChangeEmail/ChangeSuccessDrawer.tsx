'use client'
import Image from 'next/image'
import { Drawer, Text } from '@x-vision/design'
import successIcon from '@/assets/success-icon.png'
import XButton from '@/components/XButton'
interface Iprops {
  visible: boolean
  close: () => void
}
const ChangeSuccessDrawer = ({ visible, close }: Iprops) => {
  return (
    <Drawer
      title="Basic Drawer"
      open={visible}
      onOpenChange={close}
      className="mx-auto w-full max-w-lg h-[344px]"
      dismissible={false}
      repositionInputs={false}
    >
      {visible && (
        <>
          <div className="mt-(--sizing-named-micro) pt-(--sizing-named-small) pb-(--sizing-named-large) h-full px-(--sizing-named-small)">
            <div className="flex items-center justify-center mb-(--sizing-named-medium)">
              <Image src={successIcon} width={80} height={80} alt="" className="w-[80px] h-[80px]"></Image>
            </div>
            <Text size="body1" className="text-(--element-emphasis-00) mb-(--sizing-named-medium) text-center">
              Your email has been changed.
            </Text>
            <XButton color="primary" className="w-full h-(--controls-huge-min-height)" onClick={close}>
              OK
            </XButton>
          </div>
        </>
      )}
    </Drawer>
  )
}
export default ChangeSuccessDrawer
