import axiosInstance from "./Api";

class RackService {
    SaveRack(value) {
        return axiosInstance.post('/store-management/racks/', value);
    }

    getAllRack(isActive) {
        return axiosInstance.get(`/store-management/racks/?active=${isActive}`);
    }

    singleRack(id) {
        return axiosInstance.get('/store-management/racks/' + id);
    }

    updateRack(id, value) {
        return axiosInstance.put('/store-management/racks/' + id, value);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/store-management/racks/${id}?active=${status}`);
    }
    searchRack(size,data) {
        return axiosInstance.post(`/store-management/racks/search/?size=${size}`,data);
    }
    getRackByRoom(id){
        return axiosInstance.get('/store-management/racks/rack-list/' + id);
    }


}

export default new RackService();