import API from "../Api";
const AML_COMMON_URL = 'aircraft-maintenance-log';


class AMLService {
	fetchById(id) {
		return API(`${AML_COMMON_URL}/${id}`);
	}
	
	save(data) {
		return API.post(AML_COMMON_URL, data);
	}
	
	update(id, data) {
		return API.put(`${AML_COMMON_URL}/${id}`, data);
	}
	
	toggleStatus(id, isActive) {
				return API.patch(`${AML_COMMON_URL}/${id}`, {}, { params: { active: !isActive}});
	}
	
	amlAllDetails(id) {
		return API.get(`aircraft-maintenance-log/aml-details/${id}`);
	}
	
	getAMLPrevPage(aircraftId) {
		return API.get(`aircraft-maintenance-log/find-aircraft-last-page-no/${aircraftId}`);
	}
	verifyRegularAtl(amlId) {
		return API.get(`/aircraft-maintenance-log/verify-atl/${amlId}`);
	}

	getAllMel(aircraftId){
		return API.get(`mel/find-all-mel/${aircraftId}`);
	}
}

export default new AMLService();
