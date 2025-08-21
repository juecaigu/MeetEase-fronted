import http from './http'
import type { User } from '@/type/type'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

const requestLogin = (
  username: string,
  password: string,
): Promise<ApiResponse<{ token: string; fresh_token: string; userInfo: User }>> => {
  return http.post('/user/login', {
    username,
    password,
  })
}

const requestCaptcha = (email: string): Promise<ApiResponse<{ captcha: string }>> => {
  return http.get(`/user/captcha?email=${email}`)
}

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

const requestGetTime = (): Promise<ApiResponse<{ time: string }>> => {
  return http.get('/tasks/service-time')
}

const requestChangePassword = (params: {
  id: number
  newPassword: string
  captcha: string
}): Promise<ApiResponse<null>> => {
  return http.post('/user/update/password', params)
}

export { requestLogin, requestCaptcha, requestRegister, requestGetTime, requestChangePassword }
