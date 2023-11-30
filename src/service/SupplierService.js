import axiosInstance from "./Api";

class SupplierService {


    getAllSupplier(isActive, type,vendorType) {
        return axiosInstance.post(`material-management/config/supplier/own_department/search?size=${500}`, {
            isActive: isActive,
            type: type,
            vendorType:vendorType
        });
    }
    searchSupplier(size,data){
        return axiosInstance.post(`material-management/config/supplier/own_department/search?page=0&size=${size}`, data);
    }
    saveSupplier(data) {
        data.phone = data.prefix + " " + data.phone
        console.log("Final supplier data = ", data)
        return axiosInstance.post('material-management/config/supplier/own_department', data);
    }
    getSupplierById(id){
        return axiosInstance.get('material-management/config/supplier/own_department/'+id);
    }
    updateSupplier(id,data){
        data.phone = data.prefix + " " + data.phone
        return axiosInstance.put('material-management/config/supplier/own_department/'+id,data);
    }
    toogleStatus(id, status) {
       
        console.log("b = ", 'material-management/config/supplier/own_department/'+id+'?active='+status)
        return axiosInstance.patch('material-management/config/supplier/own_department/'+id+'?active='+status);
    }

    getAllCity(){
        return axiosInstance.get('/cities');
    }
    getAllCountry(){
        return axiosInstance.get('/countries');
    }
}

export default new SupplierService();