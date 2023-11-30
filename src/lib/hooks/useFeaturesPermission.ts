import {useSelector} from "react-redux";
import {useCallback} from "react";
import {SUPER_ADMIN_ROLE_ID} from "../../components/configaration/users/UserRoleSelect";
import {initialUser} from "../../reducers/user.reducers";

export enum Types {
  MODULE,
  SUB_MODULE,
  SUB_MODULE_ITEM
}

const PERMISSION_NOT_DEFINED = 0;


export default function useFeaturesPermission() {
  const {moduleIds, subModuleIds, subModuleItemIds} = useSelector((state: any) => state?.user?.features || initialUser.features);

  const isSuperAdmin = useSelector((state: any) => state.user.roleId === SUPER_ADMIN_ROLE_ID) as boolean;

  const hasPermission = useCallback((permissionId: number, type: Types) => {

    if (isSuperAdmin) {
      return true;
    }

    if (permissionId === PERMISSION_NOT_DEFINED) {
      return true;
    }

    if (type === Types.MODULE) {
      return moduleIds.includes(permissionId)
    }

    if (type === Types.SUB_MODULE) {
      return subModuleIds.includes(permissionId)
    }

    return subModuleItemIds.includes(permissionId)

  }, [moduleIds, subModuleIds, subModuleItemIds])

  return {
    hasPermission
  }
}