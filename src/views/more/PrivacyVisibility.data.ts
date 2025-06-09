import { getApiAccountSettingPrivacySettingHome } from '@/services/setting'
import { useState, useMemo, useEffect } from 'react'
import { PRIVACY_ITEMS } from './constants/menu-routes'

const MemoryVisibilityValue = {
  value: 0,
  init: false,
}

export function useVisibilityValue() {
  const [visibilityValue, setVisibilityValue] = useState(MemoryVisibilityValue.value || '')
  const [loading, setLoading] = useState(false)

  const visibilityValueString = useMemo(() => {
    const item = PRIVACY_ITEMS.find((i) => i.value === visibilityValue)
    return item?.label || ''
  }, [visibilityValue])

  function updateVisibilityValue(value: number) {
    setVisibilityValue(value)
    MemoryVisibilityValue.value = value
    MemoryVisibilityValue.init = true
  }

  async function fetchVisibility() {
    try {
      setLoading(true)

      const res = await getApiAccountSettingPrivacySettingHome()
      if (res?.homepageVisibility) {
        updateVisibilityValue(res.homepageVisibility)
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (MemoryVisibilityValue.init) return
    fetchVisibility()
  }, [])

  return {
    loading,
    setLoading,
    visibilityValue,
    visibilityValueString,
    updateVisibilityValue,
    fetchVisibility,
  }
}
