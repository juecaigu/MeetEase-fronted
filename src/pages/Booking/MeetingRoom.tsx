import { requestGetMeetingRoom } from '@/api/api'
import type { MeetingRoomRecord } from '@/type/type'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import dayjs from 'dayjs'
import { message, List, Divider, Radio } from 'antd'
import TimeLine from '@/components/TimeLine'
import Loading from '@/components/Loading'
import { getServerTimeHalf } from '@/config/serviceTime'

type SelectEventParams = (data: { id: number; name: string }) => void

interface MeetingRoomRef {
  reset: () => void
}

const MeetingRoom = forwardRef<MeetingRoomRef, { onSelect: SelectEventParams }>(({ onSelect }, ref) => {
  const [listData, setListData] = useState<MeetingRoomRecord[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [pageNo, setPageNo] = useState<number>(1)
  const [selectId, setSelectId] = useState<number | null>(null)

  const currentTime = dayjs(getServerTimeHalf()).format('YYYY-MM-DD HH:mm')

  const queryMeetingRoom = (page: number, pageSize: number) => {
    setLoading(true)
    requestGetMeetingRoom({
      pageNo: page,
      pageSize: pageSize,
      date: dayjs(currentTime).format('YYYY-MM-DD'),
    })
      .then((res) => {
        if (res.code === 200 && res.data) {
          setListData(res.data.data)
        }
      })
      .catch((err) => {
        message.error(err.response?.data?.message || err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const selectMeetingRoom = (item: MeetingRoomRecord) => {
    onSelect({ id: item.id, name: item.name })
  }

  useEffect(() => {
    queryMeetingRoom(1, 10)
  }, [])

  useImperativeHandle(ref, () => ({
    reset: () => {
      setSelectId(null)
      setPageNo(1)
      queryMeetingRoom(1, 10)
    },
  }))

  return (
    <Radio.Group name="meetingRoom" className="h-full w-full" value={selectId}>
      <List
        size="large"
        bordered
        className="overflow-auto"
        dataSource={listData}
        loading={{
          spinning: loading,
          indicator: <Loading />,
        }}
        pagination={{
          current: pageNo,
          pageSize: 10,
          showSizeChanger: false,
          onChange: (page, pageSize) => {
            setPageNo(page)
            queryMeetingRoom(page, pageSize)
          },
          showTotal: (total) => `共 ${total} 条`,
        }}
        renderItem={(item) => {
          return (
            <List.Item>
              <div className="w-full min-w-120 relative">
                <div className="relative w-full flex items-center h-12 gap-2">
                  <Radio
                    value={item.id}
                    onClick={() => {
                      setSelectId(item.id)
                      selectMeetingRoom(item)
                    }}
                  />
                  <div className="text-lg font-bold max-w-30/100 cus-ellipsis" title={item.name}>
                    {item.name}
                  </div>
                  <Divider type="vertical" />
                  <div className="text-sm text-gray-500 max-w-20/100 cus-ellipsis">{item.location}</div>
                  <div className="text-sm text-gray-400">{`${item.capacity || 0}人`}</div>
                </div>
                <TimeLine
                  timeSlots={item.bookings.map((booking) => ({
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    status: 1,
                  }))}
                  currentTime={currentTime}
                />
              </div>
            </List.Item>
          )
        }}
      />
    </Radio.Group>
  )
})

export default MeetingRoom

export type { SelectEventParams, MeetingRoomRef }
