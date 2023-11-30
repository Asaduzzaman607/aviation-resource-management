import axiosInstance from '../Api';

class IssueDemandService {
  saveIssueDemand(values) {
    return axiosInstance.post('/store/issues', values);
  }

  getIssueDemandById(id) {
    return axiosInstance.get('/store/issues/' + id);
  }

  updateIssueDemand(id, value) {
    return axiosInstance.put('/store/issues/' + id, value);
  }

  toggleStatus(id, status) {
    console.log('status...8', status);
    return axiosInstance.patch(`/store/issues/${id}?active=${status}`);
  }

  toggleApprove(id, values) {
    return axiosInstance.put(`/store/issues/decide/${id}`, {
      ...values,
    });
  }

  getIssuePrintData(id, pageNo) {
    return axiosInstance.get(
      `/store/issues/print/${id}?page=${pageNo}&size=10`
    );
  }

  returnPendingStatus(id) {
    return axiosInstance.put(`/store/issues/return/${id}`);
  }
}

export default new IssueDemandService();
