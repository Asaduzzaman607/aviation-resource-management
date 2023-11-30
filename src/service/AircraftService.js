import axiosInstance from "./Api";

const BASE_URL = "/aircrafts/";

class AircraftService {
  saveAircraft(data) {
    return axiosInstance.post(BASE_URL, data);
  }

  getAllAircraft(status) {
    return axiosInstance.get(BASE_URL + "?active=" + status + "&size=1000");
  }
  getAllAircraftList() {
    return axiosInstance.get(`aircrafts/find-all-active_aircraft`);
  }

  getAircraftById(id) {
    return axiosInstance.get(BASE_URL + id);
  }

  updateAircraft(id, data) {
    return axiosInstance.put(BASE_URL + id, data);
  }

  toggleAircraftStatus(id, status) {
    return axiosInstance.patch(BASE_URL + id + "?active=" + status);
  }
  getAllAircrafts(size, data) {
    return axiosInstance.post(`/aircrafts/search?page=0&size=${size}`, data);
  }
}

export default new AircraftService();
