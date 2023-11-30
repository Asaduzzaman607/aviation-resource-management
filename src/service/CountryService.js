import axiosInstance from './Api';

class CountryService {
  getAllCountry(size, data) {
    return axiosInstance.post(`/countries/search?page=0&size=${size}`, data);
  }

  saveCountry(values) {
    return axiosInstance.post('/countries', values);
  }

  getCountryById(id) {
    return axiosInstance.get('/countries/' + id);
  }

  updateCountry(id, value) {
    return axiosInstance.put('/countries/' + id, value);
  }

  toggleStatus(id, status) {
    console.log('id status', id, status);
    return axiosInstance.patch(`/countries/${id}?active=${status}`);
  }
}

export default new CountryService();
