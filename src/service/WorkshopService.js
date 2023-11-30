import axiosInstance from "./Api";

class WorkshopService {
    SaveWorkshop(value) {
        return axiosInstance.post('/workshops', value);
    }

    getAllWorkshop(isActive) {
        return axiosInstance.get(`/workshops/?active=${isActive}`);
    }

    singleWorkshop(id) {
        return axiosInstance.get('/workshops/' + id);
    }

    updateWorkshop(id, value) {
        return axiosInstance.put('/workshops/' + id, value);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/workshops/${id}?active=${status}`);
    }

}

export default new WorkshopService();