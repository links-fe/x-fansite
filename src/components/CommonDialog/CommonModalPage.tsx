import { Dialog, DialogContent } from '@x-vision/design/index.js'
import React from 'react'
import { CommonDialogProps } from './type'
import classNames from 'classnames'

export const CommonModalPage: React.FC<CommonDialogProps> = (props) => {
  const { children } = props
  return (
    <Dialog {...props} className="rounded-(--sizing-named-micro)">
      <DialogContent className={classNames(['sm:max-w-[425px] !h-fit min-h-[500px]', props.className])}>
        {/* <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
        </DialogHeader> */}
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  )
}
