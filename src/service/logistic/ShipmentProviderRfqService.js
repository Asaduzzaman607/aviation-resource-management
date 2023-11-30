import axiosInstance from '../Api';

class ShipmentProviderRfqService {
  getPurchaseOrderById(id) {
    return axiosInstance.get('logistic/part-orders/' + id);
  }

  getAllRequestForQuotation(isActive, type) {
    return axiosInstance.post(
      `/logistic/quote-requests/search?size=${500}`,
      {
        isActive: isActive,
        type: type,
        rfqType: 'logistic',
      }
    );
  }

  saveRequestForQuotation(values) {
    return axiosInstance.post('/logistic/quote-requests', values);
  }

  getRequestForQuotationById(id) {
    return axiosInstance.get('/logistic/quote-requests/' + id);
  }

  updateRequestForQuotation(id, value) {
    return axiosInstance.put('/logistic/quote-requests/' + id, value);
  }

  toggleStatus(id, status) {
    return axiosInstance.patch(
      `/logistic/quote-requests/${id}?active=${status}`
    );
  }

  toggleApprove(id, values) {
    return axiosInstance.put(`/logistic/quote-requests/decide/${id}`, {
      ...values,
    });
  }
}

export default new ShipmentProviderRfqService();
