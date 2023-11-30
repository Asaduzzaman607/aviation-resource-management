import axiosInstance from "./Api";
import api from "./Api";


class TaskTypeServices {
  saveTaskType(values) {
    return axiosInstance.post('/task-type/', values);
  }
  getAllTaskTypes(active) {
    return api.get(`/task-type?active=${active}`);
  }

  getTaskTypeById(id){
    return axiosInstance.get('/task-type/'+id);
  }
  updateTaskType(id, values){
    return axiosInstance.put('/task-type/'+id, values);
  }
  toggleStatus(id,status) {

    return axiosInstance.patch(`/task-type/${id}?active=${status}`);
  }
  
}

export default new TaskTypeServices();
