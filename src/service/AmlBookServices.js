import axiosInstance from "./Api";
import api from "./Api";

class AmlBooksServices {
    saveAmlBook(values) {

        return axiosInstance.post('/aml-book',values);
    }
     getAmlBookById(id){
        return axiosInstance.get('/aml-book/'+id);
     }
    updateAmlBook(id, values){
        return axiosInstance.put('/aml-book/'+id,values);
    }
    toggleStatus(id,status) {

        console.log('id',id, status)
        return axiosInstance.patch(`/aml-book/${id}?active=${status}`);
    }





}

export default new AmlBooksServices();
