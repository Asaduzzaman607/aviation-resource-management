import API from '../Api';

class StoreDashBoardService {
  getAllDashBoardData() {
    return API.get('dashboard/all');
  }

  getAllDashBoardInfo(startDate, endDate) {
    return API.get(
      `/dashboard/part/info?startDate=${startDate}&endDate=${endDate}`
    );
  }
}

export default new StoreDashBoardService();
