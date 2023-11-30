import API from "./Api";

class EngineModelService {
	fetchById(id) {
		return API.get(`engine/model/${id}`)
	}
	
	fetchAll(params = { page: 1, size: 10}) {
		return API.post('engine/model/search', params);
	}
	
	save(data) {
		return API.post('/engine/model', data);
	}
	
	update(id, data) {
		return API.put(`/engine/model/${id}`, data);
	}
	
	toggleStatus(id, isActive) {
		return API.patch(`/engine/model/${id}?active=${isActive}`)
	}
	
	fetchAllAirCrafts() {
		return API.get('aircrafts')
	}
}

export default new EngineModelService();