import axiosInstance from './Api';

const BASE_URL = '/cities/';
const COUNTRY_URL = '/countries/';

class CityService {
    saveCity(data) {
        return axiosInstance.post(BASE_URL, data);
    }

    getAllCity(size, data) {
        return axiosInstance.post(`/cities/search/?&size=${size}`, data);
    }

    getAllCitiesUnderACountry(id) {
        return axiosInstance.get(COUNTRY_URL + id);
    }

    getCityById(id) {
        return axiosInstance.get(BASE_URL + id);
    }

    updateCity(id, data) {
        return axiosInstance.put(BASE_URL + id, data);
    }

    toggleCityStatus(id, status) {
        return axiosInstance.patch(BASE_URL + id + '?active=' + status);
    }
}

export default new CityService();
