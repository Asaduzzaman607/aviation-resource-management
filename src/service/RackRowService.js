import axiosInstance from "./Api";

class RackRowService {
    SaveRackRow(value) {
        return axiosInstance.post('/store-management/rack-rows/', value);
    }

    getAllRackRow(isActive) {
        return axiosInstance.get(`/store-management/rack-rows/?active=${isActive}`);
    }

    singleRackRow(id) {
        return axiosInstance.get('/store-management/rack-rows/' + id);
    }

    updateRackRow(id, value) {
        return axiosInstance.put('/store-management/rack-rows/' + id, value);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/store-management/rack-rows/${id}?active=${status}`);
    }
    searchRackRow(size,data){
        return axiosInstance.post(`/store-management/rack-rows/search/?size=${size}`, data);
    }
    getRackRowByRack(id){
        return axiosInstance.get('/store-management/rack-rows/rack-row-list/' + id);
    }

}

export default new RackRowService();