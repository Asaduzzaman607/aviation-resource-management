import axiosInstance from "./Api";

class InterruptionServices {

    getAllInterruption(page, size) {

        return axiosInstance.get(`/aircraft-interruptions?page=${page}&size=${size}`);
    }

    saveInterruption(values) {
        return axiosInstance.post('/aircraft-interruptions', values);
    }

    getInterruptionById(id) {
        return axiosInstance.get('/aircraft-interruptions/' + id);
    }
    getAllPageNoByAircraft(id) {
        return axiosInstance.get('aircraft-maintenance-log/findAmlPageAndAlphabets/' + id);
    }

    updateInterruption(id, value) {
        return axiosInstance.put('/aircraft-interruptions/' + id, value);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/aircraft-interruptions/${id}?active=${status}`);
    }
}

export default new InterruptionServices()