import { Button, Form, Input } from 'antd'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/meetease-dark.svg'
import { useState } from 'react'
import CustomTheme from './CustomTheme'

const Login: React.FC<unknown> = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)

  const login = () => {
    form.validateFields().then((values) => {
      setLoading(true)
      console.log(values)
      setTimeout(() => {
        setLoading(false)
      }, 2000)
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
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-2/5 max-w-72">
          <div className="flex justify-center">
            <img src={logo} alt="logo" className="w-8 h-8" />
          </div>
          <h6 className="text-2xl font-bold text-center mt-4">登录 &nbsp; Meetease</h6>
          <div className="mt-4">
            <Form size="large" form={form} onKeyDown={onKeyDown}>
              <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                <Input placeholder="请输入用户名" />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                <Input.Password placeholder="请输入密码" />
              </Form.Item>
            </Form>
          </div>
          <Button size="large" type="primary" htmlType="submit" block onClick={login} loading={loading}>
            登录
          </Button>
          <div className="mt-4 text-right text-sm">
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
