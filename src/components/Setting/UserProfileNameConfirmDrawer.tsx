import { Button, Drawer, DrawerClose } from '@x-vision/design'
import { ALERT_MESSAGES } from '@/views/more/constants/alert-messages'

/**
 * 用户名修改确认抽屉组件
 * @param open - 控制抽屉显示状态
 * @param setOpen - 抽屉状态更新方法
 * @param loading - 提交按钮加载状态
 * @param submit - 确认提交回调函数
 */
export function ProfileNameConfirmDrawer({
  open,
  setOpen,
  loading,
  submit,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  loading: boolean
  submit: () => void
}) {
  return (
    <Drawer
      handleSlot={false}
      open={open}
      onOpenChange={setOpen}
      className="h-[60vh]! py-(--sizing-named-huge) px-(--named-mini)"
    >
      <div className="overflow-y-auto gap-(--named-medium) flex flex-col mb-(--named-medium) text-center">
        <div className="typography-text-body1-strong text-(--element-emphasis-00)">
          {ALERT_MESSAGES.USERNAME_CHANGE_CONFIRM}
        </div>
        <Button size="huge" color="primary" onClick={submit} loading={loading}>
          Yes
        </Button>
        <DrawerClose asChild>
          <Button size="huge">Cancel</Button>
        </DrawerClose>
      </div>
    </Drawer>
  )
}
