import logoLightImg from '@/assets/brand/logo-light.svg'
import Image from 'next/image'

export function PageLoading() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Image src={logoLightImg} style={{ width: 100, height: 100 }} alt="" />
    </div>
  )
}
