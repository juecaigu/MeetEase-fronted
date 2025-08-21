// src/context/AuthContext.js
import { createContext } from 'react'
import type { User } from '@/type/type'

export const MeetContext = createContext<{
  userInfo: {
    user: User | null
    login: (credentials: User) => void
    logout: () => void
    hasPermission: (requiredPermissions: string[]) => boolean
    isAuthenticated: boolean
  }
}>({
  userInfo: {
    user: null,
    login: () => {},
    logout: () => {},
    hasPermission: () => false,
    isAuthenticated: false,
  },
})
