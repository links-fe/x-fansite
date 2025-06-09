import { useContactMeta } from '@/models/chat/cache/meta'
import { Button, Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, Text } from '@x-vision/design'
import { Icon } from '@x-vision/icons'
import React from 'react'

interface IProps {
  toUserId: string
}
function TipsDrawer(props: IProps) {
  const { toUserId } = props
  const [open, setOpen] = React.useState(false)
  const contactMeta = useContactMeta(toUserId)

  return (
    <>
      <span className="w-9 h-9 flex justify-center items-center" onClick={() => setOpen(true)}>
        <Icon icon="x:MoneySendCircleStyleStroke" fontSize={20} />
      </span>
      <Drawer
        shouldScaleBackground
        handleSlot={false}
        open={open}
        onOpenChange={setOpen}
        className="max-h-[95vh]!"
        header={false}
        footer={false}
      >
        <div className="w-full h-[95vh] max-h-[95vh] flex flex-col items-center justify-center overflow-y-auto">
          <Text size="body1" strong>
            Tip {contactMeta?.user?.remarkName || contactMeta?.user?.nickName || contactMeta?.user?.userName}
          </Text>
          <div className="h-12 w-full"></div>
          <Text size="display1">$5</Text>
          <div className="h-2 w-full"></div>
          <Text size="body2" emphasis={2}>
            Between $5 to $1000
          </Text>
          <div className="h-12 w-full"></div>
          <div className="flex justify-center max-w-[50%] flex-wrap gap-2">
            <Button>Min</Button>
            <Button>+ 5</Button>
            <Button>+ 10</Button>
            <Button>+ 100</Button>
            <Button>+ 1000</Button>
          </div>
          <div className="h-12 w-full"></div>
          <Text size="body1" strong>
            Pay with
          </Text>
          <div className="h-1 w-full"></div>
          <div className="flex items-center">
            <Icon icon="x:PaymentMethodsVisaColor" fontSize={24} />
            <div className="h-full w-2"></div>
            <Text size="body1">ending with 1234</Text>
            <div className="h-full w-1"></div>
            <Icon icon="x:Edit02StyleStroke" fontSize={12} />
          </div>
          <div className="h-9 w-full"></div>
          <Button size="great" color="primary">
            <Icon icon="x:MoneySendCircleStyleSolid" />
            Tip
          </Button>
        </div>
      </Drawer>
    </>
  )
}

export default TipsDrawer
