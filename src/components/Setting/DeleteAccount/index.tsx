'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Cell, RadioGroupItem, RadioGroupPrimitive, Textarea } from '@x-vision/design'
import { PcMenuLayout, MobileNoTabbarLayout } from '@/components/Layout'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import DeleteAccountConfirm from './Confirm'
import { classMerge } from '@/utils'

const ITEMS = [
  { label: 'Privacy concerns', value: 'privacy_concerns' },
  { label: 'Technical issues', value: 'technical_issues' },
  { label: 'Trouble getting started', value: 'trouble_getting_started' },
  { label: 'Found a better app', value: 'found_a_better_app' },
  { label: 'Others', value: 'others' },
]
interface IProps {
  className?: string
  visible?: boolean
  back?: () => void
}
export default function DeleteAccount(props: IProps) {
  const router = useRouter()
  const [value, setValue] = useState<string>('privacy_concerns')
  const [othersTextarea, setOthersTextarea] = useState<string>('')
  const closeReason = useMemo(() => {
    const txt = ITEMS.find((item) => item?.value === value)?.label
    if (!txt) {
      return []
    }
    const arr = [txt]
    if (othersTextarea) {
      arr.push(othersTextarea)
    }
    return arr
  }, [value, othersTextarea])
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState<boolean>(false)
  const closeDeleteAccountConfirm = () => {
    setShowDeleteAccountConfirm(false)
  }
  const openDeleteAccountConfirm = () => {
    setShowDeleteAccountConfirm(true)
  }
  if (props?.hasOwnProperty('visible') && !props?.visible) {
    return null
  }
  return (
    <div
      className={classMerge(
        'size-full overflow-hidden flex flex-col w-screen h-screen overflow-y-auto bg-(--surface-level-01-emphasis-opaque-00)',
        props?.className,
      )}
    >
      <PageHeader title="Delete account" back={props?.back}></PageHeader>
      <div className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col gap-(--named-large) p-(--named-small)">
        <div className="typography-numbers-body1-base">
          We're sorry to see you go. We'd like to know why you're deleting your account as we may be able to help with
          common issues.
        </div>
        <RadioGroupPrimitive.Root value={value}>
          <div className="flex flex-col gap-(--named-small)">
            {ITEMS.map((item) => (
              <Cell key={item.label} right={<RadioGroupItem value={item.value} />} onClick={() => setValue(item.value)}>
                {item.label}
              </Cell>
            ))}
          </div>
        </RadioGroupPrimitive.Root>
        {value === 'others' && (
          <Textarea
            placeholder="Please tell us here"
            rows={3}
            value={othersTextarea}
            onChange={(e) => setOthersTextarea(e.target.value)}
          />
        )}
      </div>
      <div className="flex flex-col gap-(--named-medium) px-(--named-small) my-(--named-medium)">
        <Button size="huge" color="primary" onClick={openDeleteAccountConfirm}>
          Continue
        </Button>
        <Button size="huge" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <DeleteAccountConfirm
        className="absolute top-0 left-0 w-screen h-screen z-10 bg-white"
        visible={showDeleteAccountConfirm}
        closeReason={closeReason}
        close={closeDeleteAccountConfirm}
      ></DeleteAccountConfirm>
    </div>
  )
}

DeleteAccount.PcLayout = PcMenuLayout
DeleteAccount.MobileLayout = MobileNoTabbarLayout
