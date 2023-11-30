import axiosInstance from "./Api";
import api from "./Api";


class MajorComponentServices {
    saveMajorComponent(values) {
        return axiosInstance.post('/major-component/', values);
    }

    getAllMajorComponents(isActive) {
        return axiosInstance.get(`/major-component/?active=${isActive}`);
    }

    getMajorComponentById(id){
        return axiosInstance.get('/major-component/'+id);
    }
    updateMajorComponent(id,values){
        return axiosInstance.put('/major-component/'+id,values);
    }
    toggleStatus(id,status) {

        console.log('id',id, status)
        return axiosInstance.patch(`/major-component/${id}?active=${status}`);
    }

    searchMajorComponents( values){
        console.log('values', values)
        return api.post(`major-component/search`,values );

    }



}

export default new MajorComponentServices();
