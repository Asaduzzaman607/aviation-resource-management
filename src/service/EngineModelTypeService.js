import API from "./Api";

class EngineModelTypeService {
	fetchById(id) {
		return API.get(`engine/model/type/${id}`);
	}
	
	fetchAll(params = {}) {
		return API.get('engine/model/type/list', { params });
	}
	
	save(data) {
		return API.post('engine/model/type/save', data);
	}
	
	update(data) {
		return API.put('engine/model/type/update', data);
	}
	
	toggleStatus(id) {
		return API.put(`engine/model/type/status/toggle/${id}`);
	}
}

export default new EngineModelTypeService();