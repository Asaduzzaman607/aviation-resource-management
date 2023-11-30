import axiosInstance from './Api';

const BASE_URL = '/store/locations/';

class LocationService {
  getAllLocations(size, data) {
    return axiosInstance.post(
      `/store/locations/search?page=0&size=${size}`,
      data
    );
  }

  saveLocation(data) {
    return axiosInstance.post(BASE_URL, data);
  }

  getLocationById(id) {
    return axiosInstance.get(BASE_URL + id);
  }

  updateLocation(id, data) {
    return axiosInstance.put(BASE_URL + id, data);
  }

  toggleLocationStatus(id, status) {
    return axiosInstance.patch(BASE_URL + id + '?active=' + status);
  }
}

export default new LocationService();
