import axiosInstance from "./Api";

const BASE_URL = "/work-package/";

class WorkPackageSummaryServices {
  saveWorkPackageSummary(values) {
    return axiosInstance.post(BASE_URL, values);
  }

  getWorkPackageSummaryById(id) {
    return axiosInstance.get(BASE_URL + id);
  }
  updateWorkPackageSummary(id, values) {
    return axiosInstance.put(BASE_URL + id, values);
  }
  toggleStatus(id, status) {
    return axiosInstance.patch(`/work-package/${id}?active=${status}`);
  }
}

export default new WorkPackageSummaryServices();
