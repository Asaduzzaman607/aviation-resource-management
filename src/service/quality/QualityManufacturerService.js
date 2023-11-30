import axiosInstance from '../Api';


class QualityManufacturerService {
    handleStatus(id, status) {
        return axiosInstance.patch(`/config/quality/manufacturer/${id}?active=${status}`);
    }

    handleApprove(id, status) {
        return axiosInstance.put(`/config/quality/manufacturer/decide/${id}`, status);
    }

    updateManufacturer(id, data) {
        return axiosInstance.put(`/config/quality/manufacturer/${id}`, data);
    }

    getManufacturerById(id) {
        return axiosInstance.get(`/config/quality/manufacturer/${id}`);
    }

    getAllManufacturer(isActive, type, workflowType) {
        return axiosInstance.post(`/config/quality/manufacturer/search?size=${500}`, {
            isActive: isActive,
            type: type,
            workflowType: workflowType
        })
    }
    saveValidity(id,data) {
        return axiosInstance.put(`/config/quality/manufacturer/validity/${id}`, data);
    }
}

export default new QualityManufacturerService();