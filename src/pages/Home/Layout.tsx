import React, { useContext } from 'react'
import {
  BookOutlined,
  HistoryOutlined,
  // TeamOutlined,
  // UserOutlined,
  // FileTextOutlined,
  // IdcardOutlined,
  // ToolOutlined,
  // BlockOutlined,
} from '@ant-design/icons'
import { Layout, Menu, type MenuProps } from 'antd'
import { ThemeContext } from '../../context/ThemeContext'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import Header from './Header'

type MenuItem = Required<MenuProps>['items'][number] & {
  code?: string
  children?: MenuItem[]
}

const { Content, Sider } = Layout

const items: MenuItem[] = [
  {
    key: '/booking',
    code: 'booking',
    icon: <BookOutlined />,
    label: <NavLink to="/booking">预订</NavLink>,
  },
  {
    key: '/booking-record',
    code: 'booking-record',
    icon: <HistoryOutlined />,
    label: <NavLink to="/booking-record">预订记录</NavLink>,
  },
  // {
  //   key: '/meeting',
  //   code: 'meeting',
  //   icon: <TeamOutlined />,
  //   label: <NavLink to="/meeting">会议</NavLink>,
  // },
  // {
  //   key: 'role:management',
  //   code: 'role',
  //   label: '角色与用户',
  //   children: [
  //     {
  //       key: 'role',
  //       code: 'role',
  //       icon: <IdcardOutlined />,
  //       label: <NavLink to="/role">角色</NavLink>,
  //     },
  //     {
  //       key: 'user',
  //       code: 'user',
  //       icon: <UserOutlined />,
  //       label: <NavLink to="/user">用户</NavLink>,
  //     },
  //   ],
  // },
  // {
  //   key: 'meeting:management',
  //   label: '会议管理',
  //   children: [
  //     {
  //       key: 'management/meeting-room',
  //       code: 'management/meeting-room',
  //       icon: <BlockOutlined />,
  //       label: <NavLink to="/management/meeting-room">会议室</NavLink>,
  //     },
  //     {
  //       key: 'management/meeting',
  //       code: 'management/meeting',
  //       icon: <TeamOutlined />,
  //       label: <NavLink to="/management/meeting">会议</NavLink>,
  //     },
  //     {
  //       key: 'management/equipment',
  //       code: 'management/equipment',
  //       icon: <ToolOutlined />,
  //       label: <NavLink to="/management/equipment">设备</NavLink>,
  //     },
  //   ],
  // },
  // {
  //   key: 'operation-log',
  //   code: 'operation-log',
  //   icon: <FileTextOutlined />,
  //   label: <NavLink to="/operation-log">操作日志</NavLink>,
  // },
]

const Home: React.FC<unknown> = () => {
  const { theme } = useContext(ThemeContext)
  const location = useLocation()
  return (
    <Layout className="h-screen overflow-hidden">
      <Header />
      <Layout>
        <Sider breakpoint="lg" collapsedWidth="0" theme={theme}>
          <Menu
            mode="inline"
            items={items}
            defaultSelectedKeys={['booking']}
            selectedKeys={[location.pathname]}
            theme={theme}
            className="h-full"
          />
        </Sider>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default Home
