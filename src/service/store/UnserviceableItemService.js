import axiosInstance from "../Api";

class UnserviceableItemService {

    getUnserviceableItem(isActive,type) {
        return axiosInstance.post(`/return-unserviceable-parts/search/?size=${500}`,{
            isActive: isActive,
        });
    }

    saveUnserviceableItem(values) {
        return axiosInstance.post('/return-unserviceable-parts/', values);
    }

    getUnserviceableItemById(id) {
        return axiosInstance.get('/return-unserviceable-parts/' + id);
    }

    updateUnserviceableItem(id, value) {
        return axiosInstance.put('/return-unserviceable-parts/' + id, value);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/return-unserviceable-parts/${id}?active=${status}`);
    }

    toggleApprove(id, values) {
        return axiosInstance.put(`/return-unserviceable-parts/decide/${id}`, {
            ...values
        });
    }

    getUnserviceableReportData () {
        return axiosInstance.get('/store_part_serial/unserviceableComponentList')
    }
}

export default new UnserviceableItemService();