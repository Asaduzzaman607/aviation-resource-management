import React from "react";
import {Navigate, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {initialUser} from "../../reducers/user.reducers";
import {SUPER_ADMIN_ROLE_ID} from "../configaration/users/UserRoleSelect";
import permissions from "../auth/permissions";
import {notifyWarning } from "../../lib/common/notifications";
import { notification } from "antd";

const ProtectRoute = ({children, featureId, superAdminOnly}) => {

  const {pathname} = useLocation()
  const {isLoggedIn,roleId} = useSelector(state => state.user);

  const featureIds = useSelector((state) => {
    try {
      const {moduleIds, subModuleIds, subModuleItemIds} = state?.user?.features || initialUser.features;
      
      const featureIds = {};
      [...moduleIds, ...subModuleIds, ...subModuleItemIds].forEach(id => {
        featureIds[id] = true;
      })

      return featureIds;
    } catch (e) {
      return {}
    }
  });

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (superAdminOnly) {
    if(roleId === SUPER_ADMIN_ROLE_ID){
      return children;
    }else{
      notifyWarning("You have no permission to access the page!") 
      return <Navigate to="/" replace />
    }
  }

  if(roleId === SUPER_ADMIN_ROLE_ID){
    return children;
  }

  if(!featureId ||featureId === permissions.DEFAULT){
    return children;
  }

  if (pathname === "/") {
    return children;
  }

  if (!featureIds.hasOwnProperty(featureId)) {  
    notifyWarning("You have no permission to access the page!")
    return <Navigate to="/" replae />
  }

  return children;
}

ProtectRoute.defaultProps = {
  featureId: null,
  superAdminOnly: false
}

export default ProtectRoute;
