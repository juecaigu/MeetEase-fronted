// src/App.js
import { RouterProvider } from 'react-router-dom'
import { MeetProvider } from './context/MeetProvider'
import router from './routes'
import { ConfigProvider } from 'antd'
import { ThemeProvider } from './context/ThemeProvider'
import locale from 'antd/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

function App() {
  return (
    <MeetProvider>
      <ThemeProvider>
        <ConfigProvider
          locale={locale}
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
    </MeetProvider>
  )
}

export default App
