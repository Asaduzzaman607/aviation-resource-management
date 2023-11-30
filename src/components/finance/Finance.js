import { Col, List, Row } from 'antd';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useFeaturesPermission, {
  Types,
} from '../../lib/hooks/useFeaturesPermission';
import permissions from '../auth/permissions';
import ARMCard from '../common/ARMCard';
import CommonLayout from '../layout/CommonLayout';

const Finance = () => {
  const { hasPermission } = useFeaturesPermission();

  const [financeSubmodules] = useState([
    {
      name: 'Material Management PI',
      permission:
        permissions.subModules.MATERIAL_MANAGEMENT_PARTS_INVOICE_FINANCE,
      items: [
        {
          name: 'Pending Purchase Invoice',
          url: 'procurement/pending-purchase-invoice',
          permission:
            permissions.subModuleItems
              .MATERIAL_MANAGEMENT_PENDING_PARTS_INVOICE_FINANCE,
        },
        {
          name: 'Approved Purchase Invoice',
          url: 'procurement/approved-purchase-invoice',
          permission:
            permissions.subModuleItems
              .MATERIAL_MANAGEMENT_APPROVED_PARTS_INVOICE_FINANCE,
        },
      ],
    },
    {
      name: 'Logistic PI',
      permission: permissions.subModules.LOGISTIC_PARTS_INVOICE_FINANCE,
      items: [
        {
          name: 'Pending Purchase Invoice',
          url: 'logistic/pending-purchase-invoice',
          permission:
            permissions.subModuleItems.LOGISTIC_PENDING_PARTS_INVOICE_FINANCE,
        },
        {
          name: 'Approved Purchase Invoice',
          url: 'logistic/approved-purchase-invoice',
          permission:
            permissions.subModuleItems.LOGISTIC_APPROVED_PARTS_INVOICE_FINANCE,
        },
      ],
    },
  ]);

  const filteredFinanceSubmodules = useMemo(
    () =>
      financeSubmodules
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
    [financeSubmodules]
  );

  return (
    <div>
      <CommonLayout>
        <Row gutter={[6, 6]}>
          {filteredFinanceSubmodules.map((subModule) => (
            <Col
              key={subModule.name}
              md={6}
              sm={12}
              xs={24}
            >
              <ARMCard title={subModule.name?.toUpperCase()}>
                <List
                  itemLayout="horizontal"
                  dataSource={subModule.items}
                  renderItem={(item) => (
                    <List.Item>
                      <Link
                        style={{ width: '100%' }}
                        to={`/finance/${item.url}`}
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
    </div>
  );
};

export default Finance;
