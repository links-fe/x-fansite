'use client'

import { Icon } from '@x-vision/icons'
import { useRouter } from 'next/navigation'
import { Button, Navbar } from '@x-vision/design'

interface Iprops extends React.ComponentProps<typeof Navbar> {
  back?: () => void
}
export function PageHeader(props: Iprops) {
  const router = useRouter()
  const back = () => {
    if (props.back) {
      props.back()
    } else {
      router.back()
    }
  }
  return <Navbar left={<Icon icon="x:ArrowLeft02StyleSolid" onClick={back} />} {...props} />
}
