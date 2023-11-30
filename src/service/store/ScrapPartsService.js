import axiosInstance from '../Api';

class ScrapPartsService {
  getAllScrapParts(size, data) {
    return axiosInstance.post(`/store/scraps/search?page=0&size=${size}`, data);
  }

  saveScrapParts(values) {
    return axiosInstance.post('/store/scraps', values);
  }

  getScrapPartsById(id) {
    return axiosInstance.get('/store/scraps/' + id);
  }

  updateScrapParts(id, values) {
    return axiosInstance.put('/store/scraps/' + id, values);
  }

  toggleStatus(id, status) {
    return axiosInstance.patch(`/store/scraps/${id}?active=${status}`);
  }

  async toggleApprove(id, body) {
    return axiosInstance.put(`store/scraps/decide/${id}`, body);
  }

  getWorkFlows(subModuleItemId) {
    return axiosInstance.post(
      `/workflow-actions/search/?size=${100}&sort=orderNumber,asc`,
      {
        isActive: true,
        subModuleItemId,
      }
    );
  }
}

export default new ScrapPartsService();
