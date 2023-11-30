import CommonLayout from "../../layout/CommonLayout";
import { Breadcrumb, Button, Col, Divider, Form, Input, notification, Row, Select, Tree } from "antd";
import ARMCard from "../../common/ARMCard";
import { useCallback, useEffect, useState } from "react";
import { useAccessRights, useRoles } from "../../../lib/hooks/roles";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import RoleAccessRightsService from "../../../service/RoleAccessRightsService";
import { getErrorMessage } from "../../../lib/common/helpers";
import PropTypes from "prop-types";
import RoleService from "../../../service/RoleService";
import { usePaginate } from "../../../lib/hooks/paginations";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import { notifyResponseError, notifySuccess } from "../../../lib/common/notifications";
import Permission from "../../auth/Permission";
import { SUPER_ADMIN_ROLE_ID } from "../users/UserRoleSelect";

export const AccessRightTreeWrapper = styled.div`
  .ant-tree-node-selected {
    background-color: rgba(29, 194, 35, 0.73) !important;
  }

  .ant-tree-checkbox-checked {
    background-color: rgba(29, 194, 35, 0.73) !important;
  }

  .ant-tree-node-content-wrapper {
    width: 100% !important;
  }
`;

export default function RolesAccessRights() {

	const {
		treeConfig,
		setCheckedValues,
		checkedValues,
		setIsPending,
		isPending,
		modules,
		roleId,
		setRoleId,
		moduleId,
		setModuleId
	} = useAccessRights();

	const {roles} = useRoles();
	console.log({roles})

	const fetchAccessRightsForRole = useCallback(async function() {
		if (roleId === undefined) {
			return;
		}
		const res = await RoleAccessRightsService.getRoleAccessRights(roleId);
		setCheckedValues({...res.data});
	}, [roleId])


	useEffect(() => {
		(async () => {
			await fetchAccessRightsForRole();
		})();
	}, [fetchAccessRightsForRole])

	const handleAccessRightsSave = async () => {

		if (roleId === undefined) {
			notification['error']({message: 'Role is required!'});
			return;
		}

		if (moduleId === undefined) {
			notification['error']({message: 'module is required!'});
			return;
		}

		try {
			setIsPending(true);
			const accessRightIds = Object.values(checkedValues).flat().filter(Number);
			await RoleAccessRightsService.assignAccessRights({roleId, accessRightIds})
			notifySuccess("Access Rights Assigned Successfully!")
			await fetchAccessRightsForRole();
		} catch (e) {
			notifyResponseError(e)
		} finally {
			setIsPending(false);
		}
	}

	const layoutConfig = {
		labelSpan: {span: 4},
		wrapperSpan: {span: 16}
	}

	return <CommonLayout>
		 <ARMBreadCrumbs>
			<Breadcrumb separator="/">
				
				<Breadcrumb.Item>
					<i className="fas fa-cog ant-menu-item-icon"/>
					<Link to="/configurations">&nbsp; Configurations</Link>
				</Breadcrumb.Item>
				
				<Breadcrumb.Item>Access Rights</Breadcrumb.Item>
			</Breadcrumb>
      </ARMBreadCrumbs>

	  <Permission permission={["CONFIGURATION_ADMINISTRATION_ACCESS_RIGHTS_SAVE","CONFIGURATION_ADMINISTRATION_ACCESS_RIGHTS_EDIT"]}>
		<ARMCard title={getLinkAndTitle(
			"Assign Access Rights To Role",
			"/configurations",
			false,
			'CONFIGURATION_ADMINISTRATION_ACCESS_RIGHTS_SAVE'
		)}>
			<Row>

				<Col span={14} offset={5}>
					<Form.Item required label="Role" labelCol={layoutConfig.labelSpan} wrapperCol={layoutConfig.wrapperSpan}>
						<SelectInput
							placeholder="Select A Role"
							onChange={value => {
								console.log(value)
								setRoleId(value);
							}}
							options={roles.filter(role => role.id !== SUPER_ADMIN_ROLE_ID)}
						/>
					</Form.Item>

					<Form.Item  required label="Module" labelCol={layoutConfig.labelSpan} wrapperCol={layoutConfig.wrapperSpan}>
						<SelectInput
							placeholder="Select A Module"
							onChange={value => {
								setModuleId(value);
							}}
							options={modules}
						/>
					</Form.Item>
				</Col>

				<Divider/>


				<Col span={10} offset={7}>
					<AccessRightTreeWrapper>
						<Tree
							{...treeConfig}
						/>
					</AccessRightTreeWrapper>

					<SaveAccessRightsButton handleClick={handleAccessRightsSave} loading={isPending}/>
				</Col>
			</Row>
		</ARMCard>
		</Permission>
	</CommonLayout>
}

export function SelectInput({placeholder, onChange, options}) {
	return (
		<Select
			showSearch
			placeholder={placeholder}
			optionFilterProp="children"
			onChange={onChange}
			filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
		>

			{
				options.map(obj =>
					<Select.Option key={obj.id} value={obj.id}>{obj.name}</Select.Option>
				)
			}
		</Select>
	)
}

SelectInput.defaultProps = {
	placeholder: '',
	options: []
};

SelectInput.propTypes = {
	placeholder: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	options: PropTypes.array
};

function SaveAccessRightsButton({handleClick, loading}) {
	return (
		<Button
			onClick={handleClick}
			loading={loading}
			type="primary"
			htmlType="submit"
			style={{
				backgroundColor: "#04AA6D",
				borderColor: "#04AA6D",
				borderRadius: "5px",
			}}
		>
			<span>Save Access Rights</span>
		</Button>
	)
}

SaveAccessRightsButton.defaultProps = {
	loading: false
};

SaveAccessRightsButton.propTypes = {
	handleClick: PropTypes.func.isRequired,
	loading: PropTypes.bool
};