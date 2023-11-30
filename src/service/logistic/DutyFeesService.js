import axiosInstance from "../Api";
class DutyFeesService {

  SaveDutyFees(value) {
    return axiosInstance.post('duty-fees', value);
  }
  UpdateDutyFees(id, value) {
    return axiosInstance.put(`duty-fees/${id}`, value);
  }
  getPurchaseInvoiceById(id) {
    return axiosInstance.get("logistic/own_department/parts-invoice/" + id);
  }
  getSingleData(id) {
    return axiosInstance.get("duty-fees/" + id);
  }
  toggleStatus(id, status) {
    return axiosInstance.patch(`duty-fees/${id}?active=${status}`);
  }
}
export default new DutyFeesService();
