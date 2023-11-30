import axiosInstance from "./Api";

class NonRoutineCardServices {

  getAllNOnRoutine() {
    return axiosInstance.post('/non-routine-card/search/?page=0&size=200',{
      query: null,
      isActive:true,
    });
  }

  saveNonRoutineCard(values) {
    return axiosInstance.post('/non-routine-card', values);
  }
  getNonRoutineCardById(id){
    return axiosInstance.get('/non-routine-card/'+id);
  }
  updateNonRoutineCard(id,value){
    return axiosInstance.put('/non-routine-card/'+id,value);
  }
  toggleStatus(id,status) {
    return axiosInstance.patch(`/non-routine-card/${id}?active=${status}`);
  }
}

export default new NonRoutineCardServices();