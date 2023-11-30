import axiosInstance from '../Api';

class PInvoiceService {
  SaveInvoice(value) {
    return axiosInstance.post('/procurement/own_department/parts-invoice', value);
  }

  getInvoiceById(id) {
    return axiosInstance.get('/procurement/own_department/parts-invoice/' + id);
  }

  UpdateInvoice(id, value) {
    return axiosInstance.put('/procurement/own_department/parts-invoice/' + id, value);
  }

  SearchInvoice(values) {
    console.log('values', values);
    return axiosInstance.post(`/procurement/own_department/parts-invoice/search`, values);
  }

  toggleStatus(id, status) {
    return axiosInstance.patch(`/procurement/own_department/parts-invoice/${id}?active=${status}`);
  }
  toggleStatusAudit(id, status) {
    return axiosInstance.patch(`/procurement/audit/parts-invoice/${id}?active=${status}`);
  }
  toggleStatusFinance(id, status) {
    return axiosInstance.patch(`/procurement/finance/parts-invoice/${id}?active=${status}`);
  }

  toggleApprove(id, values) {
    return axiosInstance.put(`/procurement/own_department/parts-invoice/decide/${id}`, {
      ...values,
    });
  }
  toggleApproveAudit(id, values) {
    return axiosInstance.put(`/procurement/audit/parts-invoice/decide/${id}`, {
      ...values,
    });
  }
  toggleApproveFinance(id, values) {
    return axiosInstance.put(`/procurement/finance/parts-invoice/decide/${id}`, {
      ...values,
    });
  }

  partiallyApproved(values) {
    return axiosInstance.post('/procurement/finance/parts-invoice/partially', values)
  }
}

export default new PInvoiceService();
