import axiosInstance from "./Api";

class ErpService {
    getErpData(endpoint){
        return axiosInstance.get(endpoint);
    }
    getErpDataById(id){
        return axiosInstance.get('config/manufacturer/'+id);
    }
}

export default new ErpService();