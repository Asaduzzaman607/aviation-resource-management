import React, { useEffect } from "react";
import { AutoComplete, Col, Form, Row, Select } from "antd";
import { useTranslation } from "react-i18next";
import ARMForm from "../../../../lib/common/ARMForm";
import ARMButton from "../../../common/buttons/ARMButton";
import Input from "antd/es/input/Input";
import debounce from "lodash/debounce";

const { Option } = AutoComplete;

const AddSerialNoForm = ({
  id,
  onFinish,
  form,
  handleReset,
  parts,
  onSearch,
  getPartoOject,
  getHigherPartObject,
  type,
  aircraftModelFamilies,
  setAircraftId,
  higherModel,
  setModelId,
  higherPart,
  disable,
  consumModel,
}) => {
  useEffect(() => {
    form.setFieldsValue({
      partId: getPartoOject
        ? getPartoOject?.partNo
        : getHigherPartObject
        ? getHigherPartObject?.partNo
        : "",
    });
  }, [getPartoOject, getHigherPartObject]);

  let classifications = [
    { id: 1, name: "ROTABLE" },
    { id: 2, name: "CONSUMABLE" },
    { id: 3, name: "EXPENDABLE" },
  ];
  const classification = Form.useWatch("classification", form);
  const { t } = useTranslation();
  console.log({ classification });

  //@ts-ignore
  return (
    <div>
      <ARMForm
        form={form}
        name="serialNo"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
          partId: getPartoOject
            ? getPartoOject?.partNo
            : getHigherPartObject
            ? getHigherPartObject?.partNo
            : "",
        }}
        autoComplete="off"
        style={{
          backgroundColor: "#ffffff",
        }}
        onFinish={onFinish}
      >
        <Row gutter={[6, 6]} justify="start">
          <Col className="gutter-row" lg={12} xl={12} md={12} sm={24} xs={24}>
            {type != true ? (
              <>
                <Form.Item
                  label={t("planning.Parts.Classification")}
                  name="classification"
                  rules={[
                    {
                      required: true,
                      message: t("planning.Parts.Select a Classification"),
                    },
                  ]}
                >
                  <Select
                    disabled={disable}
                    placeholder={t("planning.Parts.Select a Classification")}
                    allowClear
                  >
                    {classifications?.map((cls) => (
                      <Select.Option key={cls.id} value={cls.id}>
                        {cls.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                {classification === 1 || classification === 3 ? (
                  <>
                    <Form.Item
                      name="aircraftModelId"
                      label={t("planning.Aircrafts.A/C Type")}
                      style={{ marginBottom: "12px" }}
                      rules={[
                        {
                          required: true,
                          message: "Please select A/C type",
                        },
                      ]}
                    >
                      <Select
                        disabled={disable}
                        placeholder={t("planning.A/C Type.Select A/C Type")}
                        onChange={setAircraftId}
                      >
                        {aircraftModelFamilies?.map((item) => (
                          <Option key={item.id} value={item.id}>
                            {item.aircraftModelName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="modelId"
                      label="Model"
                      style={{
                        marginBottom: "16px",
                      }}
                      rules={[
                        {
                          required: false,
                          message: t(
                            "planning.Aircraft Builds.Higher Model is required"
                          ),
                        },
                      ]}
                    >
                      <Select
                        disabled={disable}
                        onChange={setModelId}
                        allowClear
                        showSearch
                        filterOption={(inputValue, option) =>
                          option.children
                            .toString("")
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        }
                        placeholder="Select model"
                      >
                        {higherModel?.map((item) => {
                          return (
                            <Select.Option
                              key={item.modelId}
                              value={item.modelId}
                            >
                              {item.modelName}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </>
                ) : (
                  <>
                    <Form.Item
                      name="aircraftModelId"
                      label={t("planning.Aircrafts.A/C Type")}
                      style={{ marginBottom: "12px" }}
                      rules={[
                        {
                          required: false,
                          message: "Please select A/C type",
                        },
                      ]}
                    >
                      <Select
                        disabled={disable}
                        placeholder={t("planning.A/C Type.Select A/C Type")}
                        onChange={setAircraftId}
                      >
                        {aircraftModelFamilies?.map((item) => (
                          <Option key={item.id} value={item.id}>
                            {item.aircraftModelName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="modelId"
                      label="Model"
                      style={{
                        marginBottom: "16px",
                      }}
                      rules={[
                        {
                          required: false,
                          message: t(
                            "planning.Aircraft Builds.Higher Model is required"
                          ),
                        },
                      ]}
                    >
                      <Select
                        disabled={disable}
                        onChange={setModelId}
                        allowClear
                        showSearch
                        filterOption={(inputValue, option) =>
                          option.children
                            .toString("")
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        }
                        placeholder="Select model"
                      >
                        {consumModel?.map((item) => {
                          return (
                            <Select.Option
                              key={item.modelId}
                              value={item.modelId}
                            >
                              {item.modelName}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </>
                )}
              </>
            ) : null}

            <Form.Item
              name="partId"
              label="Part No"
              style={{
                marginBottom: "16px",
              }}
              rules={[
                {
                  required: true,
                  message: t("planning.Aircraft Builds.Part is required"),
                },
              ]}
            >
              <Select
                disabled={type ? type : disable ? disable : false}
                allowClear
                showSearch
                filterOption={(inputValue, option) =>
                  option.children
                    .toString("")
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
                }
                placeholder="Select part"
              >
                {higherPart?.map((item) => {
                  return (
                    <Select.Option key={item.partId} value={item.partId}>
                      {item.partNo}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            {/* <Form.Item
              label="Part"
              name="partId"
              rules={[
                {
                  required: true,
                  message: "Part is required",
                },
              ]}
            >
              <AutoComplete disabled={type} showSearch onSearch={debounce(onSearch, 1000)} placeholder='Input Part No'>
                  {parts.map((part) => (
                    <Option key={part.partNo} value={part.partNo}>
                      {part.partNo}
                    </Option>
                  ))}
                </AutoComplete>
            </Form.Item> */}
            <Form.Item
              label="Serial No"
              name="serialNumber"
              rules={[
                {
                  required: true,
                  message: "Serial no. is required",
                },
              ]}
            >
              <Input placeholder="Input Serial No" />
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
              <ARMButton
                onClick={handleReset}
                size="medium"
                type="primary"
                danger
              >
                {t("common.Reset")}
              </ARMButton>
            </Form.Item>
          </Col>
        </Row>
      </ARMForm>
    </div>
  );
};

export default AddSerialNoForm;
