import axiosInstance from "./Api";
import api from "./Api";

const GET_AIRCRAFT_BY_AIRCRAFT_MODEL = "/aircrafts?size=60";


class TaskRecordServices {
    saveTask(values) {
        return axiosInstance.post('/task/', values);
    }

    getTaskById(id){
        return axiosInstance.get('/task/'+id);
    }
    updateTask(id, values){
        return axiosInstance.put('/task/'+id, values);
    }
    toggleStatus(id,status) {

        console.log('id',id, status)
        return axiosInstance.patch(`/task/${id}?active=${status}`);
    }

    getAllAircraftByAircraftModelId(id) {
        return axiosInstance.get(`/aircrafts/all/${id}`);
    }

    getAllPositionsByModel(id) {
        return axiosInstance.get(`model-tree/position-by-model/${id}`);
    }

    getChecksByAircraftModel(id) {
        return axiosInstance.get(`aircraft/check/aircraftModel/${id}`);
    }
    getAllTaskTypes() {
        return axiosInstance.get(`task-type?page=1&size=100`);
    }
    getAllConsumableParts() {
        return axiosInstance.get(`part/find-all-consumable-part`);
    }
    saveFile(file, id) {
        const formData = new FormData();
        formData.append("file", file);
        return axiosInstance.post(`task/upload/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            //  "Accept-Encoding": "gzip, deflate, br",
            Accept: "*/*",
          },
        });
    }
    saveEffectivityTypeFile(file, id) {
        const formData = new FormData();
        formData.append("file", file);
        return axiosInstance.post(`task/upload-aircraft-effectivity/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            //  "Accept-Encoding": "gzip, deflate, br",
            Accept: "*/*",
          },
        });
    }
    saveTaskProcedureFile(file, id) {
        console.log("fike",file);
        const formData = new FormData();
        formData.append("file", file);
        return axiosInstance.post(`task/upload-task-procedure/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            //  "Accept-Encoding": "gzip, deflate, br",
            Accept: "*/*",
          },
        });
    }
    saveConsumablePartFile(file, id) {
        console.log("fike",file);
        const formData = new FormData();
        formData.append("file", file);
        return axiosInstance.post(`task/upload-consumable-part/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            //  "Accept-Encoding": "gzip, deflate, br",
            Accept: "*/*",
          },
        });
    }
}

export default new TaskRecordServices();
