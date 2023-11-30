import axiosInstance from "./Api";

class SubModuleItemService {

    getAllSubModuleItems(size,params) {
        return axiosInstance.post(`/item/search/?page=0&size=${size}`,params);
    }

    saveSubModuleItem(values) {
        return axiosInstance.post('/item', values);
    }
    getSubModuleItemById(id){
        return axiosInstance.get('/item/'+id);
    }
    updateSubModuleItem(id,value){
        return axiosInstance.put('/item/'+id,value);
    }
    toggleStatus(id,status) {
        return axiosInstance.patch(`/item/${id}?active=${status}`);
    }
}

export default new SubModuleItemService();