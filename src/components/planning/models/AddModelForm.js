import React from "react";
import { Button, Col, Form, Input, Row, Select, Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
import ARMButton from "../../common/buttons/ARMButton";
import { useTranslation } from "react-i18next";
import Permission from "../../auth/Permission";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const AddModelForm = ({
  onFinish,
  onReset,
  id,
  modelType,
  aircraft,
  lifeCode,
  form,
  setShowModal,
}) => {
  const { t } = useTranslation()
  return (
    <div>
      <Form {...layout} form={form} name="Models" onFinish={onFinish} scrollToFirstError>
        <Row>
          <Col sm={20} md={10}>
            <Form.Item
              name="aircraftModelId"
              label={t("planning.Aircrafts.A/C Type")}
              style={{ marginBottom: "12px" }}
              rules={[
                {
                  required: true,
                  message: t("planning.A/C Type.Please Select A/C Type"),
                },
              ]}
            >
              <Select
                placeholder={t("planning.A/C Type.Select A/C Type")}
                allowClear
                dropdownRender={(menu) => (
                  <>
                    {menu}
                  </>
                )}
              >
                {aircraft?.map((item) => {
                  return (
                    <Select.Option key={item.id} value={item.id}>
                      {item.aircraftModelName}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item
              name="modelType"
              label={t("planning.Models.Model Type")}
              style={{ marginBottom: "12px" }}
              rules={[
                {
                  required: true,
                  message: t("planning.Models.Model Type is required"),
                },
              ]}
            >
              <Select placeholder={t("planning.Models.Select Model Type")}>
                {modelType?.map((item) => {
                  return (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name="modelName"
              label={t("planning.Models.Model Name")}
              style={{ marginBottom: "12px" }}
              rules={[
                {
                  required: true,
                  message: t("planning.Models.Model Name is required"),
                },
                {
                  max: 255,
                  message: t("common.Maximum 255 characters allowed")
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
              name="version"
              label={t("planning.Models.Version")}
              style={{ marginBottom: "12px" }}
              rules={[
                {
                  required: false,
                },
                {
                  max: 255,
                  message: t("common.Maximum 255 characters allowed")
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lifeCodes"
              label={t("planning.Models.Life Code")}
              style={{ marginBottom: "12px" }}
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Select mode="multiple" allowClear placeholder={t("planning.Models.Select a life code")}>
                {lifeCode?.map((item) => {
                  return (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name="description"
              label={t("planning.Models.Description")}
              rules={[
                {
                  required: false,
                },
                {
                  max: 255,
                  message: t("common.Maximum 255 characters allowed")
                },
              ]}
              style={{ marginBottom: "12px" }}
            >
              <TextArea  />
            </Form.Item>
          </Col>
          <Col sm={22} md={12}></Col>
        </Row>
        <Row>
          <Col sm={20} md={10}>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Space size="small">
                <ARMButton size="medium" type="primary" htmlType="submit">
                  {id ? t("common.Update") : t("common.Submit")}
                </ARMButton>
                <ARMButton onClick={onReset} size="medium" type="primary" danger>
                  {t("common.Reset")}
                </ARMButton>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddModelForm;
