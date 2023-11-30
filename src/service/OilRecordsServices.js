import axiosInstance from "./Api";
import api from "./Api";


class OilRecordsServices {
    saveOilRecord(id,values) {


        return axiosInstance.post('/oil-record/' +id, values);
    }
    updateOilRecord(id,values){
        return axiosInstance.put('/oil-record/'+id,values);
    }
    toggleStatus(id,status) {

        return axiosInstance.patch(`/oil-record/${id}?active=${status}`);
    }

    findOilRecord( values){
        return api.post(`oil-record/search`, values );

    }

    getAllAml (){
        return api.get(`aircraft-maintenance-log`)

    }



}

export default new OilRecordsServices();
