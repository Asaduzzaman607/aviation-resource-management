import axiosInstance from '../Api';

class POService {
  toggleStatus(id, status) {
    return axiosInstance.patch(
      `/procurement/part-orders/${id}?active=${status}`
    );
  }

  toggleStatusAudit(id, status) {
    return axiosInstance.patch(
      `/procurement/part-orders/${id}?active=${status}`
    );
  }

  toggleStatusFinal(id, status) {
    return axiosInstance.patch(
      `/procurement/part-orders/${id}?active=${status}`
    );
  }

  toggleApprove(id, values) {
    return axiosInstance.put(
      `/procurement/comparative-statements/material-management/decide/${id}`,
      {
        ...values,
      }
    );
  }

  toggleApproveAudit(id, values) {
    return axiosInstance.put(
      `/procurement/comparative-statements/audit-management/decide/${id}`,
      {
        ...values,
      }
    );
  }

  toggleApproveFinal(id, values) {
    return axiosInstance.put(
      `/procurement/comparative-statements/final-management/decide/${id}`,
      {
        ...values,
      }
    );
  }

  getDisposals(id) {
    return axiosInstance.get(
      `/procurement/comparative-statements/audit-management/disposal/${id}`
    );
  }

  getExistingCS(id) {
    return axiosInstance.get(
      `/procurement/comparative-statements/material-management/existing/${id}`
    );
  }

  getExistingCSAudit(id) {
    return axiosInstance.get(
      `/procurement/comparative-statements/audit-management/existing/${id}`
    );
  }

  getCsTableData(value, id) {
    return axiosInstance.get(
      value === false
        ? `/procurement/comparative-statements/material-management/existing/${id}`
        : `/procurement/comparative-statements/final-management/existing/${id}`
    );
  }

  getExistingCSFinal(id) {
    return axiosInstance.get(
      `/procurement/comparative-statements/final-management/existing/${id}`
    );
  }

  getQuotationList(id, value) {
    return axiosInstance.get(
      `/procurement/vendor/quotations/cs/${id}?type=${value}`
    );
  }

  getAllCS(value) {
    return axiosInstance.post(
      '/procurement/comparative-statements/material-management/search',
      value
    );
  }

  updateRemarks(id, remarks) {
    return axiosInstance.patch(
      '/procurement/comparative-statements/material-management/update-remarks/' +
        id,
      { remarks }
    );
  }

  pendingToggleStatus(id, status) {
    return axiosInstance.patch(
      `/procurement/comparative-statements/material-management/${id}?active=${status}`
    );
  }

  finalPendingToggleStatus(id, status) {
    return axiosInstance.patch(
      `/procurement/comparative-statements/final-management/${id}?active=${status}`
    );
  }

  csSave(data) {
    return axiosInstance.post(
      '/procurement/comparative-statements/material-management',
      data
    );
  }

  generateCS(orderType, data) {
    return axiosInstance.post(
      `/procurement/comparative-statements/material-management/generate?type=${orderType}`,
      data
    );
  }
}

export default new POService();
