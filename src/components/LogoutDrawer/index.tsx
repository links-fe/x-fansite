'use client'
import { Drawer, DrawerDescription, DrawerHeader, DrawerTitle, Text } from '@x-vision/design'
import XButton from '@/components/XButton'
import { postLogout } from '@/services/user'
import { showCommonErrorDrawer } from '@/models/abnormalDrawer'
import { xLogger } from '@/common/logger'
interface Iprops {
  visible: boolean
  close: () => void
}
const LogoutDrawer = ({ visible, close }: Iprops) => {
  const handleLogout = async () => {
    try {
      const res = await postLogout()
      if (!res?.success) {
        throw res
      }
      console.log('logout success')
      close()
    } catch (error) {
      console.error('logout failed', error)
      showCommonErrorDrawer({
        contentTxt: 'There was a problem communicating with X servers.',
      })
      xLogger.error('logout error', {
        detail: 'LogoutDrawer handleLogout postLogout',
        error,
      })
    }
  }
  return (
    <Drawer
      title="Basic Drawer"
      open={visible}
      onOpenChange={close}
      className="mx-auto w-full max-w-lg h-[264px]"
      handleSlot={false}
      dismissible={false}
      repositionInputs={false}
    >
      {visible && (
        <>
          <div className="mt-(--sizing-named-micro) px-(--sizing-named-small) pt-(--sizing-named-small) pb-(--sizing-named-large)">
            <Text size="body1" className="text-(--element-emphasis-00) text-center">
              Are you sure you want to logout?
            </Text>
            <XButton
              color="primary"
              className="w-full h-(--controls-huge-min-height) mt-(--sizing-named-medium)"
              onClick={handleLogout}
            >
              Logout
            </XButton>
            <XButton className="w-full h-(--controls-huge-min-height) mt-(--sizing-named-medium)" onClick={close}>
              Cancel
            </XButton>
          </div>
        </>
      )}
    </Drawer>
  )
}
export default LogoutDrawer
