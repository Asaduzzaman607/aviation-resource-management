import API from "../../../service/Api";

const URI = 'flight-data';

const amlFlightDataService = {
	fetchById: (id) => API.get(`${URI}/${id}`),
	save: (data) => API.post(URI, data),
	update: (id, data) => API.put(`${URI}/${id}`, data),
	toggleStatus: (id, isActive) => API.patch(`${URI}/${id}`, {},{ params: { active: !isActive }})
}

export default amlFlightDataService;