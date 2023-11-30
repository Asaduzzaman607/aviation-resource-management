import { EditOutlined } from '@ant-design/icons';
import { Breadcrumb, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getErrorMessage } from '../../../lib/common/helpers';
import {
  notifyError,
  notifyResponseError,
  notifySuccess,
} from '../../../lib/common/notifications';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import RoleService from '../../../service/RoleService';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';
import ViewRoles from './ViewRoles';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
/* eslint-disable no-template-curly-in-string */

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

export default function RolesList() {
  const CustomARMButton = styled(ARMButton)`
    background-color: #76b2c4;
    border-color: #6e757c;
  `;
  const [roleData, setRoleData] = useState([]);

  const getAllRole = () => {
    RoleService.getAllRole(true)
      .then((response) => {
        setRoleData(response.data);
      })
      .catch((error) => {
        notifyResponseError(error);
      });
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await RoleService.deleteRole(id);
      getAllRole();
      notifySuccess('Role successfully deleted!');
    } catch (er) {
      notifyResponseError(er);
    }
  };

  useEffect(() => {
    getAllRole();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [base, setBase] = useState([]);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-cog" />
            <Link to="/configurations">&nbsp; Configurations</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Roles</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission permission="CONFIGURATION_ADMINISTRATION_ROLES_SEARCH">
        <ARMCard
          title={getLinkAndTitle(
            'Roles',
            '/configurations/add/role',
            true,
            'CONFIGURATION_ADMINISTRATION_ROLES_SAVE'
          )}
        >
          <Row className="table-responsive">
            <ARMTable>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roleData?.map((role, index) => (
                  <tr key={role.id}>
                    <td width="85%">{role.name}</td>
                    <td width="15%">
                      <Space size="small">
                        <Link to={`/configurations/edit/role/${role.id}`}>
                          <ARMButton
                            size="small"
                            type="primary"
                            style={{
                              backgroundColor: '#6e757c',
                              borderColor: '#6e757c',
                            }}
                          >
                            <EditOutlined />
                          </ARMButton>
                        </Link>
                      </Space>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ARMTable>
            <ViewRoles
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              base={base}
            />
          </Row>
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
}
