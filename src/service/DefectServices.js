import axiosInstance from "./Api";

class DefectServices {

    getAllDefect(page, size) {

        return axiosInstance.get(`/defect?page=${page}&size=${size}`);
    }

    saveDefect(values) {
        return axiosInstance.post('/defect', values);
    }

    getDefectById(id) {
        return axiosInstance.get('/defect/' + id);
    }

    getAllPartsByAircraftId(id) {
        return axiosInstance.get(`/part/part-by-aircraft?aircraftId=${id}`);
    }


    updateDefect(id, value) {
        return axiosInstance.put('/defect/' + id, value);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/defect/${id}?active=${status}`);
    }
}

export default new DefectServices()