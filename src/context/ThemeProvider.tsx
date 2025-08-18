import { useMemo, useState } from 'react'
import { ThemeContext } from './ThemeContext'
import type { ThemeConfig } from 'antd'

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const themeConfig = useMemo(() => {
    return {} as ThemeConfig
  }, [])

  return <ThemeContext.Provider value={{ theme, setTheme, themeConfig }}>{children}</ThemeContext.Provider>
}
