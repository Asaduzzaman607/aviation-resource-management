import axiosInstance from "./../Api";

const SAVE_PHASE_CHECK = "a_phase_chk";
const UPDATE_PHASE_CHECK = "a_phase_chk/";
const SINGLE_PHASE_CHECK = "/a_phase_chk/";

class PhaseCheckService {
  getAllPhaseCheck(active, currentPage) {
    return axiosInstance.get(`a_phase_chk?active=${active}&page=${currentPage}&size=10`);
  }

  savePhaseCheck(values) {
    return axiosInstance.post(SAVE_PHASE_CHECK, values);
  }

  updatePhaseCheck(id, values) {
    return axiosInstance.put(UPDATE_PHASE_CHECK + id, values);
  }

  getSinglePhaseCheck(id) {
    return axiosInstance.get(SINGLE_PHASE_CHECK + id);
  }

  toggleStatus(id, status) {
    return axiosInstance.patch("a_phase_chk/" + id + "?active=" + status);
  }

  searchPhaseCheckByAircraftId(id, isActive){
    return axiosInstance.get(`/a_phase_chk/find/${id}/${isActive}`)
  }
}

export default new PhaseCheckService();
