import axiosInstance from "./../Api";

const GET_ALL_AML = "/aircraft-maintenance-log/all";
const GET_AML_BY_ID = "/aircraft-maintenance-log/";
const SAVE_DEFECT_RECT = "/aml-defect-rectification";
const UPDATE_DEFECT_RECT = "/aml-defect-rectification";
const GET_SINGLE_DEFECT_RECT = "/aml-defect-rectification/";
const SEARCH_DEFECT_RECT = "/aml-defect-rectification/";

class DefectRectService {
  getAllAml() {
    return axiosInstance.get(GET_ALL_AML);
  }

  getAmlById(id) {
    return axiosInstance.get(GET_AML_BY_ID + id);
  }

  saveDefectRect(data) {
    return axiosInstance.post(SAVE_DEFECT_RECT, data);
  }

  getAllDefectRect(active, currentPage) {
    return axiosInstance.get(`/aml-defect-rectification?active=${active}&page=${currentPage}&size=10`);
  }

  getSingleDefectRect(id) {
    return axiosInstance.get(GET_SINGLE_DEFECT_RECT + id);
  }

  updateDefectRect(data) {
    return axiosInstance.put(UPDATE_DEFECT_RECT, data);
  }


  searchDefectRect(amlId) {
    console.log(SEARCH_DEFECT_RECT + amlId);
    return axiosInstance.get(SEARCH_DEFECT_RECT + amlId);
  }

}

export default new DefectRectService();
