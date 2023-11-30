import { ApiFilled } from "@ant-design/icons";
import axiosInstance from "./Api";
const SAVE_MODELS = "model";
const UPDATE_MODELS = "model";
const GET_ALL_AIRCRAFT = "aircraft/models";
const SINGLE_DATA = "model";
const CONSUM_MODEL = "model/consumableModel";
const GET_ALL_MODELS = "model";
const MODEL_TYPE = "model-type";
class ModelsService {
  getAllAircraftModel() {
    return axiosInstance.get(`aircraft/models?page=1&size=100`);
  }
  saveModels(values) {
    return axiosInstance.post(SAVE_MODELS, values);
  }
  updateModels(id, value) {
    return axiosInstance.put(UPDATE_MODELS + "/" + id, value);
  }
  getAllModels(active) {
    return axiosInstance.get(`model?page=1&size=10&active=${active}`);
  }

  singleData(id) {
    return axiosInstance.get(SINGLE_DATA + "/" + id);
  }
  getConsumModelByAircraftModelId(id) {
    return axiosInstance.get(CONSUM_MODEL + "/" + id);
  }
  changeStatus(id, isActive) {
    return axiosInstance.patch(`model/${id}?active=${isActive}`);
  }
  searchModels(values) {
    return axiosInstance.post(`model/search?page=1&size=10`, values);
  }
  getAllModelType() {
    return axiosInstance.get(MODEL_TYPE);
  }
  saveFile(file,id) {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance.post(`model/upload/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept-Encoding": "gzip, deflate, br",
        Accept: "*/*",
      },
    });
  }
}
export default new ModelsService();
