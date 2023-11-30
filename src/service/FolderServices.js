import axiosInstance from "./Api";

class FolderServices {
  createFolder(value) {
    return axiosInstance.post('/folders/', value);
  }

  getAllFolders(isActive) {
    return axiosInstance.get(`/folders/?active=${isActive}`);
  }
  getAllFoldersByType(id) {
    return axiosInstance.get(`folders/type/`+ id);
  }

  singleFolder(id) {
    return axiosInstance.get('/folders/' + id);
  }

  renameFolder(id, value) {
    return axiosInstance.patch(`/folders/${id}/rename`, value);
  }

  toggleStatus(id, status) {
    return axiosInstance.patch(`/folders/${id}?active=${status}`);
  }

  searchFolderMatchString(id) {
    return axiosInstance.get('folders/search_match_string/' + id);
  }

}

export default new FolderServices();