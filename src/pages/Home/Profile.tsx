import type { User } from '@/type/type'
import { Button, Form, Input, message, Space, Tag } from 'antd'
import CustomTheme from '../Login/CustomTheme'
import RULES from '@/config/rules'
import { requestUpdateUserInfo } from '@/api/api'
import { useState } from 'react'

const RoleTag: React.FC<{ value?: { id: number; name: string }[] }> = ({ value }) => {
  return value?.map((role) => <Tag key={role.id}>{role.name}</Tag>) || []
}

const EditForm = ({
  userInfo,
  setEdit,
  handleSubmit,
}: {
  userInfo: User
  setEdit: (edit: boolean) => void
  handleSubmit: (user: User) => void
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const readonly = { readOnly: true, variant: 'borderless' } as const

  const confirm = () => {
    form.validateFields().then((values) => {
      setLoading(true)
      requestUpdateUserInfo({
        id: userInfo.id,
        nickname: values.nickname,
        email: values.email,
        phone: values.phone,
      })
        .then(() => {
          message.success('修改成功')
          handleSubmit(values)
        })
        .catch((error) => {
          message.error(error.response?.data?.message || error.message)
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  return (
    <>
      <div>
        <Form
          form={form}
          size="large"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={userInfo}
          validateTrigger="onBlur"
          requiredMark={false}
        >
          <Form.Item label="用户名" name="username">
            <Input {...readonly} />
          </Form.Item>
          <Form.Item label="用户编码" name="code">
            <Input {...readonly} />
          </Form.Item>
          <Form.Item label="昵称" name="nickname" rules={RULES.nickname}>
            <Input />
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={RULES.email}>
            <Input />
          </Form.Item>
          <Form.Item label="手机号" name="phone" rules={RULES.phone}>
            <Input />
          </Form.Item>
          {/* TODO:角色用标签形式选取 */}
          <Form.Item label="角色" name="roles">
            <RoleTag />
          </Form.Item>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="permissions" hidden>
            <Input />
          </Form.Item>
        </Form>
      </div>
      <Space className="mt-4 w-full justify-end">
        <Button type="default" onClick={() => setEdit(false)}>
          取消
        </Button>
        <Button type="primary" onClick={confirm} loading={loading}>
          确定
        </Button>
      </Space>
    </>
  )
}

const ViewForm = ({ userInfo, setEdit }: { userInfo: User; setEdit: (edit: boolean) => void }) => {
  const [form] = Form.useForm()
  return (
    <>
      <div className="overflow-hidden w-full">
        <Form
          form={form}
          size="large"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          variant={'borderless'}
          initialValues={userInfo}
          validateTrigger="onBlur"
        >
          <Form.Item label="用户名" name="username">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="用户编码" name="code">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="昵称" name="nickname">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="邮箱" name="email">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="手机号" name="phone">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="角色" name="roles">
            <RoleTag />
          </Form.Item>
        </Form>
      </div>
      {!userInfo.isAdmin && (
        <div className="flex justify-end mt-4">
          <Button
            type="primary"
            onClick={() => {
              setEdit(true)
            }}
          >
            修改
          </Button>
        </div>
      )}
    </>
  )
}

const Profile: React.FC<{ login: (user: User) => void; userInfo: User }> = ({ login, userInfo }) => {
  const [edit, setEdit] = useState(false)
  const [user, setUser] = useState(userInfo)

  const handleSubmit = (user: User) => {
    login(user)
    setEdit(false)
    setUser(user)
  }

  return (
    <CustomTheme>
      <div className="pt-10 px-6">
        {edit ? (
          <EditForm userInfo={user} setEdit={setEdit} handleSubmit={handleSubmit} />
        ) : (
          <ViewForm userInfo={user} setEdit={setEdit} />
        )}
      </div>
    </CustomTheme>
  )
}

export default Profile
