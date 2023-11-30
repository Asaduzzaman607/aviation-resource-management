import { Button, Col, Input, Row, Upload } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

export function getLinkAndTitleWithFileUpload(
  title,
  link,
  isfile,
  addBtn = false,
  setFile,
  uploadFile
) {
  return (
    <Row justify="space-between">
      <Col md={14} lg={14} sm={18}>
        {title}
      </Col>
      <Col md={20} lg={20} sm={18}>
        <form encType="multipart/form-data" style={{ height: "60px" }}>
          {isfile == true ? (
            <>
              <Upload
                type="file"
                accept=".xlsx, .xls"
                onChange={(file) => {
                  setFile(file.file.originFileObj);
                }}
              >
                <Button icon={<UploadOutlined />}>Upload File</Button>
              </Upload>
            </>
          ) : null}
        </form>
        {isfile == true ? (
          <>
            <Button
              onClick={uploadFile}
              type="primary"
              style={{
                backgroundColor: "#04aa6d",
                borderColor: "transparent",
                borderRadius: "5px",
                marginRight: "10px",
              }}
            >
              Upload
            </Button>
          </>
        ) : null}
      </Col>
      <Col>
        <Button
          type="primary"
          style={{
            backgroundColor: "#04aa6d",
            borderColor: "transparent",
            borderRadius: "5px",
          }}
        >
          {addBtn ? (
            <Link title="add" to={link}>
              <PlusOutlined /> Add
            </Link>
          ) : (
            <Link title="back" to={link}>
              <ArrowLeftOutlined /> Back
            </Link>
          )}
        </Button>
      </Col>
    </Row>
  );
}
