import axiosInstance from '../Api';

class LogisticPIService {
  SaveInvoice(value) {
    return axiosInstance.post('/logistic/own_department/parts-invoice', value);
  }

  getInvoiceById(id) {
    return axiosInstance.get('/logistic/own_department/parts-invoice/' + id);
  }

  UpdateInvoice(id, value) {
    return axiosInstance.put('/logistic/own_department/parts-invoice/' + id, value);
  }

  SearchInvoice(values) {
    console.log('values', values);
    return axiosInstance.post(`/logistic/own_department/parts-invoice/search`, values);
  }

  toggleStatus(id, status) {
    return axiosInstance.patch(
      `/logistic/own_department/parts-invoice/${id}?active=${status}`
    );
  }
  toggleStatusAudit(id, status) {
    return axiosInstance.patch(
      `/logistic/audit/parts-invoice/${id}?active=${status}`
    );
  }
  toggleStatusFinance(id, status) {
    return axiosInstance.patch(
      `/logistic/finance/parts-invoice/${id}?active=${status}`
    );
  }

  toggleApprove(id, values) {
    return axiosInstance.put(`/logistic/own_department/parts-invoice/decide/${id}`, {
      ...values,
    });
  }
  toggleApproveAudit(id, values) {
    return axiosInstance.put(`/logistic/audit/parts-invoice/decide/${id}`, {
      ...values,
    });
  }
  toggleApproveFinance(id, values) {
    return axiosInstance.put(`/logistic/finance/parts-invoice/decide/${id}`, {
      ...values,
    });
  }
}

export default new LogisticPIService();
