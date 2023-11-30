import { Col, List, Row } from 'antd';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useFeaturesPermission, {
  Types,
} from '../../lib/hooks/useFeaturesPermission';
import permissions from '../auth/permissions';
import ARMCard from '../common/ARMCard';
import CommonLayout from '../layout/CommonLayout';

export default function Audit() {
  const { hasPermission } = useFeaturesPermission();

  const [menus] = useState([
    {
      name: 'Material Management CS',
      //permission: permissions.subModules.COMPARATIVE_STATEMENT,
      permission: permissions.DEFAULT,
      features: [
        {
          name: 'Pending List',
          url: 'pending-audit-cs',
          permission: permissions.subModuleItems.PENDING_CS,
        },
        {
          name: 'Approved List',
          url: 'approved-audit-cs',
          permission: permissions.subModuleItems.APPROVED_CS,
        },
      ],
    },
    {
      name: 'Material Management PI',
      permission:
        permissions.subModules.MATERIAL_MANAGEMENT_PARTS_INVOICE_AUDIT,
      features: [
        {
          name: 'Pending PI List',
          url: 'procurement/pending-Purchase-invoice',
          permission:
            permissions.subModuleItems
              .MATERIAL_MANAGEMENT_PENDING_PARTS_INVOICE_AUDIT,
        },
        {
          name: 'Approved PI List',
          url: 'procurement/approved-Purchase-invoice',
          permission:
            permissions.subModuleItems
              .MATERIAL_MANAGEMENT_APPROVED_PARTS_INVOICE_AUDIT,
        },
      ],
    },
    {
      name: 'Logistic CS',
      permission: permissions.subModules.COMPARATIVE_STATEMENT,
      features: [
        {
          name: 'Logistic CS Pending List',
          url: 'logistic/pending-audit-cs',
          permission: permissions.subModuleItems.PENDING_CS,
        },
        {
          name: 'Logistic CS Approved List',
          url: 'logistic/approved-audit-cs',
          permission: permissions.subModuleItems.APPROVED_CS,
        },
      ],
    },
    {
      name: 'Logistic Purchase Invoice',
      permission: permissions.subModules.LOGISTIC_PARTS_INVOICE_AUDIT,
      features: [
        {
          name: 'Pending PI List',
          url: 'logistic/pending-Purchase-invoice',
          permission:
            permissions.subModuleItems.LOGISTIC_PENDING_PARTS_INVOICE_AUDIT,
        },
        {
          name: 'Approved PI List',
          url: 'logistic/approved-Purchase-invoice',
          permission:
            permissions.subModuleItems.LOGISTIC_APPROVED_PARTS_INVOICE_AUDIT,
        },
      ],
    },
  ]);

  const filteredCsSubmodules = useMemo(
    () =>
      menus
        .filter((item) => hasPermission(item.permission, Types.SUB_MODULE))
        .map(({ name, permission, features }) => {
          return {
            name,
            permission,
            features: features.filter((feature) =>
              hasPermission(feature.permission, Types.SUB_MODULE_ITEM)
            ),
          };
        }),
    [menus]
  );

  return (
    <CommonLayout>
      <Row gutter={[6, 6]}>
        {filteredCsSubmodules.map((subModule) => (
          <Col
            key={subModule.name}
            md={6}
            sm={12}
            xs={24}
          >
            <ARMCard title={subModule.name?.toUpperCase()}>
              <List
                itemLayout="horizontal"
                dataSource={subModule.features}
                renderItem={(item) => (
                  <List.Item>
                    <Link
                      style={{ width: '100%' }}
                      to={`/audit/${item.url}`}
                    >
                      {item.name}
                    </Link>
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
