import api from "../../Api";

const SAVE_LOCATION = "/aircraft-location/";
const GET_SINGLE_LOCATION = "/aircraft-location/";
const UPDATE_LOCATION = "/aircraft-location/";

class LocationsService {
  saveLocation(values) {
    return api.post(SAVE_LOCATION, values);
  }

  getAllLocations(isActive, currentPage,pageSize) {
    return api.get(`/aircraft-location?active=${isActive}&page=${currentPage}&size=${pageSize}`);
  }

  getSingleLocation(id) {
    return api.get(GET_SINGLE_LOCATION + id);
  }

  updateLocation(id, values) {
    return api.put(UPDATE_LOCATION + id, values);
  }

  toggleStatus(id, isActive) {
    return api.patch(`aircraft-location/${id}?active=${isActive}`);
  }
  
  saveFile(file){
    const formData = new FormData();
    formData.append('file', file)
    
    return api.post(`aircraft-location/upload?file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        "Accept-Encoding": "gzip, deflate, br",
        "Accept": "*/*"
      }
    })
  }
}

export default new LocationsService();
