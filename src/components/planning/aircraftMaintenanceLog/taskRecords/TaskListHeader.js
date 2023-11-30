import {Button, Col, Dropdown, Form, Input, Menu, Row, Select, Space, Upload} from "antd";
import {ArrowDownOutlined, CaretDownOutlined, DownloadOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import React from "react";
import {useTranslation} from "react-i18next";
import {Option} from "antd/lib/mentions";
import Permission from "../../../auth/Permission";
import {useBoolean} from "react-use";

export function TaskListHeader({
                                   aircraftModelList,
                                   isDisabled,
                                   isTrue,
                                   handleTaskRecordFileUpload,
                                   handleConsumablePartFileUpload,
                                   handleJobProcedureFileUpload,
                                   handleEffectivityTypeFileUpload,
                                   handleAircraftModel,
                                   aircraftModelId,
                                   handleTaskRecordFileChange,
                                   handleConsumablePartFileChange,
                                   handleJobProcedureFileChange,
                                   handleEffectivityTypeFileChange,
                                   handleFileChange,
                                   accept,
                                   showUploadTaskButton,
                                   showUploadConsumablePartButton,
                                   showUploadJobProcedureButton,
                                   showUploadEffectivityButton,
                                   showUploadButton,
                                   isUploading,
                                   handleFileUpload,
                                   WarningNotification,
                                   permission = '',
                                   handleTaskFormat,
                                   effectivityFormatDownload,
                                   taskTProcedureRefFormatDownload,
                                   taskTConsumablePartFormatDownload
                               }) {
    const buttonText = () => (isUploading ? "Uploading" : "Upload");
    const EffectivityButtonText = () =>
        isUploading ? "Uploading" : "Effectivity Type Upload";
    const taskButtonText = () =>
        isUploading ? "Uploading" : "Task Record Upload";
    const jobProcedureButtonText = () =>
        isUploading ? "Uploading" : "Task Procedure Upload";
    const consumablePartButtonText = () =>
        isUploading ? "Uploading" : "Consumable Part Upload";
    const {t} = useTranslation();


    const menu = () => {
        return (
            <>
                {
                    showMenu ?
                        <Menu>
                            <Menu.Item width='220'>

                                <Button icon={<DownloadOutlined/>} onClick={handleTaskFormat}> Export Task
                                    Record
                                </Button>

                            </Menu.Item>
                            <Menu.Item width='220'>

                                <Button icon={<DownloadOutlined/>}
                                        onClick={effectivityFormatDownload}> Export
                                    Effectivity Type</Button>

                            </Menu.Item>
                            <Menu.Item width='220'>

                                <Button icon={<DownloadOutlined/>}
                                        onClick={taskTProcedureRefFormatDownload}> Export Task Procedure
                                </Button>

                            </Menu.Item>
                            <Menu.Item width='220'>

                                <Button icon={<DownloadOutlined/>}
                                        onClick={taskTConsumablePartFormatDownload}> Export
                                    Consumable Part </Button>

                            </Menu.Item>
                        </Menu>
                        : null
                }
            </>
        );
    };


    const [showMenu, setShowMenu] = useBoolean(false)

    const handleShowMenu = () => {
        setShowMenu(!showMenu)
    }


    return (
        <form encType="multipart/form-data">
            <Row justify="space-between">
                <Col style={{marginBottom: '10px'}}>{t("planning.Task Records.Task Record List")}</Col>
                <Col>
                    <Row gutter={[6, 6]}>
                        {isTrue && (
                            <Col>
                                <Select
                                    placeholder={t("planning.A/C Type.Select A/C Type")}
                                    onChange={handleAircraftModel}
                                    style={{width: "240px"}}
                                    aircraftModelId={aircraftModelId}
                                >
                                    {aircraftModelList?.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.aircraftModelName}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                        )}

                        <>
                            {!showUploadTaskButton && (
                                <Col>

                                    <Upload
                                        disabled={isDisabled}
                                        showUploadList={false}
                                        type="file"
                                        accept={accept}
                                        onChange={handleTaskRecordFileChange}
                                    >
                                        <Button
                                            onClick={WarningNotification}
                                            icon={<UploadOutlined/>}
                                        >
                                            Browse Task Record
                                        </Button>
                                    </Upload>

                                </Col>
                            )}
                            {showUploadTaskButton && (
                                <Col>
                                    <Button
                                        onClick={handleTaskRecordFileUpload}
                                        loading={isUploading}
                                        type="primary"
                                        style={{
                                            backgroundColor: "#04aa6d",
                                            borderColor: "transparent",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        {taskButtonText()}
                                    </Button>
                                </Col>
                            )}
                        </>
                        <>
                            {!showUploadEffectivityButton && (
                                <Col>

                                    <Upload
                                        disabled={isDisabled}
                                        showUploadList={false}
                                        type="file"
                                        accept={accept}
                                        onChange={handleEffectivityTypeFileChange}
                                    >
                                        <Button
                                            icon={<UploadOutlined/>}
                                            onClick={WarningNotification}
                                        >
                                            Browse Effectivity Type
                                        </Button>
                                    </Upload>


                                </Col>
                            )}
                            {showUploadEffectivityButton && (
                                <Col>
                                    <Button
                                        onClick={handleEffectivityTypeFileUpload}
                                        loading={isUploading}
                                        type="primary"
                                        style={{
                                            backgroundColor: "#04aa6d",
                                            borderColor: "transparent",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        {EffectivityButtonText()}
                                    </Button>
                                </Col>
                            )}
                            {!showUploadJobProcedureButton && (
                                <Col>

                                    <Upload
                                        disabled={isDisabled}
                                        showUploadList={false}
                                        type="file"
                                        accept={accept}
                                        onChange={handleJobProcedureFileChange}
                                    >
                                        <Button icon={<UploadOutlined/>} onClick={WarningNotification}>
                                            Browse Task Procedure
                                        </Button>
                                    </Upload>


                                </Col>
                            )}

                            {showUploadJobProcedureButton && (
                                <Col>
                                    <Button
                                        onClick={handleJobProcedureFileUpload}
                                        loading={isUploading}
                                        type="primary"
                                        style={{
                                            backgroundColor: "#04aa6d",
                                            borderColor: "transparent",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        {jobProcedureButtonText()}
                                    </Button>
                                </Col>
                            )}
                        </>
                        {!showUploadConsumablePartButton && (
                            <Col>

                                <Upload
                                    disabled={isDisabled}
                                    showUploadList={false}
                                    type="file"
                                    accept={accept}
                                    onChange={handleConsumablePartFileChange}
                                >
                                    <Button icon={<UploadOutlined/>} onClick={WarningNotification}>
                                        Browse Consumable Part
                                    </Button>
                                </Upload>


                            </Col>
                        )}
                        {showUploadConsumablePartButton && (
                            <Col>
                                <Button
                                    onClick={handleConsumablePartFileUpload}
                                    loading={isUploading}
                                    type="primary"
                                    style={{
                                        backgroundColor: "#04aa6d",
                                        borderColor: "transparent",
                                        borderRadius: "5px",
                                    }}
                                >
                                    {consumablePartButtonText()}
                                </Button>
                            </Col>
                        )}

                        <>
                            <Form.Item name="people">
                                <Dropdown visible="false" overlay={menu}>
                                    <Button style={{width: 220}}
                                             icon={<CaretDownOutlined
                                                 style={{float: "right", textAlign: "center", marginTop: '3px'}}/>}
                                             onClick={handleShowMenu}>
                                        <span style={{float: "left"}}>Export Excel Format</span>
                                    </Button>
                                </Dropdown>
                            </Form.Item>

                        </>

                        <Col>
                            <Permission permission={permission}>
                                <Button
                                    type="primary"
                                    style={{
                                        backgroundColor: "#04aa6d",
                                        borderColor: "transparent",
                                        borderRadius: "5px",
                                    }}
                                >
                                    <Link title={t("common.Add")} to="/planning/task-records/add">
                                        <PlusOutlined/> {t("common.Add")}
                                    </Link>
                                </Button>
                            </Permission>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </form>
    );
}
