import { AppLayout } from './AppLayout'
import { MobileBottomTabbar } from './components/MobileBottomTabbar'

export function MobileTabbarLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>
      <div style={{ height: '100%', overflow: 'hidden' }}>
        <div style={{ height: 'calc(100% - 60px)', overflow: 'auto' }}>{children}</div>
        <MobileBottomTabbar />
      </div>
    </AppLayout>
  )
}
