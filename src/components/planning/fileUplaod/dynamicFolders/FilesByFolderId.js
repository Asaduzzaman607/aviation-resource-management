import {DeleteOutlined, FileAddOutlined, FileOutlined, UploadOutlined} from '@ant-design/icons';
import {DeleteObjectCommand} from '@aws-sdk/client-s3';
import {Breadcrumb, Button, Col, Form, Modal, notification, Row, Tooltip, Upload} from 'antd';
import React, {useEffect, useState} from 'react';
import {Upload as s3Upload} from "@aws-sdk/lib-storage";
import {Link, useParams} from 'react-router-dom';
import ARMForm from '../../../../lib/common/ARMForm';
import {getErrorMessage} from '../../../../lib/common/helpers';
import {notifyResponseError, notifySuccess} from '../../../../lib/common/notifications';
import {getS3Client, targetFileForPlanning} from '../../../../lib/common/s3Config';
import {formLayout} from '../../../../lib/constants/layout';
import FileServices from '../../../../service/FileServices';
import CommonLayout from '../../../layout/CommonLayout';
import SubmitReset from '../../../store/common/SubmitReset';
import ARMBreadCrumbs from '../../../common/ARMBreadCrumbs';
import {t} from 'i18next';
import ARMCard from '../../../common/ARMCard';
import {LinkAndTitle} from '../../../../lib/common/TitleOrLink';
import {useBoolean} from "react-use";


const Planning = 'planning';
const planningTestFolder = 'planningTest';
const bucketName = 'arm-test-360';
const removeFile = <span>Remove File</span>;

export default function FilesByFolderId() {

    const awsClient = getS3Client();
    const {folderId, id} = useParams();
    const [files, setFiles] = useState([])
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [selectedFile, setSelectedFile] = useState([]);
    const [uploadedFileList, setUploadedFileList] = useState([]);
    const [uploadedItem, setUploadedItem] = useState([]);
    const [submitting, toggleSubmitting] = useBoolean(false);
    const intFolderId = parseInt(folderId)
    const [form] = Form.useForm();


    //   files uploading
    const handleOkFile = () => {
        setShowFileUpload(false);
        setUploadedItem([]);
    };


    const handleFileInput = (e) => {
        let selectedList = []
        for (let i = 0; i < e.fileList.length; i++) {
            if (e.fileList[i].originFileObj) {
                selectedList.push(e.fileList[i].originFileObj)
            } else {
                selectedList.push({thumbUrl: e.fileList[i].thumbUrl})
            }
        }
        setSelectedFile(selectedList)
    }


    const upload = async (moduleName, file) => {


        const fileNameLength = file?.name.length

        if (fileNameLength >128) return


        const target = targetFileForPlanning(moduleName, file)

        const awsClient = getS3Client()

        try {
            const parallelUploads3 = new s3Upload({
                client: awsClient,
                params: target,
                partSize: 1024 * 1024 * 5,
                leavePartsOnError: false,
            });
            parallelUploads3.on("httpUploadProgress", (progress) => {
            });
            const res = await parallelUploads3.done();
            return res

        } catch (e) {
            notification["error"]({
                message: 'File uploading failed!',
            });
        }
    };



    const onFinish = async () => {
        let fileList = []

        try {
            toggleSubmitting()
            if (selectedFile.length > 0) {
                let length = selectedFile.length
                for (let i = 0; i < length; i++) {
                    if (!selectedFile[i].thumbUrl) {
                        let uploadedLink = await upload(Planning, selectedFile[i])
                        fileList.push({
                            url: uploadedLink.Location,
                            key: uploadedLink.Key
                        })
                    } else {
                        fileList.push({
                            url: selectedFile[i].thumbUrl
                        })
                    }
                }
                handleOkFile()
            }
            setUploadedFileList(fileList)
            handleAddCanvas(fileList);

        } catch (e) {
            notification["error"]({
                message: 'File uploading failed!',
            });

        } finally {
            toggleSubmitting()
        }

    };


    const onReset = () => {
        if (intFolderId) {
            form.setFieldsValue({...uploadedItem})

        } else {
            form.resetFields();
        }
        setShowFileUpload(false);
    }

    const getAllFilesByFolderId = async () => {
        try {
            const {data} = await FileServices.getAllFilesByFolderId(intFolderId);
            setFiles(data);
        } catch (e) {
            notification["error"]({
                message: getErrorMessage(e),
            });
        }
    };


    useEffect(() => {
        (async () => {
            await getAllFilesByFolderId();
        })();
    }, [intFolderId])


    const getFileExtension = (file) => {
        const extensions = ['jpeg', 'png', 'gif', 'raw', 'svg', 'heic']
        const splitFiles = file.split('.')
        const length = splitFiles.length
        const extension = splitFiles[length - 1].toLowerCase()
        return extensions.includes(extension)
    }


    const handleAddCanvas = async (uploadedFileList) => {

        const uploadedFiles = [];
        const addedFiles = uploadedFileList?.map(file => {

            const filesData = {
                folderId,
                fileName: file.key.split('~')[1],
                fileUrl: file.url,
                fileKey: file.key,
            }
            uploadedFiles.push(filesData);
        });


        try {
            toggleSubmitting()

            const {data} = await FileServices.createFileList(uploadedFiles);
            await getAllFilesByFolderId()
            notifySuccess('Successfully created a file');
        } catch (e) {
            notifyResponseError(e)
        } finally {
            toggleSubmitting()
        }
    }


    const removeFromS3 = async (key) => {

        const bucketParams = {Bucket: bucketName, Key: key};

        try {
            const data = await awsClient.send(new DeleteObjectCommand(bucketParams));
            return data;
        } catch (err) {
            console.log("Error", err);
        }
    };


    const handleRemoveFile = async (fileId, fileKey) => {


        try {

            const {data} = await FileServices.toggleStatus(fileId, 'false');
            const activeFiles = files.filter(({fileId: id}) => id !== fileId)
            const getValue = await removeFromS3(fileKey);

            setFiles(activeFiles)
            console.log({getValue})

        } catch (e) {
            notification["error"]({
                message: getErrorMessage(e),
            });
        }

    };

    const title = folderId ? "Files" : "Folders";

    return (
        <CommonLayout>

            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <i className="fas fa-chart-line"/>
                        <Link to="/planning">&nbsp; {t("planning.Planning")}</Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        <Link to={`/planning/folder/${id}`}>{id}</Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item> {folderId} </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>

            <ARMCard title={<LinkAndTitle title={title} link={`/planning/folder/${id}`}/>}>

                {
                    showFileUpload &&
                    <>
                        <Modal title="Upload File" visible={showFileUpload}
                               onOk={handleOkFile}
                               onCancel={() => setShowFileUpload(false)}
                               footer={null}
                               maskClosable={false}>
                            <ARMForm
                                labelWrap
                                {...formLayout}
                                form={form}
                                name="basic"
                                onFinish={onFinish}
                                autoComplete="off"
                                style={{
                                    backgroundColor: "#ffffff",
                                }}
                            >
                                <Upload.Dragger
                                    multiple
                                    onChange={handleFileInput}
                                    showUploadList={true}
                                    type="file"
                                    listType="picture"
                                    beforeUpload={() => false}
                                >
                                    <Button disabled={submitting} icon={<UploadOutlined/>}>Click to upload</Button> &nbsp;
                                </Upload.Dragger>

                                <SubmitReset submitting={submitting} onReset={onReset}/>

                            </ARMForm>
                        </Modal>
                    </>
                }


                <Row justify='space-between'>

                    <Col md={18}>

                        <Row>
                            {files?.filter(({isActive}) => isActive)?.map(({
                                                                               fileUrl,
                                                                               fileName,
                                                                               index,
                                                                               fileId,
                                                                               fileKey
                                                                           }) =>
                                (
                                    <>
                                        <Col md={12} style={{marginBottom: "15px"}}>
                                            <p key={index} style={{marginTop: "10px"}}>
                                                {
                                                    getFileExtension(fileUrl) ?
                                                        <img width="30" height="30" src={fileUrl}/> : <FileOutlined/>
                                                }
                                                <a
                                                    href={fileUrl}> {`${fileName}`} </a>
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <Tooltip placement="right" title={removeFile}>
                                                <Button icon={<DeleteOutlined/>}
                                                        style={{marginTop: "5px", cursor: 'pointer'}}
                                                        onClick={() => handleRemoveFile(fileId, fileKey)}
                                                        type='danger'>
                                                </Button>
                                            </Tooltip>
                                        </Col>

                                    </>
                                )
                            )}
                        </Row>
                    </Col>


                    <Col md={6} style={{marginBottom: "10px", marginTop: "50px"}}>
                        <Button style={{width: "200px"}}
                                type="primary"
                                size='large'
                                onClick={() => {
                                    setShowFileUpload(true);
                                }}>
                            <FileAddOutlined/> Add New File
                        </Button>
                    </Col>


                </Row>


            </ARMCard>


        </CommonLayout>
    )
}