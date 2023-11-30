import axiosInstance from '../Api';

class DepartmentService {
  getAllInternalDepartment(isActive) {
    return axiosInstance.get(`/department?active=${isActive}`);
  }

  getAllExternalDepartment() {
    return axiosInstance.post(
      '/config/external/departments/search/?page=0&size=200',
      {
        query: null,
        isActive: true,
      }
    );
  }

  SaveDepartment(data) {
    return axiosInstance.post('/department', data);
  }

  UpdateDepartment(id, data) {
    return axiosInstance.put(`/department/${id}`, data);
  }

  getDepartmentById(id) {
    return axiosInstance.get('/department/' + id);
  }

  toggleStatus(id, status) {
    return axiosInstance.patch(`/department/${id}?active=${status}`);
  }
}

export default new DepartmentService();
