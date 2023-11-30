import axiosInstance from '../Api';

class SectionService {
  SaveSection(data) {
    return axiosInstance.post('/section', data);
  }

  UpdateSection(id, data) {
    return axiosInstance.put(`/section/${id}`, data);
  }

  getSectionById(id) {
    return axiosInstance.get('/section/' + id);
  }

  toggleStatus(id, status) {
    return axiosInstance.patch(`/section/${id}?active=${status}`);
  }
}

export default new SectionService();
