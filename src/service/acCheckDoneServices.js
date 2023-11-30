import axiosInstance from "./Api";
import api from "./Api";


class AcCheckDoneServices {
    saveAcCheckDone(values) {
        return axiosInstance.post('/ac-check-done/', values);
    }
    getAllAcCheckDone(active) {
        return api.get(`/ac-check-done?active=${active}`);
    }

    getAcCheckDoneById(id){
        return axiosInstance.get('/ac-check-done/'+id);
    }
    updateAcCheckDone(id, values){
        return axiosInstance.put('/ac-check-done/'+id, values);
    }
    toggleStatus(id,status) {

        return axiosInstance.patch(`/ac-check-done/${id}?active=${status}`);
    }

}

export default new AcCheckDoneServices();