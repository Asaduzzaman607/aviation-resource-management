import axiosInstance from '../Api';

class LogisticPOService {
  SavePO(value) {
    return axiosInstance.post('/logistic/part-orders/all', value);
  }

  manualSavePO(value) {
    return axiosInstance.post('/logistic/part-orders', value);
  }

  manualUpdatePO(id, value) {
    return axiosInstance.put(`/logistic/part-orders/${id}`, value);
  }

  getPOById(id) {
    return axiosInstance.get('/logistic/part-orders/' + id);
  }

  toggleStatus(id, status) {
    return axiosInstance.patch(`/logistic/part-orders/${id}?active=${status}`);
  }

  toggleApprove(id, values) {
    return axiosInstance.put(`/logistic/part-orders/decide/${id}`, {
      ...values,
    });
  }
}

export default new LogisticPOService();
