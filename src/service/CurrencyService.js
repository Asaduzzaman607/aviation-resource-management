import axiosInstance from './Api';

class CurrencyService {
  saveCurrency(value) {
    return axiosInstance.post('/store/currencies/', value);
  }
  getAllCurrency(isActive) {
    return axiosInstance.get(`/store/currencies/?active=${isActive}&size=500`);
  }

  singleCurrency(id) {
    return axiosInstance.get('/store/currencies/' + id);
  }

  updateCurrency(id, value) {
    return axiosInstance.put('/store/currencies/' + id, value);
  }

  toggleStatus(id, isActive) {
    return axiosInstance.patch(`/store/currencies/${id}?active=${isActive}`);
  }

  searchCurrency(size, data) {
    return axiosInstance.post(`/store/currencies/search/?size=${size}`, data);
  }
}

export default new CurrencyService();
