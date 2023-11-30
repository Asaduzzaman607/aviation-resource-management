import axiosInstance from "./Api";
import api from "./Api";

const BASE_URL = "/task-done/";

class TaskDoneServices {
  saveTaskDone(values) {
    return axiosInstance.post(BASE_URL, values);
  }

  searchTaskDoneByAirCrafts( values){
    return api.post(`task-done/find-by-aircrafts`,values );

  }

  getTaskDoneById(id) {
    return axiosInstance.get(BASE_URL + id);
  }
  updateTaskDone(id, values) {
    return axiosInstance.put(BASE_URL + id, values);
  }
  toggleStatus(id, status) {
    return axiosInstance.patch(`/task-done/${id}?active=${status}`);
  }

  getTaskByAircraftId(aircrfatId) {
    return axiosInstance.get(`task-done/task-by-aircraft/${aircrfatId}`);
  }

  getAircraftApuDetailsById(id) {
    return axiosInstance.get(`aircrafts/info/${id}`);
  }
  getPartSerialList(aircraft_id,model_id) {
    return axiosInstance.get(`task-done/part-serial-list?aircraft_id=${aircraft_id}&model_id=${model_id}`);
  }

  calculateLDND(values) {
    return axiosInstance.post(`task-done/ldnd`, values);
  }

  saveFile(file,id) {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance.post(`task-done/upload/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept-Encoding": "gzip, deflate, br",
        Accept: "*/*",
      },
    });
  }
}

export default new TaskDoneServices();
