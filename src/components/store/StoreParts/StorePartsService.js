import axiosInstance from '../../../service/Api';

class StorePartsService {
  getSerialByPartId(id) {
    return axiosInstance.get(`serials/serial-by-part?partId=${id}`);
  }

  getSerialBySerialId(id) {
    return axiosInstance.get('/store_part_serial/' + id);
  }

  storePartSerialSave(data) {
    return axiosInstance.post('store_part_serial', data);
  }

  storePartSerialUpdate(id, data) {
    return axiosInstance.put(`store_part_serial/${id}`, data);
  }
}

export default new StorePartsService();
