import { useEffect, useState } from 'react'
import { MeetContext } from './MeetContext'
import type { User } from '@/type/type'
import { requestGetUserInfo } from '@/api/api'

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

  useEffect(() => {
    requestGetUserInfo().then((res) => {
      if (res.code === 200 && res.data) {
        res.data.isAdmin = res.data.roles.some((role) => role.admin)
        setUser(res.data)
      }
    })
  }, [])

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
