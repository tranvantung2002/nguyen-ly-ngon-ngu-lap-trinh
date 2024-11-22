import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LockOutlined,
  AppstoreOutlined,
  SettingOutlined,
  MenuOutlined,
  DollarCircleOutlined,
  YoutubeOutlined,
  ProductOutlined,
  TeamOutlined,
  SolutionOutlined,
  NotificationOutlined,
  BellOutlined,
  UserSwitchOutlined,
  CloudUploadOutlined,
  ApiOutlined,
  ShoppingCartOutlined,
  QuestionCircleOutlined,
  FontSizeOutlined
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Menu,
  Spin,
  theme,
  Typography,
} from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

function MenuBar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [selectKeys, setSelectKeys] = useState([]);
  useEffect(() => {
    setSelectKeys([location.pathname]);
  }, [location]);
  const items = [
    {
      key: "1",
      label: "Quản lý thư viện",
      type: "group",
      children: [
        {
          key: '/home',
          icon: <SettingOutlined />,
          label: <Link to={"/"}>Trang chủ</Link>,
        },
      ],
    },
  ];

  return (
    <Layout
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Sider
        style={{ background: colorBgContainer }}
        className="fixed top-0 left-0 h-screen overflow-auto"
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        collapsedWidth={85}
      >
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={selectKeys}
          items={items}
        />
      </Sider>
      <Layout
        style={{ marginLeft: collapsed ? 85 : 250 }}
        className={"min-h-screen"}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div className="flex">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <div className="pb-4">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default MenuBar;
