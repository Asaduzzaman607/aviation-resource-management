import {Upload} from '@aws-sdk/lib-storage';
import {useState} from 'react';
import {notifyError} from './notifications';
import {getS3Client, targetFile} from './s3Config';
import {getFileName} from "./helpers";

export function useARMFileUpload() {
  const [selectedFile, setSelectedFile] = useState([]);

  const handleFileInput = (e) => {
    let selectedList = [];
    for (let i = 0; i < e.fileList.length; i++) {
      if (e.fileList[i].originFileObj) {
        selectedList.push(e.fileList[i].originFileObj);
      } else {
        selectedList.push({ thumbUrl: e.fileList[i].thumbUrl });
      }
    }
    setSelectedFile(selectedList);
  };

  const handleFilesUpload = async (moduleName, files) => {
    console.log({ files });
    const fileUrls = [];
    for (let i = 0; i < files.length; i++) {
      if (!files[i].thumbUrl) {
        const link = await upload(moduleName, files[i]);
        fileUrls.push(link);
      } else {
        fileUrls.push(files[i].thumbUrl);
      }
    }
    return fileUrls;
  };

  const upload = async (moduleName, file) => {
    const target = targetFile(moduleName, file);
    const awsClient = getS3Client();

    try {
      const parallelUploads3 = new Upload({
        client: awsClient,
        params: target,
        partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
        leavePartsOnError: false, // optional manually handle dropped parts
      });
      parallelUploads3.on('httpUploadProgress', (progress) => {});
      const res = await parallelUploads3.done();
      return res.Location;
    } catch (e) {
      console.log(e);
      notifyError('File uploading failed!');
    }
  };

  const fileProcessForEdit=(file)=>{
    return file?.map((link, index) => {
      return {
        uid: (index + 1) * -1,
        name: getFileName(link),
        thumbUrl: link,
        url: link,
      };
    });
  }

  return {
    selectedFile,
    setSelectedFile,
    upload,
    handleFileInput,
    handleFilesUpload,
    fileProcessForEdit
  };
}
