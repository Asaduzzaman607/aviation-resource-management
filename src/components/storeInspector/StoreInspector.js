import { Col, List, Row } from 'antd';
import React, {useMemo, useState} from 'react';
import { Link } from 'react-router-dom';
import ARMCard from '../common/ARMCard';
import CommonLayout from '../layout/CommonLayout';
import useFeaturesPermission, {Types} from "../../lib/hooks/useFeaturesPermission";
import permissions from "../auth/permissions";

const StoreInspector = () => {

    const {hasPermission} = useFeaturesPermission();

    const [menus] = useState([
        {
            name: 'Store Inspector',
            permission: permissions.subModules.STORE_INSPECTOR,
            features: [
                { name: 'Store Inspection', url: 'store-inspection-list', permission: permissions.subModuleItems.STORE_INSPECTION },
                { name: 'Grn', url: 'grn-list', permission: '' },
            ]
        },
        {
            name: 'Inspection Checklist',
            permission: permissions.subModules.INSPECTION_CHECKLIST,
            features: [
                { name: 'Inspection Checklist', url: 'inspection-checklist', permission: permissions.subModuleItems.STORE_INSPECTOR_INSPECTION_CHECKLIST},
                { name: 'Pending Inspection Checklist', url: 'pending-inspection-checklist', permission: permissions.subModuleItems.STORE_INSPECTOR_PENDING_INSPECTION_CHECKLIST },
                { name: 'Approved Inspection Checklist', url: 'approved-inspection-checklist', permission: permissions.subModuleItems.STORE_INSPECTOR_APPROVED_INSPECTION_CHECKLIST },
            ]
        },
    ])

    const filteredInspectionSubmodules = useMemo(
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
                {filteredInspectionSubmodules.map((subModule) => (
                    <Col key={subModule.name} md={6} sm={12} xs={24}>
                        <ARMCard title={subModule.name?.toUpperCase()}>
                            <List
                                itemLayout="horizontal"
                                dataSource={subModule.features}
                                renderItem={(item) => (
                                    <List.Item>
                                        <Link style={{ width: "100%" }} to={`/storeInspector/${item.url}`}>
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
};

export default StoreInspector;
