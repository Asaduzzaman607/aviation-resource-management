import CommonLayout from "../layout/CommonLayout";
import { Card, List, Typography, Row, Col } from "antd";
import { Link } from "react-router-dom";
import ARMCard from "../common/ARMCard";
import {useMemo, useState} from "react";
import permissions from "../auth/permissions";
import useFeaturesPermission, {Types} from "../../lib/hooks/useFeaturesPermission";

export default function Configurations() {

	const {hasPermission} = useFeaturesPermission();

	const [menus] = useState([
		{
			name: 'configuration',
			permission: permissions.subModules.CONFIGURATION,
			features: [
				{name: 'Base Plant', url: 'base-plant', permission: permissions.subModuleItems.BASE_PLANT},
				{name: 'Base', url: 'base', permission: permissions.subModuleItems.BASE},
				{name: 'Location', url: 'location', permission: permissions.subModuleItems.LOCATION},
				// {name: 'Company', url: 'companies', permission: permissions.subModuleItems.COMPANY},
				{name: 'Contracted Operator', url: 'operator', permission: permissions.subModuleItems.EXTERNAL_COMPANY},
				{name: 'Currency', url: 'currency', permission: permissions.subModuleItems.CURRENCY},
				{name: 'Vendor Capabilities', url: 'vendor-capabilities-list', permission: permissions.subModuleItems.VENDOR_CAPABILITIES},
				{name: 'Unit Of Measurement', url: 'unit-of-measurement', permission: permissions.subModuleItems.UNIT_OF_MEASUREMENT},
			]
		},
		{
			name: 'administration',
			permission: permissions.subModules.ADMINISTRATION,
			features: [
				{name: 'Users', url: 'users', permission: permissions.subModuleItems.USERS},
				{name: 'Roles', url: 'roles', permission: permissions.subModuleItems.ROLES},
				{name: 'Role Access Rights', url: 'roles/features', permission: permissions.DEFAULT},
				{name: 'Access Rights', url: 'roles/access-rights', permission: permissions.subModuleItems.ACCESS_RIGHTS},
				{name: 'Module', url: 'modules', permission: permissions.subModuleItems.MODULE},
				{name: 'Sub module', url: 'sub-modules', permission: permissions.subModuleItems.SUB_MODULE},
				{name: 'Sub module Item', url: 'sub-module-items', permission: permissions.subModuleItems.SUB_MODULE_ITEM},
				{name:'Workflow Actions', url:"workflow-actions", permission: permissions.subModuleItems.WORKFLOW_ACTIONS},
				{name: 'Approval Settings', url: 'approval-setting-list', permission: permissions.subModuleItems.APPROVAL_SETTINGS},
				// {name: 'Notification Settings', url: 'notification-setting', permissions: permissions.subModuleItems.NOTIFICATION_SETTINGS},
			]
		},{
			name: 'manufacturer',
			permission: permissions.subModules.CONFIGURATION_MANUFACTURER,
			features: [
				{name: 'Manufacturer', url: 'manufacturer/add', permission: permissions.subModuleItems.CONFIGURATION_MANUFACTURE},
				{name: 'Pending Manufacturer', url: 'pending-manufacturers', permission: permissions.subModuleItems.CONFIGURATION_MANUFACTURE},
				{name: 'Approved Manufacturer', url: 'approved-manufacturers', permission: permissions.subModuleItems.CONFIGURATION_MANUFACTURE},
			]
		},
	])

	const filteredConfigurationSubmodules = useMemo(
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
				{filteredConfigurationSubmodules.map((subModule) => (
					<Col key={subModule.name} md={6} sm={12} xs={24}>
						<ARMCard title={subModule.name?.toUpperCase()}>
							<List
								itemLayout="horizontal"
								dataSource={subModule.features}
								renderItem={(item) => (
									<List.Item>
										<Link style={{ width: "100%" }} to={`/configurations/${item.url}`}>
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
	)
}