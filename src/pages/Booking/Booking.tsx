import { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Modal, Button } from 'antd'
import Create from './Create'

const Booking = () => {
  const [open, setOpen] = useState<boolean>(false)
  const startMeeting = () => {
    setOpen(true)
    console.log('startMeeting')
  }
  const handleCancel = () => {
    setOpen(false)
  }
  return (
    <div className="w-full h-full p-4 bg-white">
      <div className="flex justify-end ">
        <div className="flex items-center [&_.anticon]:transition-transform [&_.anticon]:duration-300 hover:[&_.anticon]:rotate-90">
          <Button type="primary" icon={<PlusOutlined />} onClick={startMeeting}>
            发起会议
          </Button>
        </div>
      </div>
      <Modal open={open} onCancel={handleCancel} footer={null} title="发起会议" destroyOnHidden>
        <Create cancel={handleCancel} />
      </Modal>
    </div>
  )
}

export default Booking
