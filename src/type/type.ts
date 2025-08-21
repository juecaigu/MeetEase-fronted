interface User {
  id: number
  username: string
  nickname: string
  code: string
  permissions: string[]
  avatar: string
  email: string
  phone: string
  roles: string[]
  updatedTime: string
}

export type { User }
