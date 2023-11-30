import { Col, List, Row } from 'antd';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useFeaturesPermission, {
  Types,
} from '../../lib/hooks/useFeaturesPermission';
import permissions from '../auth/permissions';
import ARMCard from '../common/ARMCard';
import CommonLayout from '../layout/CommonLayout';

const FRS = () => {
  const { hasPermission } = useFeaturesPermission();

  const [frsSubmodules] = useState([
    {
      name: 'Parts Receive',
      permission: permissions.subModules.PARTS_RECEIVE,
      items: [
        {
          name: 'Stock Inward',
          url: 'stock-inwards',
          permission: permissions.subModuleItems.INWARD,
        },
        // {name:'Goods Receive',url: 'goods-receive-list', permission: permissions.DEFAULT},
      ],
    },
  ]);

  const filteredFrsSubmodules = useMemo(
    () =>
      frsSubmodules
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
    [frsSubmodules]
  );

  return (
    <div>
      <CommonLayout>
        <Row gutter={[6, 6]}>
          {filteredFrsSubmodules.map((subModule) => (
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
                        to={`/frs/${item.url}`}
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

export default FRS;
