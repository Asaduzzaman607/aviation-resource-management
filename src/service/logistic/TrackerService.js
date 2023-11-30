import axiosInstance from '../Api';

class TrackerService {
  SaveTracker(value) {
    return axiosInstance.post('/po-tracker', value);
  }

  UpdateTracker(id, value) {
    return axiosInstance.put(`/po-tracker/${id}`, value);
  }

  getTrackerById(id) {
    return axiosInstance.get('/po-tracker/' + id);
  }

  toggleStatus(id, status) {
    return axiosInstance.patch(`/po-tracker/${id}?active=${status}`);
  }
}

export default new TrackerService();
