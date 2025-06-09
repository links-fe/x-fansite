'use client'
import { Button, Drawer, DrawerClose } from '@x-vision/design'
interface Iprops {
  visible: boolean
  confirm: () => void
  close: () => void
}
const ConfirmDeleteAccount = ({ visible, confirm, close }: Iprops) => {
  return (
    <Drawer
      handleSlot={false}
      open={visible}
      onOpenChange={close}
      className="h-[60vh]! py-(--sizing-named-huge) px-(--named-mini)"
    >
      <div className="overflow-y-auto gap-(--named-medium) flex flex-col mb-(--named-medium) text-center">
        <div className="typography-text-body1-strong text-(--element-emphasis-00)">
          Are you sure you want to delete your account?
        </div>
        <Button size="huge" color="stop" onClick={confirm}>
          Delete account
        </Button>
        <DrawerClose asChild>
          <Button size="huge">Cancel</Button>
        </DrawerClose>
      </div>
    </Drawer>
  )
}
export default ConfirmDeleteAccount
