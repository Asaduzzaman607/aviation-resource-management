import axiosInstance from "./../Api";
const BASE_URL = "/aircrafts/";
class MWOService {
  getAllAircraftData(id) {
    return axiosInstance.get(`work-order/aircraft/${id}`);
  }
  saveMWO(values) {
    return axiosInstance.post(`work-order/`, values);
  }
  updateMWO(id, values) {
    return axiosInstance.put(`work-order/${id}`, values);
  }
  searchWorkOrder(values) {
    return axiosInstance.post(`work-order/search`, values);
  }
  getAllAircraft(status) {
    return axiosInstance.get(BASE_URL + "?active=" + status + "&size=60");
  }
  getSingleData(id) {
    return axiosInstance.get(`work-order/${id}`);
  }
  toggleStatus(id, status) {
    return axiosInstance.patch(`work-order/${id}?active=${status}`);
  }
}
export default new MWOService();
