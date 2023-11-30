import React, { useMemo } from "react";
import ARMForm from "../../../../lib/common/ARMForm";
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
import DebounceSelect from "../../../common/DebounceSelect";
import ARMButton from "../../../common/buttons/ARMButton";
import PropTypes from "prop-types";
import { formLayout } from "../../../../lib/constants/layout";
import TextArea from "antd/lib/input/TextArea";
import { find, propEq } from "ramda";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-use";

const { Option } = Select;

const AddPartsForm = ({
  form,
  onFinish,
  onReset,
  classifications,
  selectedAlternatePart,
  setSelectedAlternatePart,
  model,
  setShowModal,
  aircraftModelFamilies,
  partId,
  getAircraftModelId,
  disable,
  acTypeDisable,
  lifeLimitUnit,
  consumModel,
  aircraftModelId
}) => {
  const defaultCountFactor = 1.0;

  const getModelTypeStatus = (modelTypeId) => {
    switch (modelTypeId) {
      case 3:
      case 6:
      case 7:
      case 8:
      case 9:
      case 12:
      case 13:
        return true;
      default:
        return false;
    }
  };
  const getLifeLimitUnitByModelType = (modelTypeId) => {
    switch (modelTypeId) {
      case 3:
      case 6:
      case 7:
      case 8:
      case 9:
      case 12:
      case 13:
        return true;
      default:
        return false;
    }
  };

  const modelId = Form.useWatch("modelId", form);
 
  const classification = Form.useWatch("classification", form);
  const modelTypeId = useMemo(() => {
    if (!modelId) return null;
    const { modelType } = find(propEq("modelId", modelId))(model);
    return modelType;
  }, [modelId, model]);

  const getModelTypeId = (modelId) => {
    if (!modelId) {
      return null;
    }
    const { modelType } = find(propEq("modelId", modelId))(model);
  };

  const { t } = useTranslation();

  const location = useLocation();
  const currentPath = location.pathname;
  const taskPath = currentPath[currentPath.length - 3];

  return (
    <div>
      <ARMForm
        {...formLayout}
        form={form}
        name="parts"
        onFinish={onFinish}
        scrollToFirstError
        initialValues={{
          countFactor: defaultCountFactor,
          isActive: true,
          unitOfMeasureId: null,
        }}
      >
        <Row>
          <Col sm={20} md={10}>
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
                placeholder={t("planning.Parts.Select a Classification")}
                allowClear
                disabled={!!partId}
              >
                {classifications?.map((cls) => (
                  <Select.Option key={cls.id} value={cls.id}>
                    {cls.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {classification === 2 ? (
              <>
                <Form.Item
                  label={t("planning.Aircrafts.A/C Type")}
                  name="aircraftModelId"
                  rules={[
                    {
                      required: false,
                      message: t("planning.A/C Type.Please Select A/C Type"),
                    },
                  ]}
                >
                  <Select
                    disabled={acTypeDisable }
                    placeholder={t("planning.A/C Type.Select A/C Type")}
                    onChange={(e) => {
                      // getAircraftModelId(e);
                      form.setFieldsValue({ modelId: "" });
                    }}
                    allowClear
                  >
                    {aircraftModelFamilies.map((aircraftModel) => (
                      <Option
                        key={aircraftModel.id}
                        value={aircraftModel.aircraftModelId}
                      >
                        {aircraftModel.aircraftModelName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={t("planning.Models.Model")}
                  name="modelId"
                  rules={[
                    {
                      required: aircraftModelId ? true : false,
                      message: t("planning.Models.Please select a model"),
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    filterOption={(inputValue, option) =>
                      option.children
                        .toString("")
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    }
                    onChange={getModelTypeId}
                    disabled={disable || !aircraftModelId}
                    placeholder={t("planning.Models.Select a Model")}
                  >
                    {consumModel?.map((model) => (
                      <Option
                        key={model.modelId}
                        data={model.modelType}
                        value={model.modelId}
                      >
                        {model.modelName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            ) : null}
            {classification === 1 ? (
              <>
                <Form.Item
                  label={t("planning.Aircrafts.A/C Type")}
                  name="aircraftModelId"
                  rules={[
                    {
                      required: false,
                      message: t("planning.A/C Type.Please Select A/C Type"),
                    },
                  ]}
                >
                  <Select
                    disabled={acTypeDisable}
                    placeholder={t("planning.A/C Type.Select A/C Type")}
                    onChange={(e) => {
                      getAircraftModelId(e);
                      form.setFieldsValue({ modelId: "" });
                    }}
                    allowClear
                  >
                    {aircraftModelFamilies.map((aircraftModel) => (
                      <Option
                        key={aircraftModel.id}
                        value={aircraftModel.aircraftModelId}
                      >
                        {aircraftModel.aircraftModelName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={t("planning.Models.Model")}
                  name="modelId"
                  rules={[
                    {
                      required: true,
                      message: t("planning.Models.Please select a model"),
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    filterOption={(inputValue, option) =>
                      option.children
                        .toString("")
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    }
                    onChange={getModelTypeId}
                    disabled={disable}
                    placeholder={t("planning.Models.Select a Model")}
                    dropdownRender={(menu) => (
                      <>
                        {currentPath === "/planning/task-records/add" ||
                        taskPath === "t" ? null : (
                          <Button
                            style={{ width: "100%" }}
                            type="primary"
                            onClick={() => setShowModal(true)}
                            allowClear
                          >
                            + {t("planning.Models.Add Model")}
                          </Button>
                        )}
                        {menu}
                      </>
                    )}
                  >
                    {model?.map((model) => (
                      <Option
                        key={model.modelId}
                        data={model.modelType}
                        value={model.modelId}
                      >
                        {model.modelName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="countFactor"
                  label={t("planning.Parts.Count Factor")}
                  rules={[
                    {
                      min: 0,
                      type: "number",
                      required: false,
                      message: "This field can not be less than 0",
                    },
                  ]}
                >
                  <InputNumber type="number" style={{ width: "100%" }} />
                </Form.Item>
              </>
            ) : null}
            {getModelTypeStatus(modelTypeId) && (
              <Form.Item
                name="lifeLimit"
                label={t("planning.Parts.Life Limit")}
              >
                <Input type="number" />
              </Form.Item>
            )}

            {getLifeLimitUnitByModelType(modelTypeId) && (
              <Form.Item name="lifeLimitUnit" label="Life Limit Unit">
                <Select>
                  {lifeLimitUnit.map((unit) => (
                    <Option key={unit.id} value={unit.id}>
                      {unit.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <Form.Item
              name="partNo"
              label={t("planning.Parts.Part No")}
              rules={[
                {
                  required: true,
                  message: t("planning.Parts.Please input part no"),
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
              name="description"
              label={t("planning.Parts.Description")}
            >
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item
              name="alternatePartIds"
              label={t("planning.Parts.Alternate Parts")}
              rules={[
                {
                  required: false,
                  message: "Field should not be empty",
                },
              ]}
            >
              <DebounceSelect
                debounceTimeout={1000}
                mapper={(v) => ({
                  label: v.partNo,
                  value: v.id,
                })}
                showArrow
                searchParam="partNo"
                showSearch
                mode="multiple"
                placeholder={t("planning.Parts.Search Alternate Parts")}
                url={`part/search?page=1&size=20`}
                selectedValue={selectedAlternatePart}
                onChange={(newValue) => {
                  setSelectedAlternatePart(newValue);
                }}
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
            <Form.Item
              name="partWiseUomIds"
              label={"UOM"}
              rules={[
                {
                  required: true,
                  message: "UOM should not be empty",
                },
              ]}
            >
              <DebounceSelect
                debounceTimeout={1000}
                mapper={(v) => ({
                  label: v.code,
                  value: v.id,
                })}
                showArrow
                searchParam="query"
                showSearch
                mode="multiple"
                placeholder={"Select UOM"}
                url={`/store/unit/measurements/search?page=1&size=20`}
                selectedValue={Form.useWatch("partWiseUomIds", form)}
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col sm={20} md={10}>
            <Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}>
              <Space>
                <ARMButton size="medium" type="primary" htmlType="submit">
                  {partId ? t("common.Update") : t("common.Submit")}
                </ARMButton>
                <ARMButton
                  onClick={onReset}
                  size="medium"
                  type="primary"
                  danger
                >
                  {t("common.Reset")}
                </ARMButton>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </ARMForm>
    </div>
  );
};

AddPartsForm.propTypes = {
  form: PropTypes.object.isRequired,
  //onFinish: PropTypes.func.isRequired,
  //models: PropTypes.array.isRequired,
  id: PropTypes.number,
  onReset: PropTypes.func.isRequired,
};

export default AddPartsForm;
