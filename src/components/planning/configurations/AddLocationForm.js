import React from "react";
import ARMForm from "../../../lib/common/ARMForm";
import { Col, Form, Input, Row } from "antd";
import ARMButton from "../../common/buttons/ARMButton";
import { useTranslation } from "react-i18next";

const AddLocationForm = ({ form, id, handleReset, onFinish }) => {
  const { t } = useTranslation();

  return (
    <div>
      <ARMForm
        form={form}
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          name: "",
          description: "",
          remarks: "",
        }}
        autoComplete="off"
        style={{
          backgroundColor: "#ffffff",
        }}
        onFinish={onFinish}
      >
        <Row gutter={[6, 6]} justify="start">
          <Col className="gutter-row" lg={12} xl={12} md={12} sm={24} xs={24}>
            <Form.Item
              label={t("planning.Locations.Name")}
              name="name"
              rules={[
                {
                  required: true,
                  message: t("planning.Locations.Please input name"),
                },
                {
                  max: 255,
                  message: t("common.Maximum 255 characters allowed"),
                },
                {
                  whitespace: true,
                  message: t("common.Only space is not allowed"),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t("planning.Locations.Description")}
              name="description"
              rules={[
                {
                  required: false,
                },
                {
                  max: 255,
                  message: t("common.Maximum 255 characters allowed"),
                },
                {
                  whitespace: true,
                  message: t("common.Only space is not allowed"),
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={t("planning.Locations.Remarks")}
              name="remarks"
              rules={[
                {
                  required: false,
                },
                {
                  max: 255,
                  message: t("common.Maximum 255 characters allowed"),
                },
                {
                  whitespace: true,
                  message: t("common.Only space is not allowed"),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={12} sm={24} xs={12}>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <ARMButton type="primary" htmlType="submit">
                {!id ? t("common.Submit") : t("common.Update")}
              </ARMButton>{" "}
              <ARMButton onClick={handleReset} type="primary" danger>
                {t("common.Reset")}
              </ARMButton>
            </Form.Item>
          </Col>
        </Row>
      </ARMForm>
    </div>
  );
};

export default AddLocationForm;
