import axiosInstance from "./Api";
import api from "./Api";


class PropellerServices {
    savePropeller(values) {
        return axiosInstance.post('/propeller/', values);
    }

    getPropellers(isActive) {
        return axiosInstance.get(`/propeller/?active=${isActive}`);
    }

    getPropellerById(id){
        return axiosInstance.get('/propeller/'+id);
    }
    updatePropeller(id,values){
        return axiosInstance.put('/propeller/'+id,values);
    }
    toggleStatus(id,status) {

        console.log('id',id, status)
        return axiosInstance.patch(`/propeller/${id}?active=${status}`);
    }

    searchPropeller( values){
        console.log('values', values)
        return api.post(`propeller/search`,values );

    }

    propellerReportPDFDownload(id)
    {
        return axiosInstance.post('propeller/report/'+id, {
            responseType: 'blob',
        });
    }



}

export default new PropellerServices();
