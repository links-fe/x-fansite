import { Navbar } from '@x-vision/design'

export interface PageProps extends React.HTMLAttributes<HTMLDivElement>, React.ComponentProps<typeof Navbar> {
  title?: string
  description?: string
  loading?: boolean
  screen?: boolean
  onBack?: () => void
  className?: string
  rootClassName?: string
  children?: React.ReactNode
}
