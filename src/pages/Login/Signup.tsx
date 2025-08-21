import { Button, Col, Form, Input, message, Row } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import CustomTheme from './CustomTheme'
import TimerButton from '../../components/TimerButton'
import LogoTab from '../Home/LogoTab'
import { requestCaptcha, requestRegister } from '@/api/api'

const Signup: React.FC<unknown> = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const register = () => {
    form.validateFields().then((values) => {
      setLoading(true)
      requestRegister(values)
        .then((res) => {
          if (res.code === 200) {
            message.success('注册成功', 3000, () => {
              navigate('/login')
            })
          }
        })
        .catch(() => {
          setLoading(false)
        })
    })
  }

  const getCaptcha = () => {
    return new Promise((resolve, reject) => {
      form
        .validateFields(['email'])
        .then((values) => {
          const { email } = values
          requestCaptcha(email).then((res) => {
            if (res.code === 200) {
              message.success('验证码发送成功')
              resolve(true)
            }
          })
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  return (
    <CustomTheme>
      <div className="w-full h-full bg-white">
        <div className="ml-4 h-[64px]">
          <LogoTab />
        </div>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="w-2/5 max-w-100 relative">
            <div>
              <Form form={form} labelCol={{ span: 6 }} size="large" validateTrigger="onBlur" clearOnDestroy>
                <Form.Item
                  name="username"
                  label="用户名"
                  rules={[
                    { required: true, message: '' },
                    {
                      pattern: /^[a-zA-Z0-9_-]{3,50}$/,
                      message: '用户名只能包含字母、数字、下划线和连字符,长度在3-50个字符之间',
                    },
                  ]}
                >
                  <Input placeholder="请输入用户名" />
                </Form.Item>

                <Form.Item
                  name="nickname"
                  label="昵称"
                  rules={[
                    { required: true, message: '' },
                    { min: 2, max: 50, message: '昵称长度必须在2-50个字符之间' },
                  ]}
                >
                  <Input placeholder="请输入昵称" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[
                    { required: true, message: '' },
                    { type: 'email', message: '邮箱格式不正确' },
                  ]}
                >
                  <Input placeholder="请输入邮箱" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="手机号"
                  rules={[
                    { required: true, message: '' },
                    {
                      pattern: /^1[3-9]\d{9}$/,
                      message: '手机号格式不正确',
                    },
                  ]}
                >
                  <Input placeholder="请输入手机号" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="密码"
                  rules={[
                    { required: true, message: '' },
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
                    { required: true, message: '' },
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

                <Form.Item label="验证码">
                  <Row gutter={12}>
                    <Col span={14}>
                      <Form.Item name="captcha" noStyle rules={[{ required: true, message: '请输入验证码' }]}>
                        <Input placeholder="请输入验证码" />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
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
                    确定
                  </Button>
                </Form.Item>
              </Form>
            </div>

            <div className="mt-4 text-right text-sm">
              <span className="text-normal-text">已有账号？</span>
              <Link to="/login" className="ml-2 text-primary">
                登录
              </Link>
            </div>
          </div>
        </div>
      </div>
    </CustomTheme>
  )
}

export default Signup
