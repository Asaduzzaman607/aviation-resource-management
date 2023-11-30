import axiosInstance from "./../Api";

const GET_AML = "/aircraft-maintenance-log";
const SEARCH_DEFECT_RECT = "/aml-defect-rectification/";
const BASE_URL = "/mel/";

class MelService {
  getAml() {
    return axiosInstance.get(GET_AML);
  }

  getAllMel(isActive, currentPage) {
    return axiosInstance.get(`/mel?active=${isActive}&page=${currentPage}&size=10`);
  }

  getSingleMel(id) {
    return axiosInstance.get(BASE_URL + id);
  }

  searchDefect(amlId) {
    return axiosInstance.get(SEARCH_DEFECT_RECT + amlId);
  }

  searchRect(amlId) {
    return axiosInstance.get(SEARCH_DEFECT_RECT + amlId);
  }

  saveMel(values) {
    return axiosInstance.post(BASE_URL, values);
  }

  updateMel(id, values){
    return axiosInstance.put(BASE_URL + id, values)
  }

  toggleStatus(id, isActive) {
    return axiosInstance.patch(BASE_URL + id + `?active=${isActive}`)
  }

  searchMel(values, currentPage, size){
    return axiosInstance.post(BASE_URL+`search?page=${currentPage}&size=${size}`, values);
  }

}

export default new MelService();
