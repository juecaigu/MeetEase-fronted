import { useState } from 'react'
import { MeetContext } from './MeetContext'
import type { User } from '@/type/type'

export const MeetProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const login = (credentials: User) => {
    setUser(credentials)
  }

  const logout = () => {
    setUser(null)
  }

  const hasPermission = (requiredPermissions: string[] = []) => {
    if (!user) return false
    if (requiredPermissions.length === 0) return true
    return requiredPermissions.some((permission) => user.permissions.includes(permission))
  }

  return (
    <MeetContext.Provider
      value={{
        userInfo: {
          user,
          login,
          logout,
          hasPermission,
          isAuthenticated: !!user,
        },
      }}
    >
      {children}
    </MeetContext.Provider>
  )
}
