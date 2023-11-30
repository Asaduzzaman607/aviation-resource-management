import React from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from "antd";
import ARMButton from "../../common/buttons/ARMButton";
import ARMForm from "../../../lib/common/ARMForm";
import { useTranslation } from "react-i18next";
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const CompanyForm = ({
  form,
  onFinish,
  currency,
  cities,
  onReset,
  id,
  setCountryModal,
  countries,
  setCityModal,
}) => {
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };
  const { t } = useTranslation();
  const { Option } = Select;
  console.log("currency", currency);
  return (
    <ARMForm
      form={form}
      name="basic"
      {...layout}
      initialValues={{}}
      onFinish={onFinish}
      autoComplete="off"
      style={{
        backgroundColor: "#ffffff",
      }}
    >
      <Row justify="center" gutter={10}>
        <Col className="gutter-row" lg={12} md={24} sm={24} xs={24}>
          <Form.Item
            label={t("configuration.Company.Company Name")}
            name="companyName"
            rules={[
              {
                required: true,
                message: t("configuration.Company.companyNameValid"),
              },
              {
                max: t("common.max"),
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
            label={t("configuration.Company.addressLineValid")}
            name="addressLineOne"
            rules={[
              {
                required: true,
                message: t("configuration.Company.addressLineValid"),
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
            label={t("configuration.Company.Address Line 2")}
            name="addressLineTwo"
            rules={[
              {
                max: 50,
                message: "Maximum 50 characters allowed",
              },
              {
                whitespace: true,
                message: "Only space is not allowed",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t("configuration.Company.Address Line 3")}
            name="addressLineThree"
            rules={[
              {
                max: 50,
                message: "Maximum 50 characters allowed",
              },
              {
                whitespace: true,
                message: "Only space is not allowed",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t("configuration.Company.Base Plant")}
            name="countryId"
            rules={[
              {
                required: false,
                message: "Please input Address Line 3",
              },
            ]}
          >
            <Select
              placeholder={t("configuration.Company.---Select Base Plant---")}
              allowClear
              showSearch
              optionFilterProp="children"
              onChange={(e) => {
                form.setFieldsValue({
                  cityId: "",
                });
              }}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              dropdownRender={(menu) => (
                <>
                  <Button
                    style={{ width: "100%" }}
                    type="primary"
                    onClick={() => setCountryModal(true)}
                  >
                    + Add Country
                  </Button>
                  {menu}
                </>
              )}
            >
              {countries.map((country) => (
                <Option key={country.id} value={country.id}>
                  {country.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={t("configuration.Company.Base")}
            name="cityId"
            tooltip={!id && "Please select basePlant first"}
            rules={[
              {
                required: true,
                message: "Please select a base",
              },
            ]}
          >
            <Select
              placeholder={t("configuration.Company.---Select Base---")}
              allowClear
              showSearch
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              dropdownRender={(menu) => (
                <>
                  <Button
                    style={{ width: "100%" }}
                    type="primary"
                    onClick={() => setCityModal(true)}
                  >
                    + Add City
                  </Button>
                  {menu}
                </>
              )}
            >
              {cities?.map((city) => (
                <Option key={city.id} value={city.id}>
                  {city.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="phone"
            label={t("configuration.Company.Phone Number")}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="fax" label={t("configuration.Company.Fax")}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" lg={12} md={24} sm={24} xs={24}>
          <Form.Item
            name="email"
            label={t("configuration.Company.Email")}
            rules={[{ type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contactPerson"
            label={t("configuration.Company.Contact Person")}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="baseCurrencyId"
            label="Base Currency"
            rules={[
              {
                required: true,
                message: "Base currency is required!",
              },
            ]}
          >
            <Select
              allowClear
              placeholder={t(
                "configuration.Company.---Select Base Currency---"
              )}
            >
              {currency.map((currency, key) => (
                <Option key={key} value={currency.id}>
                  {currency.code}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="localCurrencyId"
            label={t("configuration.Company.Local Currency")}
            rules={[
              {
                required: true,
                message: "Local currency is required!",
              },
            ]}
          >
            <Select
              allowClear
              placeholder={t(
                "configuration.Company.---Select Local Currency---"
              )}
            >
              {currency.map((currency, key) => (
                <Option key={key} value={currency.id}>
                  {currency.code}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="shipmentAddressOne"
            label={t("configuration.Company.Shipment Address 1")}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="shipmentAddressTwo"
            label={t("configuration.Company.Shipment Address 2")}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="shipmentAddressThree"
            label={t("configuration.Company.Shipment Address 3")}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="companyUrl"
            label={t("configuration.Company.Company URL")}
            rules={[
              {
                required: false,
              },
              {
                type: "url",
                warningOnly: true,
              },
              {
                type: "string",
                min: 6,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center">
        <Col className="gutter-row" lg={16} md={16} sm={24} xs={24}>
          <Form.Item>
            <Space>
              <ARMButton type="primary" htmlType="submit">
                {id ? t("common.Update") : t("common.Submit")}
              </ARMButton>
              <ARMButton onClick={onReset} type="primary" danger>
                {t("common.Reset")}
              </ARMButton>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </ARMForm>
  );
};

export default CompanyForm;
