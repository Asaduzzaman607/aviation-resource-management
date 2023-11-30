import { useSelector } from "react-redux";

export default function ARMPermission({ children, permission, fallback }) {
	
	const userAccessRights = useSelector(state => state.user.userAccessPermissions);
	
	const hasPermission = () => {
		if (Array.isArray(permission)) {
			return permission.some(p => userAccessRights.hasOwnProperty(p));
		}
		
		return userAccessRights.hasOwnProperty(permission);
	}
	
	if (hasPermission()) {
		return children;
	}
	
	return null;
}