import axiosInstance from '../Api';

class PartsReturnService {
  getAllPartReturn(isActive, type) {
    return axiosInstance.post(`/store-return-parts/search/?size=${500}`, {
      isActive: isActive,
      type: type,
    });
  }

  getAllIssueDemand(isActive, type) {
    return axiosInstance.post(`/store/issues/search?page=0&size=${500}`, {
      isActive: isActive,
      type: type,
    });
  }

  savePartReturn(values) {
    return axiosInstance.post('/store-return-parts', values);
  }

  getPartReturnById(id) {
    return axiosInstance.get('/store-return-parts/' + id);
  }

  updatePartReturn(id, value) {
    return axiosInstance.put('/store-return-parts/' + id, value);
  }

  toggleStatus(id, status) {
    return axiosInstance.patch(`/store-return-parts/${id}?active=${status}`);
  }

  toggleApprove(id, values) {
    return axiosInstance.put(`/store-return-parts/decide/${id}`, {
      ...values,
    });
  }
}

export default new PartsReturnService();