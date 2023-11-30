import { Col, List, Row } from 'antd';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useFeaturesPermission, {
  Types,
} from '../../lib/hooks/useFeaturesPermission';
import permissions from '../auth/permissions';
import ARMCard from '../common/ARMCard';
import CommonLayout from '../layout/CommonLayout';

export default function EmployeeIndex() {
  const { hasPermission } = useFeaturesPermission();

  const [rmSubmodules] = useState([
    {
      name: 'Resource Management',
      permission: permissions.subModules.RESOURCE_MANAGEMENT_SUBMODULE,
      items: [
        {
          name: 'Department',
          url: 'departments',
          permission: permissions.subModuleItems.DEPARTMENT,
        },
        {
          name: 'Section',
          url: 'sections',
          permission: permissions.subModuleItems.SECTION,
        },
        {
          name: 'Designation',
          url: 'designations',
          permission: permissions.subModuleItems.DESIGNATION,
        },
        {
          name: 'Employee',
          url: 'employee',
          permission: permissions.subModuleItems.EMPLOYEE,
        },
      ],
    },
  ]);

  const filteredRMSubmodules = useMemo(
    () =>
      rmSubmodules
        .filter((item) => hasPermission(item.permission, Types.SUB_MODULE))
        .map(({ name, permission, items }) => {
          return {
            name,
            permission,
            items: items.filter((feature) =>
              hasPermission(feature.permission, Types.SUB_MODULE_ITEM)
            ),
          };
        }),
    [rmSubmodules]
  );

  return (
    <CommonLayout>
      <Row gutter={[6, 6]}>
        {filteredRMSubmodules.map((subModule, index) => (
          <Col
            md={6}
            sm={12}
            xs={24}
            key={index}
          >
            <ARMCard title={subModule.name.toUpperCase()}>
              <List
                itemLayout="horizontal"
                dataSource={subModule.items}
                renderItem={(item) => (
                  <List.Item>
                    <Link to={`/employees/${item.url}`}>{item.name}</Link>
                  </List.Item>
                )}
              />
            </ARMCard>
          </Col>
        ))}
      </Row>
    </CommonLayout>
  );
}
