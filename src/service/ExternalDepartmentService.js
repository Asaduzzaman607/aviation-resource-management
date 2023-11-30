import axiosInstance from "./Api";

class ExternalDepartmentService {
    SaveExternal(value) {
        return axiosInstance.post('/config/external/departments/', value);
    }

    getAllExternal(isActive) {
        return axiosInstance.get(`/config/external/departments/?active=${isActive}`);
    }

    singleExternal(id) {
        return axiosInstance.get('/config/external/departments/' + id);
    }

    updateExternal(id, value) {
        return axiosInstance.put('/config/external/departments/' + id, value);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/config/external/departments/${id}?active=${status}`);
    }
    searchExternalDept(size,data) {
        return axiosInstance.post(`/config/external/departments/search/?size=${size}`,data);
    }

}

export default new ExternalDepartmentService();