// src/App.js
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import router from './routes'
import { ConfigProvider } from 'antd'
import { ThemeProvider } from './context/ThemeProvider'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#656FC7',
              borderRadius: 4,
            },
            components: {
              Layout: {
                headerBg: '#fff',
              },
            },
          }}
        >
          <RouterProvider router={router}></RouterProvider>
        </ConfigProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
