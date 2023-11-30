import axiosInstance from '../Api';

class RequestforQuotationService {
  getAllRequestforQuotation(isActive, type) {
    return axiosInstance.post(
      `/procurement/quote-requests/search?size=${500}`,
      {
        isActive: isActive,
        type: type,
        rfqType: 'PROCUREMENT',
      }
    );
  }

  saveRequestforQuotation(values) {
    return axiosInstance.post('/procurement/quote-requests', values);
  }

  getRequestforQuotationById(id) {
    return axiosInstance.get('/procurement/quote-requests/' + id);
  }

  updateRequestforQuotation(id, value) {
    return axiosInstance.put('/procurement/quote-requests/' + id, value);
  }

  toggleStatus(id, status) {
    return axiosInstance.patch(
      `/procurement/quote-requests/${id}?active=${status}`
    );
  }

  toggleApprove(id, values) {
    return axiosInstance.put(`/procurement/quote-requests/decide/${id}`, {
      ...values,
    });
  }
}

export default new RequestforQuotationService();
