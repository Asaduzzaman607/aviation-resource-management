import axiosInstance from '../Api';

class LogisticCSService {
  toggleStatus(id, status) {
    return axiosInstance.patch(`/logistic/part-orders/${id}?active=${status}`);
  }

  toggleStatusAudit(id, status) {
    return axiosInstance.patch(`/logistic/part-orders/${id}?active=${status}`);
  }

  toggleStatusFinal(id, status) {
    return axiosInstance.patch(`/logistic/part-orders/${id}?active=${status}`);
  }

  toggleApprove(id, values) {
    return axiosInstance.put(
      `/logistic/comparative-statements/material-management/decide/${id}`,
      {
        ...values,
      }
    );
  }

  toggleApproveAudit(id, values) {
    return axiosInstance.put(
      `/logistic/comparative-statements/audit-management/decide/${id}`,
      {
        ...values,
      }
    );
  }

  toggleApproveFinal(id, values) {
    return axiosInstance.put(
      `/logistic/comparative-statements/final-management/decide/${id}`,
      {
        ...values,
      }
    );
  }

  getExistingCS(id) {
    return axiosInstance.get(
      `/logistic/comparative-statements/material-management/existing/${id}`
    );
  }

  getExistingCSAudit(id) {
    return axiosInstance.get(
      `/logistic/comparative-statements/audit-management/existing/${id}`
    );
  }

  getExistingCSFinal(id) {
    return axiosInstance.get(
      `/logistic/comparative-statements/final-management/existing/  ${id}`
    );
  }

  generateCS(data) {
    return axiosInstance.post(
      `/logistic/comparative-statements/material-management/generate`,
      data
    );
  }

  getDisposals(id) {
    return axiosInstance.get(
      `/procurement/comparative-statements/audit-management/disposal/${id}`
    );
  }

  finalPendingToggleStatus(id, status) {
    return axiosInstance.patch(
      `/logistic/comparative-statements/final-management/${id}?active=${status}`
    );
  }

  updateRemarks(id, remarks) {
    return axiosInstance.patch(
      '/logistic/comparative-statements/material-management/update-remarks/' +
        id,
      { remarks }
    );
  }
}

export default new LogisticCSService();
