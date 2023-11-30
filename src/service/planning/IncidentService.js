import axiosInstance from "./Api";
class IncidentService {

    getAllInterruption(page, size) {

        return axiosInstance.get(`/aircraft-incident?page=${page}&size=${size}`);
    }
}
export default new IncidentService()