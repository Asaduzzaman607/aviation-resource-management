import { Col, List, Row } from 'antd';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import useFeaturesPermission, {
  Types,
} from '../../lib/hooks/useFeaturesPermission';
import { setLocation } from '../../reducers/routeLocation.reducers';
import permissions from '../auth/permissions';
import ARMCard from '../common/ARMCard';
import CommonLayout from '../layout/CommonLayout';

const Procurment = () => {
  const { hasPermission } = useFeaturesPermission();

  const dispatch = useDispatch();
  dispatch(setLocation({ value: 'procurement' }));

  const [procurementSubmodules] = useState([
    {
      name: 'Quote Request',
      permission: permissions.subModules.QUOTE_REQUEST,
      items: [
        {
          name: 'Request for Quotation(RFQ)',
          url: 'add-request-for-quotation',
          permission: permissions.subModuleItems.REQUEST_FOR_QUOTATION_RFQ,
        },
        {
          name: 'Pending RFQ',
          url: 'pending-rfq',
          permission: permissions.subModuleItems.PENDING_RFQ,
        },
        {
          name: 'Approved RFQ',
          url: 'approved-rfq',
          permission: permissions.subModuleItems.APPROVED_RFQ,
        },
        {
          name: 'Quotation',
          url: 'quotation',
          permission: permissions.subModuleItems.QUOTATION,
        },
      ],
    },
    {
      name: 'Comparative Statement',
      permission: permissions.subModules.COMPARATIVE_STATEMENT,
      items: [
        {
          name: 'Generate CS',
          url: 'comparative-statement',
          permission: permissions.subModuleItems.GENERATE_CS,
        },
        {
          name: 'Pending CS',
          url: 'pending-comparative-statement',
          permission: permissions.subModuleItems.PENDING_CS,
        },
        {
          name: 'Approved CS',
          url: 'approved-comparative-statement',
          permission: permissions.subModuleItems.APPROVED_CS,
        },
      ],
    },
    {
      name: 'Purchase Order',
      permission: permissions.subModules.ORDER,
      items: [
        {
          name: 'Order',
          url: 'purchase-order/add',
          permission: permissions.DEFAULT,
        },
        {
          name: 'Pending Order',
          url: 'pending-purchase-order',
          permission: permissions.DEFAULT,
        },
        {
          name: 'Approved Order',
          url: 'approved-purchase-order',
          permission: permissions.DEFAULT,
        },
        // {name: 'Purchase Order Report', url: 'purchase-order-report-list', permission: permissions.DEFAULT},
        // {name: 'Invoice Report', url: 'invoice-report', permission: permissions.DEFAULT},
      ],
    },
    {
      name: 'Purchase Invoice',
      permission: permissions.DEFAULT,
      items: [
        {
          name: 'Purchase Invoice',
          url: 'purchase-invoice',
          permission: permissions.DEFAULT,
        },
        {
          name: 'Pending Purchase Invoice',
          url: 'purchase-invoice/pending',
          permission: permissions.DEFAULT,
        },
        {
          name: 'Approved Purchase Invoice',
          url: 'purchase-invoice/approved',
          permission: permissions.DEFAULT,
        },
      ],
    },
    {
      name: 'Shipment Provider',
      permission: permissions.subModules.MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER,
      items: [
        {
          name: 'Shipment Provider',
          url: 'shipment-provider/add',
          permission:
            permissions.subModuleItems.MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER,
        },
        {
          name: 'Pending Shipment Provider List',
          url: 'pending-shipment-provider',
          permission:
            permissions.subModuleItems
              .MATERIAL_MANAGEMENT_SUPPLIER_PENDING_LIST,
        },
        {
          name: 'Approved Shipment Provider List',
          url: 'approved-shipment-provider',
          permission:
            permissions.subModuleItems
              .MATERIAL_MANAGEMENT_SUPPLIER_APPROVED_LIST,
        },
      ],
    },
    {
      name: 'Supplier',
      permission: permissions.subModules.MATERIAL_MANAGEMENT_SUPPLIER,
      items: [
        {
          name: 'Supplier',
          url: 'supplier/add',
          permission: permissions.subModuleItems.MATERIAL_MANAGEMENT_SUPPLIER,
        },
        {
          name: 'Pending Supplier List',
          url: 'pending-supplier',
          permission:
            permissions.subModuleItems
              .MATERIAL_MANAGEMENT_SUPPLIER_PENDING_LIST,
        },
        {
          name: 'Approved Supplier List',
          url: 'approved-supplier',
          permission:
            permissions.subModuleItems
              .MATERIAL_MANAGEMENT_SUPPLIER_APPROVED_LIST,
        },
      ],
    },
  ]);

  const filteredProcurementSubmodules = useMemo(
    () =>
      procurementSubmodules
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
    [procurementSubmodules]
  );

  return (
    <div>
      <CommonLayout>
        <Row gutter={[6, 6]}>
          {filteredProcurementSubmodules.map((subModule) => (
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
                        to={`/material-management/${item.url}`}
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

export default Procurment;
