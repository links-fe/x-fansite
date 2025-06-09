import { CreatorSharePage } from './components/CreatorSharePage'

export default function Page() {
  return <CreatorSharePage />
}
export async function generateStaticParams() {
  return [{ id: 'default' }]
}
