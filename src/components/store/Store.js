import { Col, List, Row } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import useFeaturesPermission, {
  Types,
} from '../../lib/hooks/useFeaturesPermission';
import { setLocation } from '../../reducers/routeLocation.reducers';
import permissions from '../auth/permissions';
import ARMCard from '../common/ARMCard';

const Store = () => {
  const { hasPermission } = useFeaturesPermission();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLocation({ value: 'store' }));
  }, []);

  const [storeSubmodules] = useState([
    {
      name: 'Parts Demand',
      permission: permissions.subModules.PARTS_DEMAND,
      items: [
        {
          name: 'Demand',
          url: 'item-demand',
          permission: permissions.subModuleItems.STORE_DEMAND,
        },
        {
          name: 'Pending Demand',
          url: 'pending-demand',
          permission: permissions.subModuleItems.PENDING_DEMAND,
        },
        {
          name: 'Approved Demand',
          url: 'approve-demand',
          permission: permissions.subModuleItems.APPROVED_DEMAND,
        },
        //{name: 'Demand Report', url: 'demand-report', permission: permissions.subModuleItems.DEMAND_REPORT},
      ],
    },
    {
      name: 'Parts Issue',
      permission: permissions.subModules.PARTS_ISSUE,
      items: [
        {
          name: 'Issue',
          url: 'issue-demand',
          permission: permissions.subModuleItems.ISSUE_DEMAND,
        },
        {
          name: 'Pending Issues',
          url: 'pending-issues',
          permission: permissions.subModuleItems.PENDING_ISSUES,
        },
        {
          name: 'Approved Issues',
          url: 'approve-issues',
          permission: permissions.subModuleItems.APPROVED_ISSUES,
        },
        //{name: 'Issue Report', url: 'issue-report', permission: permissions.subModuleItems.ISSUE_REPORT},
      ],
    },
    {
      name: 'Store Configuration',
      permission: permissions.subModules.STORE_CONFIGURATION,
      items: [
        {
          name: 'Technical Store',
          url: 'technical-store',
          permission: permissions.subModuleItems.TECHNICAL_STORE,
        },
        {
          name: 'Room',
          url: 'room',
          permission: permissions.subModuleItems.ROOM,
        },
        {
          name: 'Rack',
          url: 'rack',
          permission: permissions.subModuleItems.RACK,
        },
        {
          name: 'Rack Row',
          url: 'rack-row',
          permission: permissions.subModuleItems.RACK_ROW,
        },
        {
          name: 'Rack Row Bin',
          url: 'rack-row-bin',
          permission: permissions.subModuleItems.RACK_ROW_BIN,
        },
        {
          name: 'Stock Room',
          url: 'stock-room',
          permission: permissions.subModuleItems.STOCK_ROOM,
        },
      ],
    },
    {
      name: 'Parts Return',
      permission: permissions.subModules.PARTS_RETURN,
      items: [
        {
          name: 'Parts Return',
          url: 'parts-return',
          permission: permissions.subModuleItems.PARTS_RETURN,
        },
        {
          name: 'Pending Parts Return',
          url: 'pending-parts-return',
          permission: permissions.subModuleItems.PENDING_PARTS_RETURN,
        },
        {
          name: 'Approved Parts Return',
          url: 'approved-parts-return',
          permission: permissions.subModuleItems.APPROVED_PARTS_RETURN,
        },
      ],
    },
    {
      name: 'Parts Requisition',
      permission: permissions.subModules.PARTS_REQUISITION,
      items: [
        {
          name: 'Material Management Requisition',
          url: 'material-management/requisition',
          permission:
            permissions.subModuleItems.MATERIAL_MANAGEMENT_REQUISITION,
        },
        {
          name: 'Pending Material Management Requisition',
          url: 'material-management/requisition/pending',
          permission:
            permissions.subModuleItems.PENDING_MATERIAL_MANAGEMENT_REQUISITION,
        },
        {
          name: 'Approved Material Management Requisition',
          url: 'material-management/requisition/approved',
          permission:
            permissions.subModuleItems.APPROVED_MATERIAL_MANAGEMENT_REQUISITION,
        },
        //{name: 'Material Management Requisition Report', url: '#', permission: permissions.subModuleItems.MATERIAL_MANAGEMENT_REQUISITION_REPORT},
      ],
    },
    {
      name: 'Scrap Parts',
      permission: permissions.subModules.SCRAP_PARTS,
      items: [
        {
          name: 'Scrap Parts',
          url: 'add-scrap-parts',
          permission: permissions.subModuleItems.SCRAP_PARTS,
        },
        {
          name: 'Pending Scrap Parts',
          url: 'pending-scrap-parts',
          permission: permissions.subModuleItems.SCRAP_PARTS,
        },
        {
          name: 'Approved Scrap Parts',
          url: 'approved-scrap-parts',
          permission: permissions.subModuleItems.SCRAP_PARTS,
        },
      ],
    },
    {
      name: 'Parts Availability',
      permission: permissions.subModules.STORE_PARTS_AVAILABILITY,
      items: [
        //{name: 'Store Parts', url: 'store-parts', permission: permissions.subModuleItems.STORE_PARTS},
        {
          name: 'Parts Availability',
          url: 'parts-availability',
          permission: permissions.subModuleItems.PARTS_AVAILABILITY,
        },
        {
          name: 'Unserviceable Report',
          url: 'unserviceable-report-print',
          permission: permissions.subModuleItems.PARTS_AVAILABILITY,
        },
      ],
    },

    /*    {
            name: "work Order (Coming Soon)",
            permission: permissions.DEFAULT,
            items: [
                {name: 'Work Order', url: 'work-order', permission: permissions.DEFAULT},
                {name: 'Pending Work Order', url: 'pending-work-order', permission: permissions.DEFAULT},
                {name: 'Approved Work Order', url: 'approved-work-order', permission: permissions.DEFAULT}
            ]
        }*/
  ]);

  const filteredStoreSubmodules = useMemo(
    () =>
      storeSubmodules
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
    [storeSubmodules]
  );

  return (
    <div>
      <Row gutter={[6, 6]}>
        {filteredStoreSubmodules.map((subModule) => (
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
                      to={`/store/${item.url}`}
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
    </div>
  );
};

export default Store;
