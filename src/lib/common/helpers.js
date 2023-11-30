import {getS3Client, targetFile} from "./s3Config";
import {Upload} from "@aws-sdk/lib-storage";
import {notifyError} from "./notifications";

export const getJWTToken = () => {
  return localStorage.getItem('token');
}

export const getErrorMessage = error => {
  try {
    return error.response?.data?.apiErrors[0]?.message
  } catch (e) {
    return 'Something Went Wrong!';
  }
}

export const NOOP = () => {}
export const identity = v => v;
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const showTrueFalse=(isTrue) =>{
  return isTrue ? 'true' : 'false';
}

export function objectWithoutProps(obj, keys) {
  let target = {};
  
  for(const key in obj) {
    if (keys.indexOf(key) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    target[key] = obj[key];
  }
  
  return target;
}

export function arrayToCsv(data){
  return data.map(row =>
    row
    .map(String)  // convert every value to String
    .map(v => v.replaceAll('"', '""'))  // escape double colons
    .map(v => `"${v}"`)  // quote it
    .join(',')  // comma-separated
  ).join('\r\n');  // rows starting on new lines
}

export function downloadBlob(content, filename, contentType) {
  // Create a blob
  var blob = new Blob([content], { type: contentType });
  var url = URL.createObjectURL(blob);

  // Create a link to download it
  var pom = document.createElement('a');
  pom.href = url;
  pom.setAttribute('download', filename);
  pom.click();
}

export async function uploadFile(file, moduleName = 'common') {
  const target = targetFile(moduleName, file);
  const awsClient = getS3Client();
  
  try {
    const parallelUploadS3 = new Upload({
      client: awsClient,
      params: target,
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      leavePartsOnError: false, // optional manually handle dropped parts
    });
    
    parallelUploadS3.on("httpUploadProgress", (progress) => {
      console.log("progress ", progress);
    });
    
    const res = await parallelUploadS3.done()
    return res.Location;
  } catch (e) {
    notifyError("Image upload failed!");
  }
}

export function separateCharactersAndNumbers(inputString) {
  if (/^\d+$/.test(inputString)) {
    return {
      characters: '',
      numbers: inputString
    };
  }

  const characters = inputString?.replace(/[0-9]/g, '');
  const numbers = inputString?.replace(/[^\d]/g, '');

  return {
    characters: characters,
    numbers: numbers
  };
}

export const getFileExtension = (file) => {
  const extensions = ['jpeg', 'jpg', 'png', 'gif', 'raw', 'svg', 'heic'];
  const splitFiles = file?.split('.');
  const length = splitFiles?.length;
  console.log({length});
  const extension = length ? splitFiles[length - 1].toLowerCase() : '';
  return extensions.includes(extension);
};
export const getFileName = (file) => {
  let fileName = file?.toLowerCase().split('/');
  return fileName?.length >= 4 ? fileName[4].substring(fileName[3].length + 7, 60).replaceAll(/\+|%20/g, ' ') : 'arm-file';
};