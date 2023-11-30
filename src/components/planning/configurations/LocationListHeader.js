import {DownloadOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons";
import {Button, Col, Row, Space, Upload} from "antd";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import Permission from "../../auth/Permission";
import React from "react";

export function LocationListHeader({
                                       handleFileChange,
                                       accept,
                                       showUploadButton,
                                       isUploading,
                                       handleFileUpload,
                                       url,
                                       title,
                                       permission,
                                       downLoadLocationFormat
                                   }) {
    const buttonText = () => (isUploading ? "Uploading" : "Upload");
    const {t} = useTranslation()
    return (
        <form encType="multipart/form-data">
            <Row justify="space-between">
                <Col>{title}</Col>
                <Col>
                    <Row gutter={[12, 12]}>
                        {!showUploadButton && (
                            <Col>
                               <Space>
                                   <Upload
                                       showUploadList={false}
                                       type="file"
                                       accept={accept}
                                       onChange={handleFileChange}
                                   >
                                       <Button icon={<UploadOutlined/>}>{t("common.Browse File")}</Button>
                                   </Upload>
                                   <Button icon={<DownloadOutlined/>}
                                           onClick={downLoadLocationFormat}> Export Excel Format
                                   </Button>
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
