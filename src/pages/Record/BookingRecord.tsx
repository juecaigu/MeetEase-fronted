import React, { useState, useCallback } from 'react'
import { Form, Input, Select, DatePicker, Button, Tag, List, Typography, Row, Col, message, ConfigProvider } from 'antd'
import { SearchOutlined, EnvironmentOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import Loading from '@/components/Loading'
import { BookingStatus } from '@/type/type'
import type { BookingRecord } from '@/type/type'
import { requestGetBookingRecord } from '@/api/api'

const { RangePicker } = DatePicker
const { Text } = Typography

// 搜索表单类型
interface SearchFormData {
  title?: string
  meetingRoomName?: string
  startTime?: string
  endTime?: string
  status?: string
  timeRange?: [string, string]
}

// 状态配置
const statusConfig = {
  [BookingStatus.CONFIRMED]: { text: '已确认', color: 'green' },
  [BookingStatus.CANCELLED]: { text: '已取消', color: 'red' },
  [BookingStatus.DOING]: { text: '进行中', color: 'green' },
  [BookingStatus.COMPLETED]: { text: '已完成', color: 'blue' },
}

const BookingRecord: React.FC<unknown> = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState<BookingRecord[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchParams, setSearchParams] = useState<SearchFormData>({})

  const loadData = useCallback(async (params: SearchFormData, page: number) => {
    setLoading(true)
    requestGetBookingRecord({ ...params, pageNo: page, pageSize: 10 })
      .then((res) => {
        if (res.code === 200) {
          setRecords(res.data.list)
          setTotal(res.data.total)
        }
      })
      .catch((error) => {
        message.error(error.response?.data?.message || error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleSearch = useCallback(
    async (values: SearchFormData) => {
      let startTime = undefined
      let endTime = undefined
      if (Array.isArray(values.timeRange)) {
        startTime = dayjs(values.timeRange[0]).format('YYYY-MM-DD HH:mm')
        endTime = dayjs(values.timeRange[1]).format('YYYY-MM-DD HH:mm')
      }
      setSearchParams({
        ...values,
        startTime,
        endTime,
      })
      setCurrentPage(1)
      await loadData({ ...values, startTime, endTime }, 1)
    },
    [loadData],
  )

  const handleReset = useCallback(() => {
    form.resetFields()
    setSearchParams({})
    setCurrentPage(1)
    loadData({}, 1)
  }, [form, loadData])

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
      loadData(searchParams, page)
    },
    [searchParams, loadData],
  )

  React.useEffect(() => {
    loadData({}, 1)
  }, [loadData])

  const renderRecordItem = (record: BookingRecord) => (
    <List.Item>
      <div className="w-full">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={8} lg={6}>
            <div>
              <Text strong className="text-base">
                {record.title || '会议主题'}
              </Text>
              <br />
              <Text type="secondary" className="text-sm">
                预订人: {record.userName}
              </Text>
            </div>
          </Col>

          <Col xs={24} sm={24} md={8} lg={6}>
            <div className="flex items-center space-x-2">
              <EnvironmentOutlined className="text-blue-500" />
              <div>
                <Text strong>{record.meetingRoom?.name}</Text>
                <br />
                <Text type="secondary" className="text-sm">
                  {record.meetingRoom?.location}
                </Text>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={24} md={8} lg={6}>
            <div className="flex items-center space-x-2">
              <ClockCircleOutlined />
              <div>
                <Text>{dayjs(record.startTime).format('MM-DD')}</Text>
                <br />
                <Text type="secondary">
                  {dayjs(record.startTime).format('HH:mm')} - {dayjs(record.endTime).format('HH:mm')}
                </Text>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={24} md={8} lg={2}>
            <Tag color={statusConfig[record.status].color}>{statusConfig[record.status].text}</Tag>
          </Col>
        </Row>

        {record.remark && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Text type="secondary" className="text-sm">
              <FileTextOutlined className="mr-2" />
              备注: {record.remark}
            </Text>
          </div>
        )}
      </div>
    </List.Item>
  )

  return (
    <div className="h-full w-full flex flex-col gap-4 p-4">
      <div className="shadow-sm bg-white p-4 rounded-sm">
        <ConfigProvider
          theme={{
            components: {
              Form: {
                itemMarginBottom: 0,
              },
            },
          }}
        >
          <Form form={form} layout="vertical" onFinish={handleSearch} className="w-full">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="title" label="会议名称">
                  <Input placeholder="请输入会议名称" allowClear prefix={<SearchOutlined />} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="meetingRoomName" label="会议室">
                  <Input placeholder="请输入会议室名称" allowClear prefix={<EnvironmentOutlined />} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="timeRange" label="预订时间段">
                  <RangePicker
                    showTime
                    minuteStep={30}
                    format="YYYY-MM-DD HH:mm"
                    placeholder={['开始时间', '结束时间']}
                    className="w-full"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="status" label="预订状态">
                  <Select
                    placeholder="请选择状态"
                    allowClear
                    options={[
                      {
                        label: '进行中',
                        value: BookingStatus.DOING,
                      },
                      {
                        label: '已完成',
                        value: BookingStatus.COMPLETED,
                      },
                      {
                        label: '已取消',
                        value: BookingStatus.CANCELLED,
                      },
                      {
                        label: '已确认',
                        value: BookingStatus.CONFIRMED,
                      },
                    ]}
                  ></Select>
                </Form.Item>
              </Col>
            </Row>
            <div className="flex justify-end space-x-3 mt-4">
              <Button onClick={handleReset}>重置</Button>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </div>
          </Form>
        </ConfigProvider>
      </div>
      <div className="bg-white shadow-sm p-4 flex-1 rounded-sm overflow-auto">
        <List
          loading={{
            spinning: loading,
            indicator: <Loading />,
          }}
          dataSource={records}
          renderItem={renderRecordItem}
          pagination={{
            current: currentPage,
            pageSize: 10,
            total: total,
            onChange: handlePageChange,
            showSizeChanger: false,
            showTotal: (total) => `共 ${total} 条`,
            className: 'mt-4',
          }}
        />
      </div>
    </div>
  )
}

export default BookingRecord
