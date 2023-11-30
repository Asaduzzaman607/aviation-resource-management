import axiosInstance from "../Api";

class ShipmentSErvice {

  saveShipmentProvider(value) {
    return axiosInstance.post('/material-management/config/shipment_provider', value);
  }
  singleShipmentProvider(id) {
    return axiosInstance.get('/material-management/config/shipment_provider/' + id);
  }

  updateShipmentProvider(id, value) {
    return axiosInstance.put('/material-management/config/shipment_provider/' + id, value);
  }

  toggleStatus(id, isActive) {
    return axiosInstance.patch(`/material-management/config/shipment_provider/${id}?active=${isActive}`);
  }

  searchShipmentProvider(size,data){
    return axiosInstance.post(`/material-management/config/shipment_provider/search/?size=${size}`, data);
  }
  toggleApprove(id,values) {
    return axiosInstance.put(`/material-management/config/shipment_provider/decide/${id}`,{
      ...values
    });
  }

   toggleStatusQuality(id, isActive) {
     return axiosInstance.patch(`/material-management/config/quality/shipment_provider/${id}?active=${isActive}`);
  }

   toggleApproveQuality(id, values) {
     return axiosInstance.put(`/material-management/config/quality/shipment_provider/decide/${id}`,{
       ...values
     });
  }
}

export default new ShipmentSErvice();