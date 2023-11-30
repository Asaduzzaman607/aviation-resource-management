import axiosInstance from "./Api";

class SystemService {
    saveSystem(value) {
        return axiosInstance.post('/systems/', value);
    }

    getAllSystem(isActive) {
        return axiosInstance.get(`/systems/?active=${isActive}`);
    }

    singleSystem(id) {
        return axiosInstance.get('/systems/' + id);
    }

    updateSystem(id, value) {
        return axiosInstance.put('/systems/' + id, value);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/systems/${id}?active=${status}`);
    }
    searchSystem(size,data) {
        return axiosInstance.post(`/systems/search/?size=${size}`,data);
    }


}

export default new SystemService();