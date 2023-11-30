import axiosInstance from "./Api";

class SubModuleService {

    getAllSubModule() {
        return axiosInstance.post('/submodule/search/?page=0&size=200',{
            query: null,
            isActive:true
        });
    }

    saveSubModule(values) {
        return axiosInstance.post('/submodule', values);
    }
    getSubModuleById(id){
        return axiosInstance.get('/submodule/'+id);
    }
    updateSubModule(id,value){
        return axiosInstance.put('/submodule/'+id,value);
    }
    toggleStatus(id,status) {
        return axiosInstance.patch(`/submodule/${id}?active=${status}`);
    }
}

export default new SubModuleService();