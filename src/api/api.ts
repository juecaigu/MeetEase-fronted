import http from './http'
import type { BookingRecord, MeetingRoomRecord, User } from '@/type/type'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/**
 * 登录
 * @param username
 * @param password
 * @returns
 */
const requestLogin = (
  username: string,
  password: string,
): Promise<ApiResponse<{ token: string; fresh_token: string; userInfo: User }>> => {
  return http.post('/user/login', {
    username,
    password,
  })
}

/**
 * 获取验证码
 * @param email
 * @returns
 */
const requestCaptcha = (email: string): Promise<ApiResponse<{ captcha: string }>> => {
  return http.get(`/user/captcha?email=${email}`)
}

/**
 * 注册
 * @param params
 * @returns
 */
const requestRegister = (params: {
  username: string
  nickName: string
  email: string
  phone: string
  password: string
  captcha: string
}): Promise<ApiResponse<null>> => {
  return http.post('/user/register', params)
}

/**
 * 获取服务时间
 * @returns
 */
const requestGetTime = (): Promise<ApiResponse<{ time: string }>> => {
  return http.get('/tasks/service-time')
}

/**
 * 修改密码
 * @param params
 * @returns
 */
const requestChangePassword = (params: {
  id: number
  newPassword: string
  captcha: string
}): Promise<ApiResponse<null>> => {
  return http.post('/user/update/password', params)
}

/**
 * 获取用户信息
 * @returns
 */
const requestGetUserInfo = (): Promise<ApiResponse<User>> => {
  return http.get('/user/userInfo')
}

/**
 * 更新用户信息
 * @param params
 * @returns
 */
const requestUpdateUserInfo = (params: {
  id: number
  nickname: string
  email: string
  phone: string
}): Promise<ApiResponse<null>> => {
  return http.post('/user/update/userInfo', params)
}

/**
 * 获取会议室列表
 * @param pageNo
 * @param pageSize
 * @returns
 */
const requestGetMeetingRoom = (params: {
  pageNo: number
  pageSize: number
  date: string
}): Promise<ApiResponse<{ data: MeetingRoomRecord[] }>> => {
  return http.post(`/meeting-room/booking/list`, params)
}

/**
 * 预订会议
 * @param params
 * @returns
 */
const requestBooking = (params: {
  meetingRoomId: number
  startTime: string
  endTime: string
  title: string
  remark?: string
}): Promise<ApiResponse<null>> => {
  return http.post('/booking/create', params)
}

/**
 * 获取预订记录
 * @param params
 * @returns
 */
const requestGetBookingRecord = (params: {
  pageNo: number
  pageSize: number
  status?: string
  startTime?: string
  endTime?: string
}): Promise<ApiResponse<{ list: BookingRecord[]; total: number }>> => {
  return http.post(`/booking/list`, params)
}

export {
  requestLogin,
  requestCaptcha,
  requestRegister,
  requestGetTime,
  requestChangePassword,
  requestGetUserInfo,
  requestUpdateUserInfo,
  requestGetMeetingRoom,
  requestBooking,
  requestGetBookingRecord,
}
