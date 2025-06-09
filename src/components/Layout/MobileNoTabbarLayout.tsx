import Div100vh from 'react-div-100vh'
import { AppLayout } from './AppLayout'

export function MobileNoTabbarLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>
      <div style={{ height: '100%', overflow: 'hidden' }}>
        <Div100vh className="flex flex-col h-full">{children}</Div100vh>
      </div>
    </AppLayout>
  )
}
