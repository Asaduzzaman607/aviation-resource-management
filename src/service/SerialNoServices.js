import axiosInstance from "./Api";


class SerialNoServices {
  saveSerialNo(values) {
    return axiosInstance.post('/serials/', values);
  }

  getSerialNoById(id){
    return axiosInstance.get('/serials/'+id);
  }
  updateSerialNo(id, values){
    return axiosInstance.put('/serials/'+id, values);
  }
  toggleStatus(id,status) {

    return axiosInstance.patch(`/serials/${id}?active=${status}`);
  }
  searchParts(partNo){
    return axiosInstance.get(`part/search-by-part-no?partNo=${partNo}`)

  }
  saveFile(file, id) {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance.post(`serials/upload?aircraftModelId=${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept-Encoding": "gzip, deflate, br",
        Accept: "*/*",
      },
    });
  }

}

export default new SerialNoServices();
