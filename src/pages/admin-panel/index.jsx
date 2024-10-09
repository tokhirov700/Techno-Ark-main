import { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Modal } from 'antd';
import { NavLink, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { adminRights } from '../../router/routes';
import MainLogo from '../../assets/texnoark-logo.svg';

const { Header, Sider, Content } = Layout;
const { Item } = Menu;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG, darkDangerItemActiveBg },
  } = theme.useToken();


  const showLogoutConfirm = () => {
    Modal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to log out?',
      onOk: handleLogout,
      onCancel() {},
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token"); 
    navigate('/');
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} width={260}>
        <div className="demo-logo-vertical" />
        

        <div className='flex p-4 gap-2 font-semibold mb-2'>
          <img src={MainLogo} alt="main-logo" />
          {!collapsed && (
            <span className='text-[20px] text-[#fff] flex'>Techno Ark</span>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}>
          {adminRights?.map((item) => (
            <Item key={item.path} icon={item.icon}>
              <NavLink to={item.path} style={{ fontSize: "18px" }}>{item.label}</NavLink>
            </Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={showLogoutConfirm}
            style={{
              fontSize: '16px',
              marginRight: '16px',
            }}
          >
            Logout
          </Button>
        </Header>
        <Content
          style={{
            margin: '0 16px',
            minHeight: "100vh",
            background: darkDangerItemActiveBg,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
