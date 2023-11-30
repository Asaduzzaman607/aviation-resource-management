import axiosInstance from './Api';

class ItemDemandService {
  saveItemDemand(values) {
    return axiosInstance.post('/store-demands', values);
  }

  getItemDemandById(id) {
    return axiosInstance.get('/store-demands/' + id);
  }

  getDemandWithAlterPartById(id) {
    return axiosInstance.get('/store-demands/withAlterPart/' + id);
  }

  getOldDemandById(id) {
    return axiosInstance.get('/store-demands/old/' + id);
  }

  updateItemDemand(id, value) {
    return axiosInstance.put('/store-demands/' + id, value);
  }

  getAllDemandStatus(value) {
    return axiosInstance.post('/store-demand/status/part', value);
  }

  toggleStatus(id, status) {
    console.log('status...8', status);
    return axiosInstance.patch(`/store-demands/${id}?active=${status}`);
  }

  toggleApprove(id, values) {
    return axiosInstance.put(`/store-demands/decide/${id}`, {
      ...values,
    });
  }
}

export default new ItemDemandService();
