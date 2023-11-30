import axiosInstance from "./Api";

class LastShopInfoServices {

    getAllLastShop(page, size) {

        return axiosInstance.get(`/aircraft-apu?page=${page}&size=${size}`);
    }

    saveLastShop(values) {
        return axiosInstance.post('/aircraft-apu', values);
    }

    getLastShopById(id) {
        return axiosInstance.get('/aircraft-apu/' + id);
    }

    getApuAvailableAircraft() {
        return axiosInstance.get('aircrafts/find-all-apu_available_aircraft');
    }

    updateLastShop(id, value) {
        return axiosInstance.put('/aircraft-apu/' + id, value);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/aircraft-apu/${id}?active=${status}`);
    }
}

export default new LastShopInfoServices();