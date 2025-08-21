import { Button, Col, Form, Input, Row, Space } from 'antd'
import CustomTheme from '../Login/CustomTheme'
import TimerButton from '@/components/TimerButton'
import { useState } from 'react'
import { requestCaptcha, requestChangePassword } from '@/api/api'

const ChangePassword: React.FC<{ onCancel: () => void; user: { id: number; email: string } }> = ({
  onCancel,
  user,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = () => {
    setLoading(true)
    form
      .validateFields()
      .then((values) => {
        requestChangePassword({
          id: user.id,
          newPassword: values.newPassword,
          captcha: values.captcha,
        }).then(() => {
          onCancel()
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const getCaptcha = () => {
    return new Promise((resolve) => {
      requestCaptcha(user.email).then((res) => {
        if (res.code === 200) {
          resolve(true)
        }
      })
    })
  }

  return (
    <CustomTheme>
      <div className="pt-8 px-6 w-100">
        <Form form={form} validateTrigger="onBlur" layout="vertical" size="large">
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: '' },
              { min: 8, max: 50, message: '密码长度必须在8-50个字符之间' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: '密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符',
              },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="请确认新密码" />
          </Form.Item>
          <Form.Item name="captcha" rules={[{ required: true, message: '' }]}>
            <Row gutter={12}>
              <Col span={16}>
                <Input placeholder="验证码" />
              </Col>
              <Col span={8}>
                <TimerButton
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
        </Form>
        <Space className="mt-4 w-full justify-end">
          <Button type="default" onClick={onCancel}>
            取消
          </Button>
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            确定
          </Button>
        </Space>
      </div>
    </CustomTheme>
  )
}

export default ChangePassword
