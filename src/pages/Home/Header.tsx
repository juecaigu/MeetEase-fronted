import { useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoTab from './LogoTab'
import { Avatar, Dropdown, Modal, Space, type MenuProps, type ModalProps } from 'antd'
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '@/config/constant'
import { MeetContext } from '@/context/MeetContext'
import ChangePassword from './ChangPassword'

const Header: React.FC<unknown> = () => {
  const navigate = useNavigate()
  const { userInfo } = useContext(MeetContext)
  const [open, setOpen] = useState<boolean>(false)
  const [modalContent, setModalContent] = useState<{ props: Partial<ModalProps>; content: React.ReactNode } | null>(
    null,
  )

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
      //   onClick: () => {
      //     navigate('/profile')
      //   },
    },
    {
      key: 'changePassword',
      label: '修改密码',
      onClick: () => {
        setOpen(true)
        setModalContent({
          props: {
            closeIcon: false,
            width: 450,
          },
          content: <ChangePassword onCancel={closeModal} user={userInfo.user!} />,
        })
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
    <div className="border-b-1 border-solid border-gray-200 px-4 flex items-center justify-between h-[64px] bg-white">
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
      <Modal
        open={open}
        title={null}
        onCancel={closeModal}
        footer={null}
        centered
        destroyOnHidden
        {...modalContent?.props}
      >
        {modalContent?.content}
      </Modal>
    </div>
  )
}

export default Header
