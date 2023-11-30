import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Progress } from "antd";
import styled from "styled-components";
import RoleService from "../../service/RoleService";

const values = {
	10000: [1, 2, 3, 4, 5, 6],
	10001: [3, 4, 5, 6, 7, 8]
}

const Module = styled.div`
  //background-color: #311b92;
  font-size: 2em;
  padding-bottom: .3em;
  //color: white;
`

const SubModule = styled.div`
  //background-color: #311b92;
  font-size: 1.8em;
  padding-bottom: .3em;
  //color: white;
`

const Feature = styled.div`
  //background-color: #64b5f65e;
  font-size: 1.5em;
  padding-bottom: .2em;
`

const ProgressBarWrapper = styled.div`
  .ant-progress-bg {
    height: 1em !important;;
  }
`

export function useAccessRights(factory, deps) {
	const defaultAccessRights = useSelector(state => state.user.defaultAccessRight)
	const [checkedValues, setCheckedValues] = useState({});
	const [selectedValues, setSelectedValues] = useState([]);
	const [isPending, setIsPending] = useState(false);
	const [roleId, setRoleId] = useState(undefined)
	const [moduleId, setModuleId] = useState(undefined);
	
	const modules = useMemo(
		() => defaultAccessRights.map(module => ({ id: module.moduleId, name: module.moduleName})),
		[defaultAccessRights]
	)
	
	
	const treeData = useMemo(() => {
		
		if (!moduleId) {
			return [];
		}
		
		const { subModuleList } = defaultAccessRights.find(module => module.moduleId === moduleId) || [];
		
		return subModuleList.map(subModule => {
				const {subModuleId, subModuleName, featureViewModelList} = subModule;
				return {
					title: <SubModule>{subModuleName}</SubModule>,
					key: `sm${subModuleId}`,
					children: featureViewModelList.map(feature => {
						const { featureId, featureName, actionViewModelList} = feature;
						return {
							title: <Feature>{featureName}</Feature>,
							key: `f${featureId}`,
							children: actionViewModelList.map(action => {
								const {actionId, actionName, accessRightId} = action;
								return {
									title: actionName,
									key: accessRightId,
									moduleId,
									subModuleId,
									featureId,
									actionId,
									isLeaf: true
								}
							})
						}
					})
				}
			})
			.filter(subModule => subModule.children.length > 0)
		
	}, [defaultAccessRights, moduleId]);
	
	
	const onCheck = (checkedKeys, info) => {
		setCheckedValues(prevState => ({
			...prevState,
			[moduleId]: checkedKeys
		}))
	};
	
	const setCheckedAndSelectedValues = values => {
		setCheckedValues(values);
		setSelectedValues(values);
	}
	
	const onSelect = (selectedKeys, info) => {
		setCheckedValues(selectedKeys);
		setSelectedValues(selectedKeys);
		console.log('selected', selectedKeys, info);
	};
	
	const treeConfig = {
		checkedKeys: checkedValues.hasOwnProperty(moduleId) ? checkedValues[moduleId] : [],
		onSelect,
		onCheck,
		treeData,
		checkable: true,
		blockNode: true,
		multiple: true,
		selectable: false,
		defaultExpandedKeys: []
	}
	
	return {
		defaultAccessRights,
		treeData,
		treeConfig,
		onCheck,
		onSelect,
		checkedValues,
		setCheckedValues,
		selectedValues,
		setSelectedValues,
		isPending,
		setIsPending,
		setCheckedAndSelectedValues,
		modules,
		roleId,
		setRoleId,
		moduleId,
		setModuleId
	}
}

export function useRoles() {
	
	const [roles, setRoles] = useState([])
	
	useEffect(() => {
		(async () => {
			const res = await RoleService.getAllRole();
			setRoles(res.data);
		})();
	}, [])
	
	return {
		roles
	}
}