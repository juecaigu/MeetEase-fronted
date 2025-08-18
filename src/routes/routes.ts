import LazyComponent from '../components/LazyComponent'
import { lazy } from 'react'
// import { protectedLoader } from './load'

export const routes = [
  {
    path: '/login', // 登录
    element: LazyComponent({ lazyComponent: lazy(() => import('../pages/Login/Login')) }),
  },
  {
    path: '/signup', // 注册
    element: LazyComponent({ lazyComponent: lazy(() => import('../pages/Login/Signup')) }),
    // loader: protectedLoader,
  },
  {
    path: '/',
    // loader: protectedLoader,
    element: LazyComponent({ lazyComponent: lazy(() => import('../pages/Home/Layout')) }),
    children: [
      {
        path: '/booking',
        element: LazyComponent({ lazyComponent: lazy(() => import('../pages/Booking/Booking')) }),
      },
      {
        path: '/booking-record',
        element: LazyComponent({ lazyComponent: lazy(() => import('../pages/Record/BookingRecord')) }),
      },
    ],
  },

  //   {
  //     path: '/user', // 用户管理
  //     component: User,
  //     // 需要用户权限
  //     requiredPermissions: ['user'],
  //     requiresAuth: true
  //   },
  //   {
  //     path: '/meeting', // 会议室管理
  //     component: Meeting,
  //     requiredPermissions: [],
  //     requiresAuth: true
  //   },
  //   {
  //     path: '/booking', // 预约管理
  //     component: Booking,
  //     requiredPermissions: [],
  //     requiresAuth: true
  //   },
  //   {
  //     path: '/log', // 日志管理
  //     component: Log,
  //     requiredPermissions: [],
  //     requiresAuth: true
  //   },
  //   {
  //     path: '/unauthorized',
  //     component: Unauthorized,
  //     requiredPermissions: [],
  //     requiresAuth: false
  //   }
]
