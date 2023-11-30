import axiosInstance from '../Api';

class LogisticQuotationService {
  vendorSearch(isActive, quoteRequestId) {
    return axiosInstance.post(`/quote-request-vendors/search?size=${500}`, {
      isActive: isActive,
      quoteRequestId: quoteRequestId,
    });
  }

  poPartSearch(data) {
    return axiosInstance.post(`/part-order-items/search`, data);
  }

  SaveQuotation(value) {
    return axiosInstance.post('/logistic/vendor/quotations', value);
  }
  toggleStatus(id, status) {
    return axiosInstance.patch(`/logistic/vendor/quotations/${id}?active=${status}`);
  }

  updateQuotation(id, value) {
    return axiosInstance.put('/logistic/vendor/quotations/' + id, value);
  }

  getQuotationById(id) {
    return axiosInstance.get('/logistic/vendor/quotations/' + id);
  }

  getQuotationByRFQId(id) {
    return axiosInstance.get('/logistic/quote-requests/' + id);
  }
}

export default new LogisticQuotationService();
