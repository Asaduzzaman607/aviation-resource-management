import axiosInstance from '../Api';

class DesignationService {
  SaveDesignation(data) {
    return axiosInstance.post('/designation', data);
  }

  UpdateDesignation(id, data) {
    return axiosInstance.put(`/designation/${id}`, data);
  }

  getDesignationById(id) {
    return axiosInstance.get('/designation/' + id);
  }

  toggleStatus(id, status) {
    return axiosInstance.patch(`/designation/${id}?active=${status}`);
  }
}

export default new DesignationService();
