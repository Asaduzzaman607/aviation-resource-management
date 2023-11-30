import axiosInstance from "./Api";

class UnitofMeasurementService {
  
    getAllUnitofMeasurement(size, data) {
        return axiosInstance.post(`/store/unit/measurements/search?page=1&size=${size}`, data);
      }
    
      saveUnitofMeasurement(values) {
        return axiosInstance.post('/store/unit/measurements', values);
      }
    
      getUnitofMeasurementById(id) {
        return axiosInstance.get('/store/unit/measurements/' + id);
      }
    
      updateUnitofMeasurement(id, value) {
        return axiosInstance.put('/store/unit/measurements/' + id, value);
      }
    
      toggleStatus(id, status) {
        return axiosInstance.patch(`/store/unit/measurements/${id}?active=${status}`);
      }
}

export default new UnitofMeasurementService();