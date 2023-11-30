import axiosInstance from './Api';

class TaskForecastServices {
  getAllTaskForecast(size, data) {
    return axiosInstance.post(`/forecast-task/search?page=0&size=${size}`, data);
  }

  saveTaskForecast(values) {
    return axiosInstance.post('/forecast-task', values);
  }
 generateTaskForecast(id, value) {

    return axiosInstance.post('/forecast-task/generate/' +id, value);
  }

  getTaskForecastById(id) {
    return axiosInstance.get('/forecast-task/' + id);
  }

  updateTaskForecast(id, value) {
    return axiosInstance.put('/forecast-task/' + id, value);
  }

  toggleStatus(id, status) {
    return axiosInstance.patch(`/forecast-task/${id}?active=${status}`);
  }
}

export default new TaskForecastServices();
