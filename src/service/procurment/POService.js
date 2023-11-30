import axiosInstance from '../Api';

class POService {
  SavePO(value) {
    return axiosInstance.post('/procurement/part-orders/all', value);
  }

  manualSavePO(value) {
    return axiosInstance.post('/procurement/part-orders', value);
  }

  manualUpdatePO(id, value) {
    return axiosInstance.put(`/procurement/part-orders/${id}`, value);
  }

  getPOById(id) {
    return axiosInstance.get('/procurement/part-orders/' + id);
  }

  toggleStatus(id, status) {
    return axiosInstance.patch(
      `/procurement/part-orders/${id}?active=${status}`
    );
  }

  toggleApprove(id, values) {
    return axiosInstance.put(`/procurement/part-orders/decide/${id}`, {
      ...values,
    });
  }

  poList(size) {
    return axiosInstance.post(
      `/procurement/part-orders/search?page=1&size=${size}`,
      {}
    );
  }
}

export default new POService();
