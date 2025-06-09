import { PcMenuLayout, MobileNoTabbarLayout } from '@/components/Layout'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { updateMyProfile, useMyProfileStore } from '@/models/user-profile/profile'
import {
  postApiAccountSettingGeoCode,
  postApiAccountSettingModifyLocation,
  postApiAccountSettingReverseGeoCode,
} from '@/services/setting'
import { Button, Cell, CellGroup, cln, Input, Loading } from '@x-vision/design'
import { Icon } from '@x-vision/icons/index.js'
import { useDebounceEffect, useDebounceFn, useKeyPress } from 'ahooks'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PAGE_NAMES } from './constants/page-names'
import { PageProps } from '@/types/page'
import { PageContent } from '@/components/Setting/PageContent'

type Location = {
  lat: number
  lng: number
  address: string
}

export default function Page({ title = PAGE_NAMES.LOCATION, className, ...props }: PageProps) {
  const router = useRouter()
  const userinfo = useMyProfileStore()

  const inputRef = useRef(null)
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [permissionsStatus, setPermissionsStatus] = useState<PermissionState>()
  const [errors, setErrors] = useState('')
  const [locationList, setLocationList] = useState<Location[]>([])
  const [location, setLocation] = useState<Location>()

  const denied = useMemo(() => permissionsStatus === 'denied', [permissionsStatus])

  const disabled = useMemo(() => !location?.address, [location?.address])

  useEffect(() => {
    if (userinfo.location) setLocation({ lat: 0, lng: 0, address: userinfo.location })

    getCurrentLocation()
  }, [])

  useDebounceEffect(
    () => {
      searchLocations()
    },
    [value],
    { wait: 600 },
  )

  useKeyPress(
    'enter',
    () => {
      searchLocations()
    },
    {
      target: inputRef,
    },
  )

  async function checkLocationPermission() {
    try {
      const status = await navigator.permissions.query({ name: 'geolocation' })

      setPermissionsStatus(status.state)
    } catch (error) {
      console.error(error)
    }
  }

  function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setSearching(true)
        try {
          const res =
            (await postApiAccountSettingReverseGeoCode({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })) || []
          setLocationList(res)
          setErrors('')
          if (res.length && !location?.address) setLocation(res[0])
        } catch (error) {
          console.error(error)
        }
        setSearching(false)
        checkLocationPermission()
      },
      (error) => {
        setErrors('Your current location cannot be determined')
        checkLocationPermission()

        // 根据错误码判断
        switch (error.code) {
          case error.PERMISSION_DENIED:
            // 用户拒绝授权
            console.error('Permission denied(User explicitly denied access)')
            break
          case error.POSITION_UNAVAILABLE:
            // 位置服务不可用，如系统定位服务关闭
            console.error('Position unavailable(Device lacks location capabilities)')
            break
          case error.TIMEOUT:
            // 定位超时，定位时超过PositionOptions.timeout设置的时间触发，此时通常可以重试
            console.error('Timeout(Location request took too long)')
            break
        }
      },
    )
  }

  async function searchLocations() {
    if (!value) return
    setSearching(true)
    try {
      const res = (await postApiAccountSettingGeoCode({ address: value })) || []
      setLocationList(res)
      if (res.length && !location?.address) setLocation(res[0])
    } catch (error) {
      console.error(error)
    }
    setSearching(false)
  }

  async function submit() {
    if (!location?.address) return

    setLoading(true)
    try {
      const res = await postApiAccountSettingModifyLocation({ location: location?.address })
      if (!res?.success) return
      updateMyProfile({ location: location?.address })
      router.back()
    } catch (error: any) {
      console.error(error)
      // if (error?.code) setError(error?.message)
    }

    setLoading(false)
  }
  return (
    <PageContent
      title={title}
      screen
      right={
        <Button size="generous" onClick={submit} disabled={disabled} loading={loading}>
          Done
        </Button>
      }
      className={cln('flex flex-col gap-(--named-large) overflow-y-auto', className)}
      {...props}
    >
      <Input
        // eslint-disable-next-line
        // @ts-expect-error
        ref={inputRef}
        type="text"
        placeholder="Search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        prefix={
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none px-(--named-mini)">
            {searching ? <Loading /> : <Icon icon="x:Search01StyleSolid" />}
          </span>
        }
        wrapClassName="relative"
        className="py-(--named-micro) px-(--named-mini) pl-[42px]! rounded-full"
      />

      <div className="flex flex-col gap-(--named-micro)">
        <div className="typography-text-body1-strong">Current location</div>
        <Cell left={<Icon className="text-[20px]" icon="x:Navigation03StyleStroke" />} onClick={getCurrentLocation}>
          <span className="typography-numbers-body1-base">{location?.address || 'Undetected'}</span>
        </Cell>
        {(denied || errors) && (
          <div className="typography-numbers-body2-base flex gap-(--named-micro) text-(--light-spectrum-cinnamon-00)">
            <Icon className="shrink-0" icon="x:InformationCircleStyleStroke" fontSize={16} />
            {errors || 'Your current location cannot be determined'}
            {permissionsStatus === 'prompt' && (
              <Button size="intermediate" onClick={getCurrentLocation}>
                Retry
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-(--named-micro)">
        <div className="typography-text-body1-strong">Places</div>
        {!locationList?.length ? (
          <div className="typography-numbers-body1-base text-center text-(--light-brand-primary-01) mt-(--named-small)">
            No data
          </div>
        ) : (
          <div className="overflow-y-auto">
            <CellGroup>
              {locationList.map((loc, index) => (
                <Cell key={index} left={<Icon icon="x:Location01StyleStroke" />} onClick={() => setLocation(loc)}>
                  <span className="typography-numbers-body1-base">{loc.address}</span>
                </Cell>
              ))}
            </CellGroup>
          </div>
        )}
      </div>
    </PageContent>
  )
}

Page.PcLayout = PcMenuLayout
Page.MobileLayout = MobileNoTabbarLayout
