import {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {isInRange} from "../../../lib/common/math";
import {useRoles} from "../../../lib/hooks/roles";
import {notifyError, notifyResponseError, notifySuccess} from "../../../lib/common/notifications";
import FeatureRoleService from "./FeatureRoleService";

type Module = {
  moduleId: number,
  moduleName: string,
  subModuleList: SubModule[]
}

type SubModule = {
  subModuleId: number,
  subModuleName: string,
  featureViewModelList: Feature[]
}

type Feature = {
  featureId: number,
  featureName: string
}

type RequestData = {
  moduleIds: number[],
  subModuleIds: number[],
  subModuleItemIds: number[],
}

const isModule = isInRange(1, 999);
const isSubModule = isInRange(1000, 9999);

const collectByType = (IDs: number[]): RequestData => {

  const data: RequestData = {
    moduleIds: [],
    subModuleIds: [],
    subModuleItemIds: []
  }

  for (let i = 0; i < IDs.length; i++) {
    const value = IDs[i];

    if (isModule(value)) {
      data.moduleIds.push(value)
      continue;
    }

    if (isSubModule(value)) {
      data.subModuleIds.push(value);
      continue;
    }

    data.subModuleItemIds.push(value);
  }

  return data;
}

export default function useFeatureRole() {
  const [loading, setLoading] = useState<boolean>(false);
  const [roleId, setRoleId] = useState<number>();
  const [checkedKeys, setCheckedKeys] = useState<any>({checked: [], halfChecked: []});
  const defaultAccessRights = useSelector((state: any) => state.user.defaultAccessRight)
  const {roles} = useRoles();

  console.log({ defaultAccessRights })

  const treeData = useMemo(() => defaultAccessRights.map(({moduleId, moduleName, subModuleList}: Module) => {
    return {
      title: moduleName,
      key: moduleId,
      children: subModuleList.map(({subModuleId, subModuleName, featureViewModelList}: SubModule) => {
        return {
          title: subModuleName,
          key: subModuleId,
          children: featureViewModelList.map(({featureId, featureName}: Feature) => ({
            title: featureName,
            key: featureId,
            isLeaf: true
          }))
        }
      })
    }

  }), [defaultAccessRights])

  const data = useMemo(() => collectByType(checkedKeys.checked), [checkedKeys]);
  
  const onSelect = (...args: any) => {
    console.log({ args })
  }

  const onCheck = (selected: any, event: any) => {
    console.log({ selected })
    setCheckedKeys(selected);
  }

  const treeConfig = {
    checkedKeys: checkedKeys,
    onSelect,
    onCheck,
    treeData,
    checkable: true,
    blockNode: true,
    multiple: true,
    selectable: false,
    checkStrictly: true,
    defaultExpandedKeys: []
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!roleId) {
        notifyError("Please Select A Role from dropdown!");
        return;
      }

      await FeatureRoleService.save({...data, roleId: roleId})
      notifySuccess("Feature rights assigned successfully!")
    } catch (e) {
      notifyResponseError(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!roleId) return;

    (async () => {
      const { data: {moduleIds, subModuleIds, subModuleItemIds} } = await FeatureRoleService.get(roleId)
      setCheckedKeys((prevState: any) => ({
        ...prevState,
        checked: [...moduleIds, ...subModuleIds, ...subModuleItemIds]
      }))
    })();

  }, [roleId])

  return {
    roleId,
    setRoleId,
    treeConfig,
    roles,
    loading,
    handleSubmit
  }
}