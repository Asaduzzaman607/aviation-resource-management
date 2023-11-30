import api from "../../Api";

const SAVE_POSITION = "/position";
const ALL_POSITIONS = "/position"
const SINGLE_POSITION = "/position/"
const UPDATE_POSITION = "/position/"

class PositionsService {
  savePosition(values) {
    console.log(SAVE_POSITION, values);
    return api.post(SAVE_POSITION, values);
  }

  getAllPositions(active, currentPage,pageSize) {
    return api.get(`/position/?active=${active}&page=${currentPage}&size=${pageSize}`);
  }

  getSinglePosition(id) {
    return api.get(SINGLE_POSITION + id);
  }

  updatePosition(id, values) {
    return api.put(UPDATE_POSITION + id, values);
  }

  toggleStatus(id, isActive) {
    return api.patch(`position/${id}?active=${isActive}`);
  }
  
  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file)
  
    return api.post("position/upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        "Accept-Encoding": "gzip, deflate, br",
        "Accept": "*/*"
      }
    })
  }
}

export default new PositionsService();
