import { DialogRoot, DrawerContent, DrawerRoot } from '@x-vision/design/index.js'
import { ReactNode } from 'react'

export type DialogRootProps = React.ComponentProps<typeof DialogRoot>

export interface CommonDialogProps extends DialogRootProps {
  children?: ReactNode
  className?: string
  style?: React.CSSProperties
}

export type CommonDrawerProps = React.ComponentProps<typeof DrawerRoot> &
  React.ComponentProps<typeof DrawerContent> & {
    header?: React.ReactNode
    footer?: React.ReactNode
  }
