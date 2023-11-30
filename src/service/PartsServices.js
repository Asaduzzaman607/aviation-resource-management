import axiosInstance from "./Api";
import api from "./Api";

class PartsServices {
  savePart(values) {
    return axiosInstance.post("/part/", values);
  }

  getAllConsumableParts() {
    return axiosInstance.get(`part/find-all-consumable-part`);
  }

  getAllModels() {
    const MAX_SIZE = 10000;
    return axiosInstance.get(`/model/`, {
      params: {
        size: MAX_SIZE,
      },
    });
  }

  getPartById(id) {
    return axiosInstance.get("/part/" + id);
  }
  updatePart(id, values) {
    return axiosInstance.put("/part/" + id, values);
  }
  toggleStatus(id, status) {
    console.log("id", id, status);
    return axiosInstance.patch(`/part/${id}?active=${status}`);
  }

  searchParts(values) {
    console.log("values", values);
    return api.post(`/part/search`, values);
  }
  getUnitOfMeasures() {
    return api.post(`/store/unit/measurements/search?page=1&size=100`, { page: 1, size: 100 })
  }
  saveFile(file, id) {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance.post(`part/upload/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept-Encoding": "gzip, deflate, br",
        Accept: "*/*",
      },
    });
  }
}

export default new PartsServices();
