import { PlusOutlined, UploadOutlined} from "@ant-design/icons";
import {Button, Col,  Row, Select, Space, Upload} from "antd";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Permission from "../../components/auth/Permission";
import React from "react";

export function FileUploadListHeader({
                                         aircraftId,
                                         aircraftModelId,
                                         handleFileChange,
                                         accept,
                                         showUploadButton,
                                         isUploading,
                                         handleFileUpload,
                                         url,
                                         title,
                                         handleAircraftModel,
                                         isTrue,
                                         isAircraft,
                                         aircraftModelList,
                                         allAircrafts,
                                         isDisabled,
                                         WarningNotification,
                                         permission = '',
                                         getAircraftIdList,
                                         exportToXLSX,
                                         isExport,
                                         exportExcelFormat
                                     }) {
    const buttonText = () => (isUploading ? t("common.Uploading") : t("common.Upload"));

    const {t} = useTranslation()

    return (
        <form encType="multipart/form-data">
            <Row justify="space-between">
                <Col>{title}</Col>
                <Col>
                    <Row gutter={[12, 12]}>
                        {isAircraft && (
                            <Col>
                                <Select
                                    placeholder={t("planning.Aircrafts.Select Aircraft")}
                                    onChange={handleAircraftModel}
                                    style={{width: "240px"}}
                                    aircraftId={aircraftId}
                                >
                                    {getAircraftIdList?.map((item) => (
                                        <Select.Option key={item.aircraftId} value={item.aircraftId}>
                                            {item.aircraftName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Col>
                        )}
                        {isTrue && (
                            <Col>
                                <Select
                                    placeholder={t("planning.A/C Type.Select A/C Type")}
                                    onChange={handleAircraftModel}
                                    style={{width: "240px"}}
                                    aircraftModelId={aircraftModelId}
                                >
                                    {aircraftModelList?.map((item) => (
                                        <Select.Option key={item.id} value={item.id}>
                                            {item.aircraftModelName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Col>
                        )}
                        {!showUploadButton && (
                            <Col>
                                <Space>
                                    <Upload
                                        disabled={isDisabled}
                                        showUploadList={false}
                                        type="file"
                                        accept={accept}
                                        onChange={handleFileChange}
                                    >
                                        <Button
                                            onClick={WarningNotification}
                                            icon={<UploadOutlined/>}
                                        >
                                            {t("common.Browse File")}
                                        </Button>
                                    </Upload>

                                    {
                                        isExport === 1 ?
                                            <Button onClick={() => exportExcelFormat()}>Export Excel Format</Button>
                                            : null

                                    }
                                    {
                                        isExport === 2 ?
                                            <Button onClick={() => exportExcelFormat()}>Export Excel Format</Button>
                                            : null

                                    }
                                        {
                                            isExport === 1 ?
                                            <Button onClick={() => exportToXLSX()}>Export All List</Button>
                                            : null

                                        }
                                    
                                </Space>
                            </Col>
                        )}

                        {showUploadButton && (
                            <Col>
                                <Button
                                    onClick={handleFileUpload}
                                    loading={isUploading}
                                    type="primary"
                                    style={{
                                        backgroundColor: "#04aa6d",
                                        borderColor: "transparent",
                                        borderRadius: "5px",
                                    }}
                                >
                                    {buttonText()}
                                </Button>
                            </Col>
                        )}

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
                                    <Link title="add" to={url}>
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
