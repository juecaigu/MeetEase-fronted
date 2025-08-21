import { Button, Form, Input } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/images/meetease-dark.svg'
import { useContext, useState } from 'react'
import CustomTheme from './CustomTheme'
import { requestGetTime, requestLogin } from '../../api/api'
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '../../config/constant'
import { setServerTime } from '@/config/serviceTime'
import { MeetContext } from '@/context/MeetContext'

const Login: React.FC<unknown> = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const { userInfo } = useContext(MeetContext)
  const navigate = useNavigate()
  const login = () => {
    form.validateFields({}).then((value: { username: string; password: string }) => {
      setLoading(true)
      requestLogin(value.username, value.password)
        .then((res) => {
          if (res.code === 200) {
            localStorage.setItem(TOKEN_KEY, res.data.token)
            localStorage.setItem(REFRESH_TOKEN_KEY, res.data.fresh_token)
            userInfo.login(res.data.userInfo)
            requestGetTime()
              .then((res) => {
                if (res.code === 200) {
                  setServerTime(res.data.time)
                }
              })
              .finally(() => {
                navigate('/')
              })
          }
        })
        .catch(() => {
          setLoading(false)
        })
    })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      if (!loading) {
        login()
      }
    }
  }

  return (
    <CustomTheme>
      <div className="w-full h-full flex items-center justify-center bg-white">
        <div className="w-2/5 max-w-72">
          <div className="flex justify-center">
            <img src={logo} alt="logo" className="w-8 h-8" />
          </div>
          <h6 className="text-2xl font-bold text-center text-black mt-4">登录 &nbsp; Meetease</h6>
          <div className="mt-4">
            <Form size="large" form={form} onKeyDown={onKeyDown} disabled={loading}>
              <Form.Item name="username" rules={[{ required: true, message: '' }]}>
                <Input placeholder="请输入用户名" />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: '' }]}>
                <Input.Password placeholder="请输入密码" />
              </Form.Item>
            </Form>
          </div>
          <Button size="large" type="primary" htmlType="submit" block onClick={login} loading={loading}>
            登录
          </Button>
          <div className="mt-4 text-right text-sm text-normal-text">
            <span>还没有账号？</span>
            <Link to="/signup" className="ml-2 text-primary">
              注册
            </Link>
          </div>
        </div>
      </div>
    </CustomTheme>
  )
}

export default Login
