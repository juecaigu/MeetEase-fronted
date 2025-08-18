// src/context/AuthContext.js
import { createContext, useState } from 'react'

interface User {
  id: number
  name: string
  permissions: string[]
  token: string
}

const AuthContext = createContext<{
  user: User | null
  login: (credentials: User) => void
  logout: () => void
  hasPermission: (requiredPermissions: string[]) => boolean
  isAuthenticated: boolean
}>({
  user: null,
  login: () => {},
  logout: () => {},
  hasPermission: () => false,
  isAuthenticated: false,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        hasPermission,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
