import logo from '@/assets/images/meetease.svg'
import { Divider } from 'antd'

const LogoTab = () => {
  return (
    <div className="flex items-center h-[64px] pl-[16px] border-b-1 border-solid border-gray-200">
      <img src={logo} alt="logo" className="w-6 h-6" />
      <Divider type="vertical" style={{ height: '16px', margin: '0 12px' }} />
      <h6 className="text-xl text-left ml-1 font-bold cursor-default text-normal-text">Meetease</h6>
    </div>
  )
}

export default LogoTab
