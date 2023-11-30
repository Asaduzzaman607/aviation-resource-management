import api from "../../Api";

const SAVE_SIGNATURE = "/signature/";
const GET_SINGLE_SIGNATURE = "/signature/";
const UPDATE_SIGNATURE = "/signature/";
const GET_ALL_EMPLOYEE = "/employee";

class SignaturesService {
  saveSignature(values) {
    return api.post(SAVE_SIGNATURE, values);
  }

  getAllSignatures(active) {
    return api.get(`/signature?active=${active}`);
  }
  getAllSavedSignatures() {
    return api.get(`signature/all/active`);
  }

  getSingleSignature(id) {
    return api.get(GET_SINGLE_SIGNATURE + id);
  }

  updateSignature(id, values) {
    return api.put(UPDATE_SIGNATURE + id, values);
  }

  toggleStatus(id, isActive) {
    return api.patch(`signature/${id}?active=${isActive}`);
  }

  getAllEmployee() {
    return api.get(GET_ALL_EMPLOYEE);
  }
}

export default new SignaturesService();
