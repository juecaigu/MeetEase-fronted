import React, { useState } from 'react'
import { Form, Input, DatePicker, Button, Space, Select } from 'antd'
import dayjs from 'dayjs'

interface CreateProps {
  cancel: () => void
  submit?: (values: unknown) => void
}

const Create: React.FC<CreateProps> = ({ cancel, submit }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [duration, setDuration] = useState<number | 'custom'>(0.5)

  const onSubmit = () => {
    form.validateFields().then((values) => {
      console.log(values)
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 2000)
      submit?.(values)
    })
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center mt-8">
      <Form form={form} disabled={loading} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Form.Item label="会议主题" name="title" rules={[{ required: true, message: '请输入会议主题' }]}>
          <Input placeholder="请输入会议主题" allowClear variant="underlined" />
        </Form.Item>

        <Form.Item label="会议室" name="meetingRoom" rules={[{ required: true, message: '请选择会议室' }]}>
          <Input placeholder="选择会议室" allowClear readOnly variant="underlined" />
        </Form.Item>

        <Form.Item label="开始" name="startTime" rules={[{ required: true, message: '请选择开始日期' }]}>
          <DatePicker showTime format="YYYY-MM-DD HH:mm" minuteStep={30} style={{ width: '100%' }} />
        </Form.Item>
        {duration === 'custom' && (
          <Form.Item
            label="结束"
            name="endTime"
            dependencies={['startTime']}
            rules={[
              { required: true, message: '请选择结束日期' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const start = getFieldValue('startTime')
                  if (!value || !start) return Promise.resolve()
                  if (dayjs(value).isBefore(dayjs(start))) {
                    return Promise.reject(new Error('结束时间不能早于开始时间'))
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" minuteStep={30} style={{ width: '100%' }} />
          </Form.Item>
        )}
        {duration !== 'custom' && (
          <Form.Item label="会议时长" name="duration">
            <Select
              defaultValue={0.5}
              onChange={(value) => setDuration(value)}
              options={[
                { label: '半小时', value: 0.5 },
                { label: '1小时', value: 1 },
                { label: '2小时', value: 2 },
                { label: '自定义', value: 'custom' },
              ]}
            />
          </Form.Item>
        )}

        <Form.Item label="备注">
          <Input.TextArea placeholder="请输入备注" allowClear rows={4} />
        </Form.Item>
      </Form>
      <Space className="flex justify-end w-full">
        <Button onClick={cancel}>取消</Button>
        <Button type="primary" onClick={onSubmit} loading={loading}>
          确定
        </Button>
      </Space>
    </div>
  )
}

export default Create
