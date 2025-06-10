'use client'

import { postApiAccountSettingUpdateHomepageVisibility } from '@/services/setting'
import { Cell, cln, Loading, RadioGroupItem, RadioGroupPrimitive } from '@x-vision/design'
import { useRouter } from 'next/router'
import { PRIVACY_ITEMS } from './constants/menu-routes'
import { useVisibilityValue } from './PrivacyVisibility.data'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { PAGE_NAMES } from './constants/page-names'
import { PageProps } from '@/types/page'
import { PageContent } from '@/components/Setting/PageContent'

export default function PrivacyVisibility({
  value,
  setValue,
  title = PAGE_NAMES.VISIBILITY,
  ...props
}: { value?: string | number; setValue?: (v: number) => void } & PageProps) {
  const router = useRouter()
  const { loading, setLoading, visibilityValue, updateVisibilityValue } = useVisibilityValue()

  async function submit(v: number) {
    try {
      setLoading(true)
      const res = await postApiAccountSettingUpdateHomepageVisibility({ homepageVisibility: v })
      if (!res?.success) return
      updateVisibilityValue(v)

      setValue?.(v)

      if (props?.onBack) {
        props.onBack()
      } else {
        router.back()
      }
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  return (
    <PageContent title={title} loading={loading} {...props}>
      <RadioGroupPrimitive.Root value={String(value || visibilityValue)}>
        <div className="flex flex-col gap-(--named-small)">
          {PRIVACY_ITEMS.map((item) => (
            <Cell
              key={item.label}
              right={<RadioGroupItem value={String(item.value)} />}
              onClick={() => submit(item.value)}
            >
              {item.label}
            </Cell>
          ))}
        </div>
      </RadioGroupPrimitive.Root>
    </PageContent>
  )
}
