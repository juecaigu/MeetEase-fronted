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

interface MeetingRoomRecord {
  id: number
  name: string
  location: string
  capacity: number
  bookings: { startTime: string; endTime: string; status: 1 | 0 }[]
  equipment: { id: number; name: string }[]
}

export type { User, MeetingRoomRecord }
