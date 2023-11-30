import axiosInstance from "./Api";

class RevisionServices {
    saveRevision(value) {
        return axiosInstance.post('/settings/', value);
    }

    getAllRevision() {
        return axiosInstance.get(`/settings`);
    }

   getAmpRevision() {
        return axiosInstance.get(`/settings`);
    }

    singleRevision(id) {
        return axiosInstance.get('/settings/' + id);
    }

    updateRevision(id, value) {
        return axiosInstance.put('/settings/' + id, value);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/settings/${id}?active=${status}`);
    }
    searchRevision(size,data) {
        return axiosInstance.post(`/settings/search/?size=${size}`,data);
    }


}

export default new RevisionServices();