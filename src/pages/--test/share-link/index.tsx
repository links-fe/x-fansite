import { BRAND_DOMAIN } from '@/constants'

export default function Page() {
  const shareLink = `${BRAND_DOMAIN}/share-link?id=12321&cid=123&_h=of&_d=a`
  return (
    <div>
      <div>素材分享链接</div>
      <div>{shareLink}</div>
    </div>
  )
}
