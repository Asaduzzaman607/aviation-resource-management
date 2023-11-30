import axiosInstance from "./Api";
import api from "./Api";

class MultipleDefectServices {

    getAllMultipleDefect() {
        return axiosInstance.post('/MultipleDefect/search/?page=0&size=200',{
            query: null,
            isActive:true,
        });
    }

    generateMultipleDefect(id, value) {
        return axiosInstance.post('/defect/generate/' +id, value);
    }
    searchDefects( values){
        return api.post(`aml-defect-rectification/search-defect-rect`,values );

    }

    saveMultipleDefect(values) {
        return axiosInstance.post('/defect/bulk', values);
    }
    getMultipleDefectById(id){
        return axiosInstance.get('/MultipleDefect/'+id);
    }
    updateMultipleDefect(id,value){
        return axiosInstance.put('/MultipleDefect/'+id,value);
    }
    toggleStatus(id,status) {
        return axiosInstance.patch(`/MultipleDefect/${id}?active=${status}`);
    }
}

export default new MultipleDefectServices();