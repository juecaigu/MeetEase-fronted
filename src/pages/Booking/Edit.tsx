import { Form, Input, DatePicker, Select, Space, Button, message } from 'antd'
import dayjs from 'dayjs'
import { getServerTimeHalf } from '@/config/serviceTime'
import type { User } from '@/type/type'
import type { MeetingRoomRecord } from '@/type/type'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { requestBooking } from '@/api/api'

interface EditRef {
  updateMeetingRoom: (data: Partial<MeetingRoomRecord> & { meetingRoomName?: string }) => void
}

const Edit = forwardRef<EditRef, { userInfo: User | null; reset: () => void }>(({ userInfo, reset }, ref) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [duration, setDuration] = useState<number | 'custom'>(0.5)

  const initValue = () => {
    return {
      startTime: getServerTimeHalf(),
      title: `${userInfo?.nickname || ''}预订的会议`,
      duration: 0.5,
    }
  }

  const resetEdit = () => {
    form.setFieldsValue({
      meetingRoomId: null,
      meetingRoomName: '',
      endTime: null,
      remark: '',
      ...initValue(),
    })
    setDuration(0.5)
    reset()
  }

  const onSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true)
      let endTime = values.endTime
      if (values.duration !== 'custom' && typeof values.duration === 'number') {
        endTime = dayjs(values.startTime).add(values.duration, 'hour').format('YYYY-MM-DD HH:mm')
      }
      requestBooking({
        meetingRoomId: values.meetingRoomId,
        startTime: dayjs(values.startTime).format('YYYY-MM-DD HH:mm'),
        endTime: endTime,
        title: values.title,
        remark: values.remark,
      })
        .then((res) => {
          if (res.code === 200) {
            message.success('预订成功')
            resetEdit()
          }
        })
        .catch((err) => {
          message.error(err.response?.data?.message || err.message)
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  const changeDuration = (value: number | 'custom') => {
    setDuration(value)
    if (value === 'custom') {
      const startTime = form.getFieldValue('startTime')
      form.setFieldsValue({ endTime: startTime.add(3, 'hour') })
    }
  }

  useImperativeHandle(ref, () => ({
    updateMeetingRoom: (data: Partial<MeetingRoomRecord>) => {
      form.setFieldsValue({ meetingRoomId: data.id, ...data })
    },
  }))

  return (
    <div className="flex flex-col gap-4 justify-center items-center mt-8">
      <Form
        form={form}
        disabled={loading}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        requiredMark={false}
        initialValues={initValue()}
      >
        <Form.Item label="会议主题" name="title" rules={[{ required: true, message: '请输入会议主题' }]}>
          <Input placeholder="请输入会议主题" allowClear variant="underlined" />
        </Form.Item>

        <Form.Item label="会议室" name="meetingRoomName" rules={[{ required: true, message: '请选择会议室' }]}>
          <Input placeholder="选择会议室" allowClear readOnly variant="underlined" />
        </Form.Item>
        <Form.Item label="会议室Id" name="meetingRoomId" hidden>
          <Input />
        </Form.Item>

        <Form.Item label="开始" name="startTime">
          <DatePicker
            showTime
            allowClear={false}
            format="YYYY-MM-DD HH:mm"
            minuteStep={30}
            style={{ width: '100%' }}
            disabledDate={(current) => {
              return current && current.isBefore(dayjs(), 'day')
            }}
            disabledTime={(date) => {
              if (date && date.isSame(dayjs(), 'day')) {
                const now = dayjs()
                const currentHour = now.hour()
                const currentMinute = now.minute()

                return {
                  disabledHours: () => Array.from({ length: currentHour }, (_, i) => i),
                  disabledMinutes: (selectedHour) => {
                    if (selectedHour === currentHour) {
                      return Array.from({ length: Math.ceil(currentMinute / 30) * 30 }, (_, i) => i)
                    }
                    return []
                  },
                }
              }
              return {}
            }}
          />
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
            <DatePicker
              showTime
              allowClear={false}
              format="YYYY-MM-DD HH:mm"
              minuteStep={30}
              style={{ width: '100%' }}
            />
          </Form.Item>
        )}
        {duration !== 'custom' && (
          <Form.Item label="会议时长" name="duration">
            <Select
              onChange={changeDuration}
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
      <Space className="flex justify-center w-full">
        <Button type="primary" onClick={onSubmit} loading={loading}>
          确定
        </Button>
      </Space>
    </div>
  )
})

export default Edit

export type { EditRef }
