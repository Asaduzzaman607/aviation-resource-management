import {
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Divider,
  Dropdown,
  Layout,
  Menu,
  Row,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetState } from '../../reducers/paginate.reducers';
import { removeUser } from '../../reducers/user.reducers';
import { clearReduxData } from '../../resetPersist';
import UsersService from '../../service/UsersService';
import defaultAvatar from '../images/logo0.png';
import NotificationDrawer from './NotificationDrawer';

const LOGOUT = 'logout';
const PROFILE = 'profile';
const { Text } = Typography;

export default function AppHeader({ collapsed, setCollapsed }) {
  const userName = useSelector((state) => state.user.username);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  let count = 0;

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleLogOut = async () => {
    try {
      await UsersService.logOut();
      clearReduxData();
      dispatch(resetState());
      dispatch(removeUser());
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  const handleMenuClick = async (selected) => {
    const { key } = selected;

    if (key === LOGOUT) {
      await handleLogOut();
    }

    if (key === PROFILE) {
      const userId = localStorage.getItem('userId');
      navigate(`/configurations/profile/${userId}`);
    }
  };

  const menu = (
    <Menu
      style={{
        marginTop: '-15px',
        cursor: 'pointer',
      }}
      onClick={handleMenuClick}
      items={[
        {
          label: (
            <div
              style={{
                margin: '3px 15px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              <UserOutlined /> <Text>Profile</Text>
            </div>
          ),
          key: PROFILE,
          hidden: userName === 'superadmin',
        },
        {
          label: (
            <div
              style={{
                margin: '3px 15px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              <LogoutOutlined style={{ color: 'red' }} />{' '}
              <Text type="danger">Log Out</Text>
            </div>
          ),
          key: LOGOUT,
        },
      ]}
    />
  );

  return (
    <>
      <Layout.Header
        className="site-layout-background"
        style={{
          color: '#ffffff',
          backgroundColor: '#1e293b',
          fontSize: '16px',
          position: 'sticky',
          top: 0,
          zIndex: 9999999,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {React.createElement(
          collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          }
        )}
        <Row
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Dropdown
            overlay={menu}
            placement="bottom"
          >
            <Row
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <p
                style={{
                  color: '#cbd5e1',
                  marginTop: '15px',
                  marginRight: '10px',
                }}
              >
                {userName}
              </p>
              <Avatar
                size="large"
                icon={<UserOutlined />}
                src={defaultAvatar}
              />
            </Row>
          </Dropdown>
          <Divider type="vertical" />
          <Badge
            count={count}
            onClick={showDrawer}
          >
            <Avatar
              style={{
                cursor: 'pointer',
                backgroundColor: count !== 0 ? 'red' : '#04AA6D',
              }}
              shape="circle"
              size="large"
              icon={<BellOutlined />}
            />
          </Badge>
        </Row>
      </Layout.Header>
      <NotificationDrawer
        count={count}
        open={open}
        onClose={onClose}
      />
    </>
  );
}
