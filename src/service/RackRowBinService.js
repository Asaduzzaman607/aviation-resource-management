import axiosInstance from "./Api";

class RackRowBinService {
    SaveRackRowBin(value) {
        return axiosInstance.post('/store-management/rack-row-bins/', value);
    }

    getAllRackRowBIn(isActive) {
        return axiosInstance.get(`/store-management/rack-row-bins/?active=${isActive}`);
    }

    singleRackRowBin(id) {
        return axiosInstance.get('/store-management/rack-row-bins/' + id);
    }

    updateRackRowBin(id, value) {
        return axiosInstance.put('/store-management/rack-row-bins/' + id, value);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/store-management/rack-row-bins/${id}?active=${status}`);
    }
    searchRackRowBin(size,data){
        return axiosInstance.post(`/store-management/rack-row-bins/search/?size=${size}`, data);
    }
}

export default new RackRowBinService();