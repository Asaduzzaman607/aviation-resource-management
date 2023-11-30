import axiosInstance from "../Api";

class VendorCapabilitiesService {

    getAllVendorCapabilitiesService(size, data) {
        return axiosInstance.post(`/configuration/vendor-capabilities/search?page=0&size=${size}`, data);
    }

    saveVendorCapabilitiesService(values) {
        return axiosInstance.post('/configuration/vendor-capabilities', values);
    }

    getVendorCapabilitiesServicetById(id) {
        return axiosInstance.get('/configuration/vendor-capabilities/' + id);
    }

    updateVendorCapabilitiesService(id, value) {
        return axiosInstance.put('/configuration/vendor-capabilities/' + id, value);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/configuration/vendor-capabilities/${id}?active=${status}`);
    }
}

export default new VendorCapabilitiesService();