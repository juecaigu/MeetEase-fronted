import logo from '@/assets/images/meetease.svg'
import { Divider } from 'antd'

const LogoTab: React.FC<{ onClick?: () => void }> = ({ onClick = () => {} }) => {
  return (
    <div className="flex items-center h-full" onClick={onClick}>
      <img src={logo} alt="logo" className="w-6 h-6" />
      <Divider type="vertical" style={{ height: '16px', margin: '0 12px' }} />
      <div className="text-xl text-left ml-1 font-bold text-normal-text">Meetease</div>
    </div>
  )
}

export default LogoTab
