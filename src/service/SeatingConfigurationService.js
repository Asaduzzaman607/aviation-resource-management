import axiosInstance from "./Api";
const GET_ALL_AIRCRAFT = "/aircrafts?size=60";
const GET_ALL_CABIN = "cabin/all";
const SAVE_SEATING_CONFIGURATION = "aircraft/cabin";
const SEATING_SINGLE_DATA = "aircraft/cabin";
const UPDATE_SEATING_CONFIGURATION = "aircraft/cabin";

class SeatingConfigurationService {
  getAllAircraft() {
    return axiosInstance.get(GET_ALL_AIRCRAFT);
  }
  getAllCAbin() {
    return axiosInstance.get(GET_ALL_CABIN);
  }
  saveSeatingConfiguration(values) {
    return axiosInstance.post(SAVE_SEATING_CONFIGURATION, values);
  }
  getAllSeatingConfiguration(isActive) {
    console.log("dd", isActive);
    return axiosInstance.get(`aircraft/cabin?active=${isActive}`);
  }
  singleData(id) {
    return axiosInstance.get(SEATING_SINGLE_DATA + "/" + id);
  }
  updateSeatingConfiguration(id, value) {
    return axiosInstance.put(UPDATE_SEATING_CONFIGURATION + "/" + id, value);
  }
  changeStatus(id, active) {
    return axiosInstance.patch(`aircraft/cabin/${id}?active=${active}`);
  }
  searchSeatingConfiguration(status) {
    return axiosInstance.post(`/aircraft/cabin/search?page=1&size=10`, status);
  }
}
export default new SeatingConfigurationService();
