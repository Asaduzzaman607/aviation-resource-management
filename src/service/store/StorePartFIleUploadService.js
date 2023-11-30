import api from '../Api';

class StorePartFIleUploadService {
  uploadFile(values) {
    const formData = new FormData();
    formData.append('file', values.file.file);
    const sheetNameList = values.sheetName.toString();
    const url = values.partType === 1 ? `/part-availabilities-log/file-upload?aircraftModelId=${values.aircraftModelId}&sheetNameList=${encodeURI(sheetNameList)}` :
      `/part-availabilities-log/file-upload?sheetNameList=${encodeURI(sheetNameList)}`
    return api.post(
      url,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: '*/*',
        },
      }
    );
  }
}

export default new StorePartFIleUploadService();
