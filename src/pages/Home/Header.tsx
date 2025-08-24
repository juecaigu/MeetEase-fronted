import { useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoTab from './LogoTab'
import { Avatar, Dropdown, Modal, Space, type MenuProps } from 'antd'
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '@/config/constant'
import { MeetContext } from '@/context/MeetContext'
import ChangePassword from './ChangPassword'
import Profile from './Profile'

const Header: React.FC<unknown> = () => {
  const navigate = useNavigate()
  const { userInfo } = useContext(MeetContext)
  const [open, setOpen] = useState<boolean>(false)
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null)

  const avatar = useMemo(() => {
    return (userInfo.user?.username?.charAt(0) || 'u').toUpperCase()
  }, [userInfo.user])

  const redirectToHome = () => {
    navigate('/')
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    userInfo.logout()
    navigate('/login')
  }

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: '个人资料',
      onClick: () => {
        setOpen(true)
        setModalContent(<Profile login={userInfo.login} userInfo={userInfo.user!} />)
      },
    },
    {
      key: 'changePassword',
      label: '修改密码',
      disabled: userInfo.user?.isAdmin,
      onClick: () => {
        setOpen(true)
        setModalContent(<ChangePassword onCancel={closeModal} user={userInfo.user!} />)
      },
    },
    {
      key: 'logout',
      label: <span className="text-danger">退出登录</span>,
      onClick: logout,
    },
  ]

  const closeModal = () => {
    setModalContent(null)
    setOpen(false)
  }

  return (
    <div className="border-b-1 border-solid border-gray-200 px-4 flex items-center justify-between h-[64px] bg-white min-h-[64px]">
      <div className="cursor-pointer h-full ">
        <LogoTab onClick={redirectToHome} />
      </div>
      <Space size={16}>
        <Dropdown
          arrow
          trigger={['click']}
          menu={{
            items,
          }}
        >
          <Avatar
            style={{
              cursor: 'pointer',
              fontWeight: 700,
              color: 'var(--color-primary)',
              backgroundColor: 'var(--color-primary-300)',
            }}
          >
            {avatar}
          </Avatar>
        </Dropdown>
      </Space>
      <Modal open={open} title={null} onCancel={closeModal} footer={null} centered destroyOnHidden width={460}>
        {modalContent}
      </Modal>
    </div>
  )
}

export default Header
