import React from 'react';
import ARMForm from "../../../lib/common/ARMForm";
import {Col, Form, Input, Row} from "antd";
import ARMButton from "../../common/buttons/ARMButton";
import { useTranslation } from 'react-i18next';

const AddPositionForm = ({id, onFinish, form, handleReset}) => {

  const { t } = useTranslation()

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
          remember: true,
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
              label={t("planning.Positions.Name")}
              name="name"
              rules={[
                {
                  required: true,
                  message: t("planning.Positions.Please input position name"),
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
            <Form.Item label={t("planning.Positions.Description")} name="description"
             rules={[
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
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <ARMButton size="medium" type="primary" htmlType="submit">
                {!id ? t("common.Submit") : t("common.Update")}
              </ARMButton>{" "}
              <ARMButton onClick={handleReset} size="medium" type="primary" danger>
                {t("common.Reset")}
              </ARMButton>
            </Form.Item>
          </Col>
        </Row>
      </ARMForm>
    </div>
  );
};

export default AddPositionForm;
