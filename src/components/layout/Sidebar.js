import {
  MacCommandOutlined,
  ProfileOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import packageJson from '../../../package.json';
import useFeaturesPermission, {
  Types,
} from '../../lib/hooks/useFeaturesPermission';
import { setMenu } from '../../reducers/menu.reducers';
import permissions from '../auth/permissions';
const { Sider } = Layout;

export default function Sidebar({ collapsed, logo }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedMenu = useSelector((state) => state.menu.selectedMenu);
  const { hasPermission } = useFeaturesPermission();

  const [menus] = useState([
    {
      key: '',
      icon: <i className="fas fa-home" />,
      label: 'Home',
      permission: permissions.DEFAULT,
    },
    {
      key: 'employees',
      icon: <i className="fas fa-users" />,
      label: 'Resource Management',
      permission: permissions.modules.RESOURCE_MANAGEMENT,
    },
    {
      key: 'store',
      icon: <i className="fas fa-archive" />,
      label: 'Technical Store',
      permission: permissions.modules.STORE,
    },
    {
      key: 'material-management',
      icon: <i className="fa fa-shopping-basket" />,
      label: 'Material Management',
      permission: permissions.modules.MATERIAL_MANAGEMENT,
    },
    {
      key: 'frs',
      icon: <i className="fa fa-file-certificate" />,
      label: 'FRS',
      permission: permissions.modules.FRS,
    },
    {
      key: 'planning',
      icon: <i className="fas fa-chart-line" />,
      label: 'Planning',
      permission: permissions.modules.PLANNING,
    },
    {
      key: 'reliability',
      icon: <ProfileOutlined />,
      label: 'Reliability',
      //permission: permissions.modules.PLANNING
    },
    {
      key: 'technical-service',
      icon: <MacCommandOutlined />,
      label: 'Technical Service',
      //permission: permissions.modules.PLANNING
    },
    {
      key: 'configurations',
      icon: <i className="fas fa-cog" />,
      label: 'Configurations',
      permission: permissions.modules.CONFIGURATION,
    },
    {
      key: 'quality',
      icon: <i className="fas fa-clipboard-check" />,
      label: 'Quality',
      permission: permissions.modules.QUALITY,
    },
    {
      key: 'storeInspector',
      icon: <SolutionOutlined />,
      label: 'Store Inspector',
      permission: permissions.modules.STORE_INSPECTOR,
    },
    {
      key: 'audit',
      icon: <i className="fas fa-user-shield" />,
      label: 'Audit',
      permission: permissions.modules.AUDIT,
    },
    {
      key: 'logistic',
      icon: <i className="fas fa-hand-holding-box" />,
      label: 'Logistic',
      permission: permissions.modules.LOGISTIC,
    },
    {
      key: 'finance',
      icon: <i className="fas fa-coins" />,
      label: 'Finance',
      permission: permissions.modules.FINANCE,
    },
  ]);

  const filteredMenus = useMemo(
    () => menus.filter((item) => hasPermission(item.permission, Types.MODULE)),
    [menus]
  );

  return (
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        transition: '.4s',
        boxShadow:
          '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      }}
      width={215}
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme="light"
    >
      <div className="logo">
        <img
          src={logo}
          alt="Logo"
          style={
            collapsed
              ? { marginTop: '15px', width: '100%', transition: '.4s' }
              : { marginTop: '15px', width: '80%', transition: '.4s' }
          }
        />
      </div>

      <Menu
        onClick={(value) => {
          const { key } = value;
          dispatch(setMenu({ key }));
          navigate(`/${key}`);
        }}
        selectedKeys={selectedMenu}
        theme="light"
        mode="inline"
        items={filteredMenus}
      />
      <footer className={'versionCustom'}> v{packageJson.version}</footer>
    </Sider>
  );
}
