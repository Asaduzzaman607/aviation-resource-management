import axiosInstance from '../Api';

class StoreInspectionService {
    getAllStoreInspection(size, data) {
        return axiosInstance.post(`/store-inspector/store-inspection/search?page=0&size=${size}`, data);
    }

    saveStoreInspection(values) {
        return axiosInstance.post('/store-inspector/store-inspection', values);
    }

    getStoreInspectionById(id) {
        return axiosInstance.get('/store-inspector/store-inspection/' + id);
    }

    updateStoreInspection(id,value) {
        return axiosInstance.put('/store-inspector/store-inspection/'+ id, value);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/store-inspector/store-inspection/${id}?active=${status}`);
    }


}

export default new StoreInspectionService();