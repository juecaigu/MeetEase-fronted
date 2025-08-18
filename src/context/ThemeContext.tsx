import type { ThemeConfig } from 'antd'
import { createContext } from 'react'

export const ThemeContext = createContext<{
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  themeConfig: ThemeConfig
}>({
  theme: 'light',
  setTheme: () => {},
  themeConfig: {},
})
