import axiosInstance from "./Api";

const BASE_URL = "/work-package/certification/";

class WorkPackageCertificationServices {
  saveWorkPackageCertification(values) {
    return axiosInstance.post(BASE_URL, values);
  }

  getWorkPackageCertificationById(id) {
    return axiosInstance.get(`work-package/` + id);
  }
  updateWorkPackageCertification(id, values) {
    return axiosInstance.put(BASE_URL + id, values);
  }
  toggleStatus(id, status) {
    return axiosInstance.patch(`/work-package/${id}?active=${status}`);
  }
}

export default new WorkPackageCertificationServices();
