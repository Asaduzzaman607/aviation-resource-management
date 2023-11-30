import axiosInstance from "./Api";

class FileServices {
    createFile(value) {
        return axiosInstance.post('/planning-files/', value);
    }

    createFileList(value) {
        return axiosInstance.post('/planning-files/upload_file', value);
    }

    searchFile(value) {
        return axiosInstance.post('/planning-files/search/', value);
    }

    duplicateMatchString(value) {
        return axiosInstance.post('planning-files/validate_match_string', value);
    }


    getAllFiles(isActive) {
        return axiosInstance.get(`/planning-files/?active=${isActive}`);
    }

    getAllFilesByFolderId(id) {
        return axiosInstance.get(`planning-files/folders/` + id);
    }

    singleFile(id) {
        return axiosInstance.get('/planning-files/' + id);
    }

    searchMatchString(id) {
        return axiosInstance.get('planning-files/search_match_string/' + id);
    }

    renameFile(id, value) {
        return axiosInstance.put('/planning-files/' + id, value);
    }

    renameKeyword(id, values) {
        return axiosInstance.patch(`planning-files/${id}/rename`, values);
    }

    toggleStatus(id, status) {
        return axiosInstance.patch(`/planning-files/${id}?active=${status}`);
    }

}

export default new FileServices();