import axios from "axios";

import axiosInstance from "./Api";
const SAVE_ROLE = "role/";
const GET_ALL_ROLE = "role/";
const DELETE_ROLE = "role/delete";
const SINGLE_ROLE_DATA = "role";
const UPDATE_ROLE = "role/update";
const DUPLICATE_ROLE = "role/duplicate";


class RoleService {
  SaveRole(value) {
    return axiosInstance.post(SAVE_ROLE, value);
  }
  updateRole(id, value) {
    return axiosInstance.put(UPDATE_ROLE + "/" + id, value);
  }
  getAllRole() {
    return axiosInstance.get(GET_ALL_ROLE);
  }
  deleteRole(id) {
    return axiosInstance.delete(DELETE_ROLE + "/" + id);
  }
  singleData(id) {
    return axiosInstance.get(SINGLE_ROLE_DATA + "/" + id);
  }
  duplicateRole(id, value) {
    return axiosInstance.post(DUPLICATE_ROLE + "/" + id, value);
  }
}
export default new RoleService();
