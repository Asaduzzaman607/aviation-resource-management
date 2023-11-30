import axiosInstance from '../Api';

class InspectionChecklistService {
    getAllInspectionChecklist(isActive, type) {
        return axiosInstance.post(`/store-inspector/own_department/inspection-checklists/search?size=${500}`, {
            isActive: isActive,
            type: type
        });
    }

    saveInspectionChecklist(values) {
        return axiosInstance.post('/store-inspector/own_department/inspection-checklists', values);
    }

    getInspectionChecklistById(id) {
        return axiosInstance.get('/store-inspector/own_department/inspection-checklists/' + id);
    }

    updateInspectionChecklist(id,value) {
        return axiosInstance.put('/store-inspector/own_department/inspection-checklists/'+ id, value);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/store-inspector/own_department/inspection-checklists/${id}?active=${status}`);
    }

    toggleApprove(id, values) {
        return axiosInstance.put(`/store-inspector/own_department/inspection-checklists/decide/${id}`, {
            ...values
        });
    }

  toggleStatusQuality(id, status) {
      return axiosInstance.patch(`/store-inspector/quality/inspection-checklists/${id}?active=${status}`);
    }

    async toggleApproveQuality(id, values) {
        return axiosInstance.put(`/store-inspector/quality/inspection-checklists/decide/${id}`, {
            ...values
        });
    }
}

export default new InspectionChecklistService();