import axiosInstance from '../Api';

class QuotationServices {
  vendorSearch(isActive, quoteRequestId) {
    return axiosInstance.post(`/quote-request-vendors/search?size=${500}`, {
      isActive: isActive,
      quoteRequestId: quoteRequestId,
    });
  }

  partSearch(data) {
    return axiosInstance.post(`/store-demand-details/search`, data);
  }

  SaveQuotation(value) {
    return axiosInstance.post('/procurement/vendor/quotations', value);
  }
  toggleStatus(id, status) {
    return axiosInstance.patch(`/procurement/vendor/quotations/${id}?active=${status}`);
  }

  updateQuotation(id, value) {
    return axiosInstance.put('/procurement/vendor/quotations/' + id, value);
  }

  getQuotationById(id) {
    return axiosInstance.get('/procurement/vendor/quotations/' + id);
  }

  getQuotationByRFQId(id) {
    return axiosInstance.get('/procurement/quote-requests/' + id);
  }
}

export default new QuotationServices();
