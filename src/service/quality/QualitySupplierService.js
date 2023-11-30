import API from "../Api";

class QualitySupplierService {

    getSupplierById(id) {
        return API.get(`/material-management/config/quality/supplier/${id}`);
    }

    updateSupplier(id, data) {
        return API.put(`/material-management/config/quality/supplier/${id}`, data);
    }

    handleStatus(id, status) {
        return API.patch(`/config/quality/manufacturer/${id}?active=${status}`);
    }

    handleApprove(id, status) {
        return API.put(`/material-management/config/quality/supplier/decide/${id}`, status);
    }

    getAllSupplier(isActive, type, workflowType) {
        return API.post(`/material-management/config/quality/supplier/search?size=${500}`, {
            isActive: isActive,
            type: type,
            workflowType: workflowType
        });
    }
    saveValidity(id,data) {
        return API.put(`/material-management/config/quality/supplier/validity/${id}`, data);
    }
}

export default new QualitySupplierService();