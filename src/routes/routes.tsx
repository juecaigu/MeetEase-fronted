import LazyComponent from '../components/LazyComponent'
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { protectedLoader } from './load'

export const routes: RouteObject[] = [
  {
    path: '/login', // 登录
    element: LazyComponent({ lazyComponent: lazy(() => import('../pages/Login/Login')) }),
  },
  {
    path: '/signup', // 注册
    element: LazyComponent({ lazyComponent: lazy(() => import('../pages/Login/Signup')) }),
  },
  {
    path: '/',
    loader: protectedLoader,
    element: LazyComponent({ lazyComponent: lazy(() => import('../pages/Home/Layout')) }),
    children: [
      {
        loader: protectedLoader,
        index: true,
        element: <Navigate to="/booking" replace />,
      },
      {
        loader: protectedLoader,
        path: '/booking',
        element: LazyComponent({ lazyComponent: lazy(() => import('../pages/Booking/Booking')) }),
      },
      {
        loader: protectedLoader,
        path: '/booking-record',
        element: LazyComponent({ lazyComponent: lazy(() => import('../pages/Record/BookingRecord')) }),
      },
    ],
  },
]
