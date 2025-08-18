import { Button, Col, Form, Input, Row } from 'antd'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/meetease.svg'
import { useState } from 'react'
import CustomTheme from './CustomTheme'
import TimerButton from '../../components/TimerButton'

const Signup: React.FC<unknown> = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  // const [avatarUrl, setAvatarUrl] = useState<string>('')

  const register = () => {
    form.validateFields().then((values) => {
      setLoading(true)
      console.log(values)
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    })
  }

  const getCaptcha = () => {
    console.log('getCaptcha')
  }

  return (
    <CustomTheme>
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="absolute top-4 left-4 flex items-center">
          <img src={logo} alt="logo" className="w-6 h-6" />
          <h6 className="text-xl text-left ml-4">注册 &nbsp; Meetease</h6>
        </div>
        <div className="w-2/5 max-w-96 relative">
          <div>
            <Form form={form} labelCol={{ span: 6 }} size="large">
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, max: 50, message: '用户名长度必须在3-50个字符之间' },
                ]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>

              <Form.Item
                name="nickname"
                label="昵称"
                rules={[
                  { required: true, message: '请输入昵称' },
                  { min: 2, max: 50, message: '昵称长度必须在2-50个字符之间' },
                ]}
              >
                <Input placeholder="请输入昵称" />
              </Form.Item>

              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱格式' },
                ]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="手机号"
                rules={[
                  { required: true, message: '请输入手机号' },
                  {
                    pattern: /^1[3-9]\d{9}$/,
                    message: '请输入正确的手机号格式',
                  },
                ]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>

              <Form.Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 8, max: 50, message: '密码长度必须在8-50个字符之间' },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    message: '密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符',
                  },
                ]}
              >
                <Input.Password placeholder="请输入密码" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="确认密码"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'))
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="请确认密码" />
              </Form.Item>

              <Form.Item name="Captcha" label="验证码">
                <Row gutter={8}>
                  <Col span={16}>
                    <Form.Item name="captcha" noStyle rules={[{ required: true, message: '请输入验证码' }]}>
                      <Input placeholder="请输入验证码" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <TimerButton
                      type="primary"
                      block
                      countdownDuration={60000}
                      normalText="获取验证码"
                      countdownText="重新获取"
                      onClick={getCaptcha}
                      enableCountdown={true}
                    />
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item label={null}>
                <Button size="large" type="primary" block htmlType="submit" onClick={register} loading={loading}>
                  确认
                </Button>
              </Form.Item>
            </Form>
          </div>

          <div className="mt-4 text-right text-sm">
            <span>已有账号？</span>
            <Link to="/login" className="ml-2 text-primary">
              登录
            </Link>
          </div>
        </div>
      </div>
    </CustomTheme>
  )
}

export default Signup
