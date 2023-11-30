import CommonLayout from '../layout/CommonLayout';
import { List, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import ARMCard from '../common/ARMCard';
import useFeaturesPermission, {Types} from "../../lib/hooks/useFeaturesPermission";
import {useMemo, useState} from "react";
import permissions from "../auth/permissions";

export default function Quality() {

  const {hasPermission} = useFeaturesPermission();

  const [menus] = useState([
    {
      name: 'manufacturer',
      permission: permissions.subModules.QUALITY_MANUFACTURER,
      features: [
        { name: 'Pending List', url: 'pending-manufacturers', permission: permissions.subModuleItems.QUALITY_MANUFACTURER_PENDING_LIST },
        { name: 'Approved List', url: 'approved-manufacturers', permission: permissions.subModuleItems.QUALITY_MANUFACTURER_APPROVED_LIST },
      ]
    },
    {
      name: 'supplier',
      permission: permissions.subModules.QUALITY_SUPPLIER,
      features: [
        { name: 'Pending List', url: 'pending-suppliers', permission: permissions.subModuleItems.QUALITY_SUPPLIER_PENDING_LIST},
        { name: 'Approved List', url: 'approved-suppliers', permission: permissions.subModuleItems.QUALITY_SUPPLIER_APPROVED_LIST },
      ]
    },
    // {
    //   name: "Shipment Provider",
    //   permission: permissions.subModules.QUALITY_SHIPMENT_PROVIDER,
    //   features: [
    //     {name: 'Pending shipment provider List', url: 'pending-shipment-provider', permission: permissions.subModuleItems.QUALITY_SHIPMENT_PROVIDER_PENDING_LIST},
    //     {name: 'Approved shipment provider List', url: 'approved-shipment-provider', permission: permissions.subModuleItems.QUALITY_SHIPMENT_PROVIDER_APPROVED_LIST},
    //   ],
    // },
    {
      name: "Inspection Checklist",
      permission: permissions.subModules.QUALITY_INSPECTION_CHECKLIST,
      features: [
        {name: 'Pending Inspection CheckList', url: 'pending-inspection-checklist', permission: permissions.subModuleItems.QUALITY_PENDING_INSPECTION_CHECKLIST},
        {name: 'Approved Inspection CheckList', url: 'approved-inspection-checklist', permission: permissions.subModuleItems.QUALITY_APPROVED_INSPECTION_CHECKLIST},
      ],
    }
  ])

  const filteredQualitySubmodules = useMemo(
    () => menus
      .filter(item => hasPermission(item.permission, Types.SUB_MODULE))
      .map(({name, permission, features}) => {
        return {
          name,
          permission,
          features: features.filter(feature => hasPermission(feature.permission, Types.SUB_MODULE_ITEM))
        }
      }),
    [menus]
  );

  return (
    <CommonLayout>
      <Row gutter={[6, 6]}>
        {filteredQualitySubmodules.map((subModule) => (
          <Col key={subModule.name} md={6} sm={12} xs={24}>
            <ARMCard title={subModule.name?.toUpperCase()}>
              <List
                itemLayout="horizontal"
                dataSource={subModule.features}
                renderItem={(item) => (
                  <List.Item>
                    <Link style={{ width: "100%" }} to={`/quality/${item.url}`}>
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
