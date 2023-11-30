import axiosInstance from "./Api";

class ManufacturerService {

    getAllManufacturer(isActive, type,vendorType) {
        return axiosInstance.post(`config/manufacturer/search?size=${500}`, {
            isActive: isActive,
            type: type,
            vendorType:vendorType
        });
    }
    searchManufacturer(size,data){
        return axiosInstance.post(`config/own_department/manufacturer/search?page=0&size=${size}`, data);
    }
    saveManufacturer(data) {
        data.phone = data.prefix + " " + data.phone
        return axiosInstance.post('config/own_department/manufacturer', data);
    }
    getManufacturerById(id){
        return axiosInstance.get('config/own_department/manufacturer/'+id);
    }
    updateManufacturer(id,data){
        data.phone = data.prefix + " " + data.phone
        return axiosInstance.put('config/own_department/manufacturer/'+id,data);
    }
    toogleStatus(id, status) {
        
        console.log("toogle = ", ' config/own_department/manufacturer/'+id+'?active='+status)
        return axiosInstance.patch('config/own_department/manufacturer/'+id+'?active='+status);
    }

  getAllCity() {
    return axiosInstance.get('/cities');
  }

  getAllCountry() {
    return axiosInstance.get('/countries');
  }
}

export default new ManufacturerService();