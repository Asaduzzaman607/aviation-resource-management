import axiosInstance from "./Api";
import api from "./Api";


class AirportService {
    saveAirport(values) {
        return axiosInstance.post('/airport/', values);
    }

    getAllAirport() {
        return axiosInstance.get('/airport/all');
    }

    getAirportById(id){
        return axiosInstance.get('/airport/'+id);
    }
    updateAirport(id,values){
        return axiosInstance.put('/airport/'+id,values);
    }
    toggleStatus(id) {
        return axiosInstance.put('/airport/toggle/active/status/'+id);
    }
    getAirports(isActive){
        return api.post("/airport/search/",{
            isActive: isActive
        } );

    }
    searchAirports( values){
        console.log('values', values)
        return api.post(`/airport/search?page=0&size=10`,values );

    }



}

export default new AirportService();
