import API from "./Api";

const ASSIGN_ACCESS_RIGHTS_TO_ROLE = 'role/update/access/rights';
const GET_ROLE_ACCESS_RIGHTS = 'role/view/access/rights'

class RoleAccessRightsService {
	async getRoleAccessRights(roleId) {
		return API.get(`${GET_ROLE_ACCESS_RIGHTS}/${roleId}`);
	}
	
	async assignAccessRights(value) {
		return API.put(ASSIGN_ACCESS_RIGHTS_TO_ROLE, value);
	}
}

export default new RoleAccessRightsService();