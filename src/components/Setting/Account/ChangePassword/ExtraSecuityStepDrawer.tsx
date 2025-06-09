'use client'
import XButton from '@/components/XButton'
import { postLogoutOtherSession } from '@/services/user'
import { Drawer, DrawerDescription, DrawerHeader, DrawerTitle, Text } from '@x-vision/design'
interface IProps {
  visible: boolean
  close: () => void
}
const ExtraSecuityStepDrawer = ({ visible, close }: IProps) => {
  const handleLogoutOtherSessions = async () => {
    try {
      const res = await postLogoutOtherSession()
      if (!res?.success) {
        throw res
      }
      close()
    } catch (error: any) {
      console.error('handleLogoutOtherSessions error', error)
    }
  }
  return (
    <Drawer
      title="Basic Drawer"
      open={visible}
      onOpenChange={close}
      className="mx-auto w-full max-w-lg h-[460px]"
      handleSlot={false}
      dismissible={false}
      repositionInputs={false}
    >
      {visible && (
        <>
          <div className="mt-(--sizing-named-micro) px-(--sizing-named-small) pt-(--sizing-named-small) pb-(--sizing-named-large)">
            <Text size="body1" strong className="text-(--element-emphasis-00) mb-(--sizing-named-small) text-center">
              Extra security step
            </Text>
            <Text size="body1" className="text-(--element-emphasis-01) text-center mb-(--sizing-named-medium)">
              <div className="mb-[1em]">
                For additional security, you may want to close all sessions except this current one.
              </div>
              <div className="mb-[1em]">
                This action helps ensure that if your account was accessed from another device without your knowledge,
                those sessions will be terminated, keeping your information safe.
              </div>
              <div>This action cannot be undone.</div>
            </Text>

            <XButton
              color="primary"
              className="w-full h-(--controls-huge-min-height)"
              onClick={handleLogoutOtherSessions}
            >
              Yes, log out other sessions
            </XButton>
            <XButton className="w-full h-(--controls-huge-min-height) mt-(--sizing-named-medium)" onClick={close}>
              Not now
            </XButton>
          </div>
        </>
      )}
    </Drawer>
  )
}
export default ExtraSecuityStepDrawer
