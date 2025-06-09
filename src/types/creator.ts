export interface ICreatorDetail {
  id: number
  name: string
  username: string
  avatar: string
  bio: string
}

export interface IShareDetail {
  id: number
  type: 'game' | 'vault'
}
