import axiosInstance from '../Api';

class ProqurementRequisitionService {
  saveProRequisition(values) {
    return axiosInstance.post(`/procurement-requisitions`, values);
  }

  getRequisitionById(id) {
    return axiosInstance.get('/procurement-requisitions/' + id);
  }

  getRequisitionItemById(id) {
    return axiosInstance.get('/procurement-requisitions/item/' + id);
  }

  updateProRequisition(id, value) {
    return axiosInstance.put('/procurement-requisitions/' + id, value);
  }

  toggleStatus(id, status) {
    console.log('status...9', status);
    return axiosInstance.patch(
      `/procurement-requisitions/${id}?active=${status}`
    );
  }

  toggleApprove(id, values) {
    return axiosInstance.put(`/procurement-requisitions/decide/${id}`, {
      ...values,
    });
  }
}

export default new ProqurementRequisitionService();
