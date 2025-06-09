'use client'

import { useRouter } from 'next/navigation'
interface ListItemProps {
  label: string
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export function ListItem(props: ListItemProps) {
  return (
    <div style={{ height: 80, border: '1px solid #ccc' }} onClick={props.onClick}>
      {props.label}
    </div>
  )
}

interface ListItemLinkProps extends ListItemProps {
  to: string
}

export function ListItemLink(props: ListItemLinkProps) {
  const router = useRouter()
  return (
    <ListItem
      label={props.label}
      onClick={() => {
        router.push(props.to)
      }}
    />
  )
}
