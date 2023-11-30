import {Button, Col, Row, Space, Upload} from "antd";
import {DownloadOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Permission from "../../auth/Permission";

export function PositionListHeader({ handleFileChange, accept, showUploadButton, isUploading, handleFileUpload,permission='',downLoadPositionFormat }) {
  const buttonText = () => (isUploading ? "Uploading" : "Upload");
  const { t } = useTranslation()
  return (
    <form encType="multipart/form-data">
      <Row justify="space-between">
        <Col>{t("planning.Positions.Position List")}</Col>
        <Col>
          <Row gutter={[12, 12]}>
            {!showUploadButton && (
              <Col>
              <Space>
                <Upload showUploadList={false} type="file" accept={accept} onChange={handleFileChange}>
                  <Button icon={<UploadOutlined />}>{t("common.Browse File")}</Button>
                </Upload>
                <Button icon={<DownloadOutlined/>}
                        onClick={downLoadPositionFormat}> Export Excel Format
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
                <Button type="primary" style={{ backgroundColor: "#04aa6d", borderColor: "transparent", borderRadius: "5px" }}>
                  <Link title={t("common.Add")} to="/planning/positions/add">
                    <PlusOutlined /> {t("common.Add")}
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

PositionListHeader.defaultProps = {
  accept: ".xlsx, .xls",
  showUploadButton: false,
};

PositionListHeader.propTypes = {
  handleFileChange: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired,
  accept: PropTypes.string,
  showUploadButton: PropTypes.bool.isRequired,
  isUploading: PropTypes.bool.isRequired,
};
