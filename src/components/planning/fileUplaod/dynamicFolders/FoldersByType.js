import {
    DeleteOutlined,
    EditOutlined, FileOutlined,
    FolderAddOutlined,
    FolderFilled, RollbackOutlined,
} from '@ant-design/icons';
import {Breadcrumb, Button, Col, Form, Input, Modal, notification, Row, Space, Tooltip} from 'antd';
import {t} from 'i18next';
import React, {useCallback, useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {getErrorMessage, getFileExtension} from '../../../../lib/common/helpers';
import {notifyResponseError} from '../../../../lib/common/notifications';
import {LinkAndTitle} from '../../../../lib/common/TitleOrLink';
import FolderServices from '../../../../service/FolderServices';
import ARMBreadCrumbs from '../../../common/ARMBreadCrumbs';
import ARMCard from '../../../common/ARMCard';
import CommonLayout from '../../../layout/CommonLayout';
import ARMForm from "../../../../lib/common/ARMForm";
import FileServices from "../../../../service/FileServices";
import ARMButton from "../../../common/buttons/ARMButton";
import {DeleteObjectCommand} from "@aws-sdk/client-s3";
import Permission from '../../../auth/Permission';
import {getS3Client} from "../../../../lib/common/s3Config";

const fileUploadTypes = {
    'atl-files': 0,
    'work-order-files': 1,
    'ad-files': 2,
    'sb-files': 3,
    'out-of-phase-task-card-files': 4,
    'arc-files': 5,
    'dmi-log-files': 6,
    'cdl-log-files': 7,
    'on-board-document-files': 8,
    'letter-files': 9,
    'other-files': 10,
    'task-done-files': 11,
}

const removeTheFolder = <span>Remove Folder</span>;
const renameTheFolderName = <span>Rename Folder</span>;
const bucketName = 'arm-test-360';
const removeFile = <span>Remove File</span>;


export default function FoldersByType() {
    const {id} = useParams();
    const [folders, setFolders] = useState([]);
    const [singleData, setSingleData] = useState([]);
    const [folderName, setFolderName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [form] = Form.useForm();
    const history = useLocation()
    const pathname = history.pathname
    const awsClient = getS3Client();


    const getAllFoldersByType = async () => {
        try {
            const {data} = await FolderServices.getAllFoldersByType(fileUploadTypes[id]);
            setFolders(data);

        } catch (e) {
            notification["error"]({
                message: getErrorMessage(e),
            });
        }
    };

    useEffect(() => {
        if (!id) return;
        getAllFoldersByType();
    }, [id])


    const handleAddFolder = async () => {

        const folderName = form.getFieldValue('folderName')
        const matchString = form.getFieldValue('matchString')

        const folderCreatedData = {
            uploadItemType: fileUploadTypes[id],
            folderName,
            matchString,
            folderPath: pathname
        }


        try {
            const {data} = await FolderServices.createFolder(folderCreatedData);
            setFolders(current => {
                return [...current, {folderId: data.id, folderName, isActive: true}];
            })
            await getAllFoldersByType();
            setIsModalOpen(false);
            form.resetFields()

            notification["success"]({
                message: "Successfully created a folder!"
            });
        } catch (er) {
            notifyResponseError(er)
        }
    }

    const handleOk = () => {
        handleAddFolder();
        setFolderName('');
    };


    const handleRemoveFolder = async (folderId) => {

        try {

            const {data} = await FolderServices.toggleStatus(folderId, 'false');
            const activeFolders = folders.filter(({folderId: id}) => id !== folderId)
            setFolders(activeFolders)

        } catch (e) {
            notification["error"]({
                message: getErrorMessage(e),
            });
        }

    };


    const getFolderNameById = async (folderId) => {
        try {
            const {data} = await FolderServices.singleFolder(folderId);

            form.setFieldsValue({
                ...data,
            });
            setSingleData(data)
        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    }

    const getKeywordFromFolders = async (folderId) => {

        const matched = folders.filter(folder => folder.folderId === folderId)


        form.setFieldsValue({
            folderName: matched[0].folderName,
            matchString: matched[0].matchString
        });
    }


    const renameFolderName = async () => {

        const folderName = form.getFieldValue('folderName')
        const matchString = form.getFieldValue('matchString')

        const editedFolderName = {
            folderName: folderName,
            id: singleData?.folderId,
            matchString
        }

        try {
            const {data} = await FolderServices.renameFolder(singleData?.folderId, editedFolderName);
            await getAllFoldersByType()
            setIsRenameModalOpen(false)
            form.resetFields()

            notification["success"]({
                message: "Successfully updated",
            });
        } catch (er) {
            notification["error"]({message: getErrorMessage(er)});
        }
    };

    const handleEdit = () => {
        renameFolderName()

    }

    const title = id ? "Folders" : "Files";

    const [searchData, setSearchData] = useState([])
    const [searchValue, setSearchValue] = useState('')

    const searchFiles = useCallback(
        async (values) => {
            setSearchValue(values?.keywords)
            const fileSearchKeys = {
                uploadItemType: fileUploadTypes[id],
                keywords: values?.keywords
            }

            try {
                const {data} = await FileServices.searchFile(fileSearchKeys);
                setSearchData(data)

            } catch (er) {
                notification["error"]({message: getErrorMessage(er)});
            }
        },
        [searchValue]
    );

    const onReset = () => {
        form.resetFields();
        setSearchValue('')
        searchFiles();
    };


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
            const activeFiles = searchData?.filter(({fileId: id}) => id !== fileId)
            setSearchData(activeFiles)
            const getValue = await removeFromS3(fileKey);

            console.log({getValue})

        } catch (e) {
            notification["error"]({
                message: getErrorMessage(e),
            });
        }

    };


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
                </Breadcrumb>
            </ARMBreadCrumbs>

            <Permission
                permission={
                    pathname === '/planning/folder/atl-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_ATL_SEARCH' :
                        pathname === '/planning/folder/work-order-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_WORK_ORDER_SEARCH' :
                            pathname === '/planning/folder/ad-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_AD_SEARCH' :
                                pathname === '/planning/folder/sb-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_SB_SEARCH' :
                                    pathname === '/planning/folder/out-of-phase-task-card-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_OUT_OF_PHASE_TASK_CARD_SEARCH' :
                                        pathname === '/planning/folder/arc-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_ARC_SEARCH' :
                                            pathname === '/planning/folder/dmi-log-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_DMI_LOG_SEARCH' :
                                                pathname === '/planning/folder/cdl-log-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_CDL_LOG_SEARCH' :
                                                    pathname === '/planning/folder/on-board-document-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_ON_BOARD_DOCUMENTS_SEARCH' :
                                                        pathname === '/planning/folder/letter-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_LETTERS_SEARCH' :
                                                            pathname === '/planning/folder/task-done-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_TASK_DONE_SEARCH' :
                                                                pathname === '/planning/folder/other-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_OTHERS_SEARCH' :
                                                                    null} showFallback>

                <ARMCard title={<LinkAndTitle title={title} link={`/planning`}/>}>

                    {
                        isModalOpen &&
                        <>
                            <Modal title="Create Folder" visible={isModalOpen}
                                   onOk={handleOk}
                                   onCancel={() => {
                                       setIsModalOpen(false);
                                       setFolderName('');
                                       form.resetFields();
                                   }}
                                   maskClosable={false}>
                                <ARMForm form={form} name="folder-form" onFinish={handleAddFolder}>
                                    <Form.Item name='folderName'
                                               rules={[{
                                                   required: true,
                                                   message: 'Folder name is required',
                                               }]}>
                                        <Input maxLength={128} placeholder='Enter Folder Name'
                                        />
                                    </Form.Item>
                                    <Form.Item name='matchString'>
                                        <Input placeholder='Enter Match String'/>
                                    </Form.Item>
                                </ARMForm>
                            </Modal>
                        </>
                    }

                    {
                        isRenameModalOpen &&
                        <>
                            <Modal title="Edit Folder Name" visible={isRenameModalOpen}
                                   onOk={handleEdit}
                                   onCancel={() => {
                                       setIsRenameModalOpen(false);
                                       form.resetFields()
                                   }}
                                   maskClosable={false}>
                                <div>
                                    <ARMForm form={form} name="folder-form" onFinish={renameFolderName}>
                                        <Form.Item name='folderName'>
                                            <Input maxLength={128}/>
                                        </Form.Item>
                                        <Form.Item name='matchString'>
                                            <Input placeholder='Enter Match String'/>
                                        </Form.Item>
                                    </ARMForm>
                                </div>
                            </Modal>
                        </>
                    }

                    <Row>
                        <Col span={6} style={{marginBottom: '20px'}}>

                            <ARMForm form={form} onFinish={searchFiles}>
                                <Col style={{display: 'flex'}}>

                                    <Space>
                                        <Form.Item name='keywords'>
                                            <Input placeholder="Search files"/>
                                        </Form.Item>

                                        <Form.Item>
                                            <Space>
                                                <ARMButton type="primary" htmlType="submit" primary>
                                                    Search
                                                </ARMButton>
                                                <ARMButton onClick={onReset} type="primary">
                                                    <RollbackOutlined/> Reset
                                                </ARMButton>
                                            </Space>
                                        </Form.Item>
                                    </Space>

                                </Col>
                            </ARMForm>
                        </Col>
                    </Row>


                    {
                        searchValue?.length > 0 ?
                            <Row>
                                {searchData?.filter(({isActive}) => isActive)?.map(({
                                                                                        fileUrl,
                                                                                        fileName,
                                                                                        index,
                                                                                        fileId,
                                                                                        fileKey,
                                                                                        matchString
                                                                                    }) =>
                                    (
                                        <>
                                            <Col md={12} style={{marginBottom: "15px"}}>
                                                <p key={index} style={{marginTop: "10px"}}>
                                                    {
                                                        getFileExtension(fileUrl) ?
                                                            <img width="30" height="30" src={fileUrl}/> :
                                                            <FileOutlined/>
                                                    }
                                                    <a
                                                        href={fileUrl}> {`${fileName}`} </a>
                                                </p>
                                            </Col>
                                            <Col md={12}>
                                                <Tooltip placement="right" title={removeFile}>
                                                    <Button icon={<DeleteOutlined/>}
                                                            style={{marginTop: "5px", cursor: 'pointer'}}
                                                            onClick={() => handleRemoveFile(fileId, fileKey)}
                                                            type='danger'>
                                                    </Button>
                                                </Tooltip>
                                            </Col></>

                                    )
                                )}
                            </Row> :
                            <Row justify='space-between'>

                                <Col md={18}>

                                    <Row>

                                        {folders?.filter(({isActive}) => isActive)?.map(({
                                                                                             folderName,
                                                                                             folderId,
                                                                                             matchString
                                                                                         }) =>
                                            (
                                                <>
                                                    <Col key={folderId} md={16}>
                                                        <Link className={'folder-style'} to={`${folderId}`}>
                                                            <Space>
                                                                <FolderFilled style={{
                                                                    fontSize: "30px",
                                                                    cursor: 'pointer',
                                                                    marginBottom: "15px",
                                                                    color: '#f19916'
                                                                }}/>
                                                                <p className={'folder-name'}>{folderName}</p>
                                                            </Space>
                                                            <p style={{
                                                                marginLeft: "4px",
                                                                marginTop: '-15px',
                                                                color: '#A56427'
                                                            }}>{matchString}</p>
                                                        </Link>
                                                    </Col>
                                                    <Col md={2}>
                                                        <Space>
                                                            <Tooltip placement="left" title={removeTheFolder}>
                                                                <Permission permission={
                                                                    pathname === '/planning/folder/atl-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_ATL_DELETE' :
                                                                        pathname === '/planning/folder/work-order-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_WORK_ORDER_DELETE' :
                                                                            pathname === '/planning/folder/ad-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_AD_DELETE' :
                                                                                pathname === '/planning/folder/sb-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_SB_DELETE' :
                                                                                    pathname === '/planning/folder/out-of-phase-task-card-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_OUT_OF_PHASE_TASK_CARD_DELETE' :
                                                                                        pathname === '/planning/folder/arc-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_ARC_DELETE' :
                                                                                            pathname === '/planning/folder/dmi-log-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_DMI_LOG_DELETE' :
                                                                                                pathname === '/planning/folder/cdl-log-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_CDL_LOG_DELETE' :
                                                                                                    pathname === '/planning/folder/on-board-document-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_ON_BOARD_DOCUMENTS_DELETE' :
                                                                                                        pathname === '/planning/folder/letter-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_LETTERS_DELETE' :
                                                                                                            pathname === '/planning/folder/task-done-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_TASK_DONE_DELETE' :
                                                                                                                pathname === '/planning/folder/other-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_OTHERS_DELETE' :
                                                                                                                    null}>
                                                                    <Button icon={<DeleteOutlined/>}
                                                                            style={{
                                                                                marginTop: "5px",
                                                                                cursor: 'pointer'
                                                                            }}
                                                                            onClick={() => handleRemoveFolder(folderId)}
                                                                            type='danger'>
                                                                    </Button>
                                                                </Permission>
                                                            </Tooltip>
                                                            <Tooltip placement="right" title={renameTheFolderName}>
                                                                <Permission permission={
                                                                    pathname === '/planning/folder/atl-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_ATL_EDIT' :
                                                                        pathname === '/planning/folder/work-order-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_WORK_ORDER_EDIT' :
                                                                            pathname === '/planning/folder/ad-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_AD_EDIT' :
                                                                                pathname === '/planning/folder/sb-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_SB_EDIT' :
                                                                                    pathname === '/planning/folder/out-of-phase-task-card-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_OUT_OF_PHASE_TASK_CARD_EDIT' :
                                                                                        pathname === '/planning/folder/arc-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_ARC_EDIT' :
                                                                                            pathname === '/planning/folder/dmi-log-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_DMI_LOG_EDIT' :
                                                                                                pathname === '/planning/folder/cdl-log-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_CDL_LOG_EDIT' :
                                                                                                    pathname === '/planning/folder/on-board-document-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_ON_BOARD_DOCUMENTS_EDIT' :
                                                                                                        pathname === '/planning/folder/letter-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_LETTERS_EDIT' :
                                                                                                            pathname === '/planning/folder/task-done-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_TASK_DONE_EDIT' :
                                                                                                                pathname === '/planning/folder/other-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_OTHERS_EDIT' :
                                                                                                                    null}>
                                                                    <Button icon={<EditOutlined/>}
                                                                            style={{
                                                                                marginTop: "5px",
                                                                                cursor: 'pointer',
                                                                                background: "#6e757c",
                                                                                color: 'white'
                                                                            }} onClick={() => {
                                                                        setIsRenameModalOpen(true);
                                                                        getKeywordFromFolders(folderId)
                                                                        getFolderNameById(folderId)
                                                                    }}>

                                                                    </Button>
                                                                </Permission>
                                                            </Tooltip>


                                                        </Space>
                                                    </Col>

                                                </>
                                            )
                                        )}
                                    </Row>
                                </Col>


                                <Col md={6} style={{marginBottom: "10px", marginTop: "50px"}}>
                                    <Permission permission={
                                        pathname === '/planning/folder/atl-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_ATL_SAVE' :
                                            pathname === '/planning/folder/work-order-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_WORK_ORDER_SAVE' :
                                                pathname === '/planning/folder/ad-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_AD_SAVE' :
                                                    pathname === '/planning/folder/sb-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_SB_SAVE' :
                                                        pathname === '/planning/folder/out-of-phase-task-card-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_OUT_OF_PHASE_TASK_CARD_SAVE' :
                                                            pathname === '/planning/folder/arc-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_ARC_SAVE' :
                                                                pathname === '/planning/folder/dmi-log-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_DMI_LOG_SAVE' :
                                                                    pathname === '/planning/folder/cdl-log-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_CDL_LOG_SAVE' :
                                                                        pathname === '/planning/folder/on-board-document-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_ON_BOARD_DOCUMENTS_SAVE' :
                                                                            pathname === '/planning/folder/letter-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_LETTERS_SAVE' :
                                                                                pathname === '/planning/folder/task-done-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_TASK_DONE_SAVE' :
                                                                                    pathname === '/planning/folder/other-files' ? 'PLANNING_PLANNING_FOLDERS_FOLDER_OTHERS_SAVE' :
                                                                                        null}>
                                        <Button style={{width: "200px"}}
                                                type="primary"
                                                size='large'
                                                onClick={() => {
                                                    setIsModalOpen(true);
                                                }}>
                                            <FolderAddOutlined/> Add New Folder
                                        </Button>
                                    </Permission>
                                </Col>


                            </Row>
                    }

                </ARMCard>
            </Permission>
        </CommonLayout>
    )
}
