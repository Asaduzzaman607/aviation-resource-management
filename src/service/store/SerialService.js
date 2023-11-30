import axiosInstance from '../Api';

class SerialService {
    getAllSerial(size, data) {
        return axiosInstance.post(`/store_part_serial/search?page=0&size=${size}`, data);
    }

    saveSerial(values) {
        return axiosInstance.post('/store_part_serial', values);
    }

    getSerialById(id) {
        return axiosInstance.get('/store_part_serial/' + id);
    }

    updateSerial(id, values) {
        return axiosInstance.put('/store_part_serial/' + id, values);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/store_part_serial/${id}?active=${status}`);
    }

    getPartAvailability(size, data) {
        return axiosInstance.post(`/part-availabilities/search?page=0&size=${size}`, data);
    }
}

export default new SerialService();