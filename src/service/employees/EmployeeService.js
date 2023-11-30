import axiosInstance from '../Api';

class EmployeeService {
  SaveEmployeeService(data) {
    return axiosInstance.post('/employee', data);
  }

  UpdateEmployeeService(id, data) {
    return axiosInstance.put(`/employee/${id}`, data);
  }

  getEmployeeServiceById(id) {
    return axiosInstance.get('/employee/' + id);
  }

  toggleStatus(id, status) {
    return axiosInstance.patch(`/employee/${id}?active=${status}`);
  }
}

export default new EmployeeService();
