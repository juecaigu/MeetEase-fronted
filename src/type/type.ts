interface User {
  id: number
  username: string
  nickname: string
  code: string
  permissions: string[]
  avatar: string
  email: string
  phone: string
  roles: { id: number; name: string; admin: boolean }[]
  isAdmin: boolean
  updatedTime: string
}

export type { User }
