import axiosInstance from "./Api";

const BASE_URL = "/aircraft/models/";

class AircraftModelFamilyService {
  getAllAircraftModelFamily(){
    return axiosInstance.get(`/aircraft/models?page=0&size=500`)
  }

  saveAircraftModelName(data) {
    return axiosInstance.post(BASE_URL, data);
  }

  getAllAircraftModels(size, data) {
    return axiosInstance.post(`/aircraft/models/search?page=0&size=${size}`, data);
  }

  getAircraftModelById(id) {
    return axiosInstance.get(BASE_URL + id);
  }

  deleteAircraftModel(id) {
    return axiosInstance.delete(BASE_URL + id);
  }

  updateAircraftName(id, data) {
    return axiosInstance.put(BASE_URL + id, data);
  }

  toggleAircraftModelFamilyStatus(id, status) {
    return axiosInstance.patch(BASE_URL + id + "?active=" + status);
  }
}

export default new AircraftModelFamilyService();
