import { useContext, useRef } from 'react'
import { Splitter } from 'antd'
import { MeetContext } from '@/context/MeetContext'
import Edit, { type EditRef } from './Edit'
import MeetingRoom, { type MeetingRoomRef, type SelectEventParams } from './MeetingRoom'

const Booking = () => {
  const { userInfo } = useContext(MeetContext)
  const editRef = useRef<EditRef>(null)
  const meetingRoomRef = useRef<MeetingRoomRef>(null)

  const onSelect: SelectEventParams = (data) => {
    editRef.current?.updateMeetingRoom({ id: data.id, meetingRoomName: data.name })
  }

  const reset = () => {
    meetingRoomRef.current?.reset()
  }

  return (
    <div className="w-full h-full p-4 bg-white">
      <Splitter className="h-full">
        <Splitter.Panel defaultSize="40%" min="2%" max="60%">
          <div className="h-full w-full p-8 min-w-80 overflow-x-auto">
            <Edit userInfo={userInfo.user} ref={editRef} reset={reset} />
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div className="h-full w-full bg-white p-4">
            <MeetingRoom onSelect={onSelect} ref={meetingRoomRef} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  )
}

export default Booking
