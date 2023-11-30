import axiosInstance from "./Api";

class ModuleService {

    getAllModule() {
        return axiosInstance.post('/module/search/?page=0&size=200',{
            query: null,
            isActive:true,
        });
    }

    saveModule(values) {
        return axiosInstance.post('/module', values);
    }
    getModuleById(id){
        return axiosInstance.get('/module/'+id);
    }
    updateModule(id,value){
        return axiosInstance.put('/module/'+id,value);
    }
    toggleStatus(id,status) {
        return axiosInstance.patch(`/module/${id}?active=${status}`);
    }
}

export default new ModuleService();