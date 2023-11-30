import { Form, Input, Space } from "antd";
import ARMButton from "../../common/buttons/ARMButton";
import ARMForm from "../../../lib/common/ARMForm";
import React from "react";
import { formLayout } from "../../../lib/constants/layout";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function AddAirportForm({ onFinish, form, onReset, id }) {
  const { t } = useTranslation()
	return (
    <ARMForm
      {...formLayout}
      form={form}
      name="airports"
      onFinish={onFinish}
      initialValues={{
        name: "",
        iataCode: "",
        countryCode: "",
        isActive: false,
      }}
      scrollToFirstError
    >
      <Form.Item
        name="name"
        label={t("planning.Airports.Airport")}
        rules={[
          {
            required: true,
            message: t("planning.Airports.Airport name is required"),
          },
          {
            max: 255,
            message: t("common.Maximum 255 characters allowed"),
          },
          {
            whitespace: true,
            message: t("common.Only space is not allowed")
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="iataCode"
        label={t("planning.Airports.IATA Code")}
        rules={[
          {
            required: true,
            message: t("planning.Airports.IATA Code is required"),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="countryCode"
        label={t("planning.Airports.Country Code")}
        rules={[
          {
            required: false,
            message: t("planning.Airports.Country Code is required"),
          },
          {
            type: "string",
            min: 2,
            message: t("planning.Airports.Country Code can not be less than 2 characters"),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}>
        <Space>
          <ARMButton size="medium" type="primary" htmlType="submit">
            {id ? t("common.Update") : t("common.Submit")}
          </ARMButton>
          <ARMButton onClick={onReset} size="medium" type="primary" danger>
            Reset
          </ARMButton>
        </Space>
      </Form.Item>
    </ARMForm>
  );
}

AddAirportForm.defaultProps = {
	id: null
}

AddAirportForm.propTypes = {
	onFinish: PropTypes.func.isRequired,
	onReset: PropTypes.func.isRequired,
	form: PropTypes.object.isRequired,
	id: PropTypes.any
};
