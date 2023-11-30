import axiosInstance from "./Api";

class CancellationServices {

    getAllCancellation(page, size) {

        return axiosInstance.get(`/ac-cancellations?page=${page}&size=${size}`);
    }

    saveCancellation(values) {
        return axiosInstance.post('/ac-cancellations', values);
    }

    getCancellationById(id) {
        return axiosInstance.get('/ac-cancellations/' + id);
    }

    updateCancellation(id, value) {
        return axiosInstance.put('/ac-cancellations/' + id, value);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/ac-cancellations/${id}?active=${status}`);
    }
}

export default new CancellationServices()