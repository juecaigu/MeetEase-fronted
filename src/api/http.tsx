import axios, { AxiosError } from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '@/config/constant'

// 响应数据接口
interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

// 请求配置接口
interface RequestConfig extends Omit<AxiosRequestConfig, 'headers'> {
  /** 是否需要权限认证 */
  needAuth?: boolean
  /** 是否显示错误提示 */
  showError?: boolean
  /** 请求头 */
  headers?: Record<string, string>
}

// 刷新token响应接口
interface RefreshTokenResponse {
  token: string
  refreshToken?: string
}

// 创建axios实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const needAuth = (config as RequestConfig).needAuth
    if (needAuth !== false) {
      const token = localStorage.getItem(TOKEN_KEY)
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    // 处理POST请求的Content-Type
    if (config.method?.toLowerCase() === 'post' && config.data) {
      // 检查是否为文件上传
      if (config.data instanceof FormData) {
        config.headers = config.headers || {}
        config.headers['Content-Type'] = 'multipart/form-data'
      } else if (typeof config.data === 'object') {
        // JSON数据
        config.headers = config.headers || {}
        config.headers['Content-Type'] = 'application/json'
      }
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response) => {
    const { data } = response

    if (data.code === 200) {
      return data
    } else {
      const errorMessage = data.message || '请求失败'
      message.error(errorMessage)
      return Promise.reject(new Error(errorMessage))
    }
  },
  async (error: AxiosError<ApiResponse>) => {
    const { response: errorResponse, config } = error

    if (errorResponse?.status === 401) {
      // 无权限，尝试刷新token
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
        if (refreshToken && config) {
          const refreshResponse = await axios.post<RefreshTokenResponse>('/auth/refresh', {
            refresh_token: refreshToken,
          })

          const { token: newToken } = refreshResponse.data
          if (newToken) {
            localStorage.setItem(TOKEN_KEY, newToken)
            const retryConfig: RequestConfig = {
              ...config,
              method: config.method as string,
              url: config.url as string,
              headers: {
                ...config.headers,
                Authorization: `Bearer ${newToken}`,
              } as Record<string, string>,
            }

            return instance.request(retryConfig)
          }
        }
      } catch (refreshError) {
        // 刷新token失败，清除本地存储并跳转到登录页
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        window.location.href = '/login'
        console.error(refreshError)
        return Promise.reject(error)
      }
    }

    // 统一错误处理
    let errorMessage = '网络错误'

    if (errorResponse?.data?.message) {
      errorMessage = errorResponse.data.message
    } else if (errorResponse?.status) {
      switch (errorResponse.status) {
        case 400:
          errorMessage = '请求参数错误'
          break
        case 403:
          errorMessage = '没有权限访问'
          break
        case 404:
          errorMessage = '请求的资源不存在'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        case 502:
          errorMessage = '网关错误'
          break
        case 503:
          errorMessage = '服务不可用'
          break
        case 504:
          errorMessage = '网关超时'
          break
        default:
          errorMessage = `请求失败 (${errorResponse.status})`
      }
    }

    // 显示错误提示 - 修复类型检查
    if (config && typeof config === 'object' && 'showError' in config && config.showError !== false) {
      message.error(errorMessage)
    }

    return Promise.reject(error)
  },
)

// 主要请求函数
const request = <T = unknown,>(config: RequestConfig): Promise<ApiResponse<T>> => {
  return instance.request(config)
}

// 便捷方法
const http = {
  // GET请求
  get: <T = unknown,>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> => {
    return request<T>({ ...config, method: 'GET', url })
  },

  // POST请求
  post: <T = unknown,>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> => {
    return request<T>({ ...config, method: 'POST', url, data })
  },

  // 文件上传
  upload: <T = unknown,>(url: string, file: File | File[], config?: RequestConfig): Promise<ApiResponse<T>> => {
    const formData = new FormData()

    if (Array.isArray(file)) {
      file.forEach((f, index) => {
        formData.append(`files[${index}]`, f)
      })
    } else {
      formData.append('file', file)
    }

    return request<T>({ ...config, method: 'POST', url, data: formData })
  },

  // 原始请求方法
  request,
}

export default http
