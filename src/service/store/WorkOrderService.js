import axiosInstance from "../Api";

class WorkOrderService {

    getWorkOrder(isActive, type) {
        return axiosInstance.post(`/store-work-order/search?size=${500}`, {
            isActive: isActive,
            type: type
        });
    }


    saveWorkOrder(values) {
        return axiosInstance.post('/store-work-order', values);
    }

    getWorkOrderById(id) {
        return axiosInstance.get('/store-work-order/' + id);
    }

    updateWorkOrder(id, value) {
        return axiosInstance.put('/store-work-order/' + id, value);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/store-work-order/${id}?active=${status}`);
    }

    toggleApprove(id, values) {
        return axiosInstance.put(`/store-work-order/decide/${id}`, {
            ...values
        });
    }

}

export default new WorkOrderService();