import axiosInstance from "./Api";
const SAVE_CABIN = "cabin";
const UPDATE_CABIN = "cabin";
const GET_ALL = "cabin/all";
const SINGLE_DATA = "cabin/info";
const CHANGE_STATUS = "cabin/change/status";
class CabinService {
  getAllCabin() {
    return axiosInstance.get(GET_ALL);
  }
  saveCabin(values) {
    return axiosInstance.post(SAVE_CABIN, values);
  }
  updateCabin(id, value) {
    console.log("values", value);
    return axiosInstance.put(UPDATE_CABIN + "/" + id, value);
  }
  singleData(id) {
    return axiosInstance.get(SINGLE_DATA + "/" + id);
  }
  changeStatus(value) {
    return axiosInstance.put(CHANGE_STATUS, value);
  }
}
export default new CabinService();
