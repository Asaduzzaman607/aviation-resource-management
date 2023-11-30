import {S3Client} from "@aws-sdk/client-s3"
import {Upload} from "@aws-sdk/lib-storage";
import { notifyError } from "./notifications";

export const getS3Client = () => {
    return new S3Client({
        region: process.env.REACT_APP_S3_REGION,
        credentials: {
            accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
        },
    });
}


function makeUniqueName(str=5) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < str; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export const targetFile = (moduleName,selectedFile) => {
    let text = makeUniqueName()
    return {
        Bucket: "arm-test-360",
        ContentType: selectedFile.type,
        Key: moduleName + "/" + moduleName+"-"+text+"-"+selectedFile.name,
        Body: selectedFile,
    };
}

export const targetFileForPlanning = (moduleName,selectedFile) => {
    let text = makeUniqueName(5)
    return {
        Bucket: "arm-test-360",
        ContentType: selectedFile.type,
        Key: moduleName + "/" + text+"~"+selectedFile.name,
        Body: selectedFile,
    };
}

export const upload = async (moduleName, file) => {

    const target = targetFile(moduleName, file)
    //console.log("target...",target)
    const awsClient = getS3Client()
    //console.log("awsClient...",awsClient)

    try {
        const parallelUploads3 = new Upload({
            client: awsClient,
            params: target,
            partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
            leavePartsOnError: false, // optional manually handle dropped parts
        });
        parallelUploads3.on("httpUploadProgress", (progress) => {
            console.log("progress ", progress);
        });
        const res = await parallelUploads3.done();
        //console.log("reds",res.Location)
        return res.Location
    } catch (e) {
        notifyError('File uploading failed!')
    }
};