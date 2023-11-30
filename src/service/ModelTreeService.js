import axiosInstance from "./Api";
const GET_ALL_MODEL = "model";
const GET_ALL_POSITION = "position";
const GET_ALL_LOCATION = "aircraft-location";
const SAVE_MODEL_TREE = "model-tree";
const SINGLE_DATA = "model-tree";
const UPDATE_MODEL_TREE = "model-tree";
const GET_MODEL_BYAIRCRAFT_MODEL = "model/aircraftModel";

class ModelTreeService {
  getAllModels(size = 10000) {
    return axiosInstance.get(GET_ALL_MODEL, {
      params: {
        size,
      },
    });
  }
  getAllModelByAircraftModelId(id) {
    return axiosInstance.get(GET_MODEL_BYAIRCRAFT_MODEL + "/" + id);
  }

  getAllLocation(size = 10000) {
    return axiosInstance.get(GET_ALL_LOCATION, {
      params: {
        size,
      },
    });
  }

  getAllPosition(size = 10000) {
    return axiosInstance.get(GET_ALL_POSITION, {
      params: {
        size,
      },
    });
  }

  saveModelTree(values) {
    return axiosInstance.post(SAVE_MODEL_TREE, values);
  }

  updateModelTree(id, values) {
    return axiosInstance.put(UPDATE_MODEL_TREE + "/" + id, values);
  }

  singleData(id) {
    return axiosInstance.get(SINGLE_DATA + "/" + id);
  }

  searchModelTree(values) {
    return axiosInstance.post(`model-tree/search?page=1&size=10`, values);
  }

  changeStatus(id, isActive) {
    return axiosInstance.patch(`model-tree/${id}?active=${isActive}`);
  }

  saveFile(file, id) {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance.post(`model-tree/upload/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        //  "Accept-Encoding": "gzip, deflate, br",
        Accept: "*/*",
      },
    });
  }
}
export default new ModelTreeService();
