export enum BookingStatus {
  CANCELLED = 0, // 已取消
  CONFIRMED = 1, // 已确认
  DOING = 2, // 进行中
  COMPLETED = 3, // 已完成
}
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

interface BookingRecord {
  id: number
  title: string
  startTime: string
  endTime: string
  userName: string
  userCode: string
  status: BookingStatus
  remark?: string
  cancelTime?: string
  cancelReason?: string
  cancelUserId?: number
  cancelUserName?: string
  createTime?: string
  meetingRoom?: MeetingRoomRecord
}

export type { User, MeetingRoomRecord, BookingRecord }
