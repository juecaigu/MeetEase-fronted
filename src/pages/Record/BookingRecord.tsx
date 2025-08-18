import TimeLine, { type TimeSlot } from '@/components/TimeLine'
import { List, Space, Divider } from 'antd'
import { useState } from 'react'

const mockData: MeetingRoomRecord[] = []

for (let i = 0; i < 100; i++) {
  mockData.push({
    name: `会议室${i + 1}`,
    location: `第${Math.floor(Math.random() * 10)}楼`,
    capacity: Math.floor(Math.random() * 100),
    booking: [],
  })
}

interface MeetingRoomRecord {
  name: string
  location: string
  capacity: number
  booking: TimeSlot[]
}

const BookingRecord = () => {
  const [listData] = useState<MeetingRoomRecord[]>(mockData)
  return (
    <div className="w-full h-full bg-white p-4 overflow-y-auto">
      <List
        size="large"
        bordered
        dataSource={listData}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          onChange: () => {
            //TODO: 分页请求数据
          },
        }}
        renderItem={(item) => {
          return (
            <List.Item>
              <div className="w-full">
                <Space className="mb-4" size={16}>
                  <span className="text-lg font-bold">{item.name}</span>
                  <Divider type="vertical" />
                  <span className="text-sm text-gray-500 ">{item.location}</span>
                  <span className="text-sm text-gray-500">{item.capacity}</span>
                </Space>
                <TimeLine
                  timeSlots={item.booking}
                  currentTime={'2025-08-18 03:10:00'}
                  onCellClick={(overlap) => console.log('点击格子重叠的原始段：', overlap)}
                />
              </div>
            </List.Item>
          )
        }}
      />
    </div>
  )
}

export default BookingRecord
