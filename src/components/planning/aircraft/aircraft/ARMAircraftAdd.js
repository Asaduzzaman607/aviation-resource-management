import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import React, { useState } from "react";
import ARMForm from "../../../../lib/common/ARMForm";
import ARMButton from "../../../common/buttons/ARMButton";
import { useTranslation } from "react-i18next";
import { size } from "../../../../lib/common/validation";
import { boolean } from "yup";
import Permission from "../../../auth/Permission";

const { Option } = Select;

const ARMAircraftAdd = ({
  id,
  aircraftModelFamilies,
  name,
  onFinish,
  form,
  onReset,
  setShowModal,
  isDisable,
  onApplicableApu,
  isApplicableApu,
  setIsNumber
}) => {
  const { t } = useTranslation();
  //const [isNumber, setIsNumber] =useState(false);

  return (
    <ARMForm
      form={form}
      name="basic"
      labelCol={{
        span: 6,
      }}
      wrapperCol={{
        span: 16,
      }}
      onFinish={onFinish}
      scrollToFirstError
    >
      <Row justify="center" gutter={4}>
        <Col className="gutter-row" lg={12} md={24} sm={24} xs={24}>
          <Form.Item
            label={t("planning.A/C Type.A/C Type")}
            name="aircraftModelId"
            rules={[
              {
                required: true,
                message: t("planning.A/C Type.Please Select A/C Type"),
              },
            ]}
          >
            <Select
              placeholder={t("planning.A/C Type.Select A/C Type")}
              disabled={isDisable}
              allowClear
              dropdownRender={(menu) => (
                <>
                <Permission permission="PLANNING_CONFIGURATIONS_AC_TYPE_SAVE">
                  {/* <Button
                    style={{ width: "100%" }}
                    type="primary"
                    onClick={() => setShowModal(true)}
                  >
                    + {t("planning.A/C Type.Add A/C Type")}
                  </Button> */}
                </Permission>
                  {menu}
                </>
              )}
            >
              {aircraftModelFamilies.map((aircraftModel) => (
                <Option key={aircraftModel.id} value={aircraftModel.id}>
                  {aircraftModel.aircraftModelName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={t("planning.Aircrafts.Date of Manufacture")}
            name="manufactureDate"
            rules={[
              {
                required: false,
                message: "Please input date Of manufacture",
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
          </Form.Item>

          <Form.Item
            label={t("planning.Aircrafts.A/C Registration")}
            name="aircraftName"
            rules={[
              {
                required: true,
                message: t("planning.Aircrafts.Please input A/C registration no."),
              },
              {
                max: 255,
                message: t("common.Maximum 255 characters allowed"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t("planning.Aircrafts.A/C Serial")}
            name="airframeSerial"
            rules={[
              {
                required: true,
                message: t("planning.Aircrafts.Please input A/C Serial no."),
              },
              {
                max: 255,
                message: t("common.Maximum 255 characters allowed"),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t("planning.Aircrafts.A/C Total Time")}
            name="airFrameTotalTime"
            rules={[
              {
                required: true,
                message: t(
                  "planning.Aircrafts.Please input Aircraft total time"
                ),
              },
            ]}
          >
            <Input
              maxLength={9}
              style={{ width: "100%" }}
              disabled={isDisable}
            />
          </Form.Item>
          <Form.Item
            label={t("planning.Aircrafts.A/C Total Cycle")}
            name="airframeTotalCycle"
            rules={[
              {
                required: true,
                message: t(
                  "planning.Aircrafts.Please input Aircraft total cycle"
                ),
              },
            ]}
          >
            <InputNumber
              disabled={isDisable}
              maxLength={9}
              style={{ width: "100%" }}
              onKeyDown={(e) => {
                e.key === "." && e.preventDefault();
              }}
            />
          </Form.Item>
          <Form.Item
            label={t("planning.Aircrafts.BD Total Time")}
            name="bdTotalTime"
            rules={[
              {
                required: true,
                message: t("planning.Aircrafts.Please input BD total time"),
              },
            ]}
          >
            <Input maxLength={9} style={{ width: "100%" }} disabled={isDisable} />
          </Form.Item>
          <Form.Item
            label={t("planning.Aircrafts.BD Total Cycle")}
            name="bdTotalCycle"
            rules={[
              {
                required: true,
                message: t("planning.Aircrafts.Please input BD total cycle"),
              },
            ]}
          >
            <InputNumber
              disabled={isDisable}
              maxLength={9}
              style={{ width: "100%" }}
              onKeyDown={(e) => {
                e.key === "." && e.preventDefault();
              }}
            />
          </Form.Item>
          
          <Form.Item
            label="Induction Date"
            name="inductionDate"
            rules={[
              {
                required: false,
                message: "Please input induction date",
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
          </Form.Item>
        </Col>
        
        <Col className="gutter-row" lg={12} md={24} sm={24} xs={24}>
          <Form.Item
            label={t("planning.Aircrafts.Daily Average Hours")}
            name="dailyAverageHours"
            rules={[
              {
                required: true,
                message: "Please input daily average hours",
              },
            ]}
          >
            <Input style={{ width: "100%" }} maxLength={9} />
          </Form.Item>
          <Form.Item
            label={t("planning.Aircrafts.Daily Average Cycle")}
            name="dailyAverageCycle"
            rules={[
              {
                required: true,
                message: "Please input daily average cycle",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              maxLength={9}
              onKeyDown={(e) => {
                e.key === "." && e.preventDefault();
              }}
            />
          </Form.Item>
          <Form.Item
            label="A check done hour"
            name="aircraftCheckDoneHour"
            rules={[
              {
                required: false,
                message: "Please input a check done hour",
              },
            ]}
          >
            <Input
              disabled={isDisable}
              style={{ width: "100%" }}
              maxLength={9}
              onKeyDown={(e) => {
                e.key === "-" && e.preventDefault();
              }}
            />
          </Form.Item>
          <Form.Item
            label="A check done date"
            name="aircraftCheckDoneDate"
            rules={[
              {
                required: false,
                message: "Please input a check done date",
              },
            ]}
          >
            <DatePicker  disabled={isDisable} style={{ width: "100%" }} format="DD-MM-YYYY" />
          </Form.Item>
  
          <Form.Item
            label="Engine Type"
            name="engineType"
          >
            <Input
              style={{ width: "100%" }}
              maxLength={255}
            />
          </Form.Item>
  
          <Form.Item
            label="Propeller Type"
            name="propellerType"
          >
            <Input
              style={{ width: "100%" }}
              maxLength={255}
            />
          </Form.Item>
          
          <Form.Item
            name="NotApplicableApu"
            label="Apu Not Available"
            valuePropName="checked"
            style={{
              marginBottom: "12px",
            }}
            rules={[
              {
                type: boolean,
              },
            ]}
          >
            <Checkbox onChange={onApplicableApu} />
          </Form.Item>
          <Form.Item
            label={t("planning.Aircrafts.Total Apu Hours")}
            name="totalApuHours"
            rules={[
              {
                required: !isApplicableApu,
                message: "Please input total apu hours",
              },
            ]}
          >
            <Input disabled={isApplicableApu} maxLength={9} />
          </Form.Item>
          <Form.Item
            label={t("planning.Aircrafts.Total Apu Cycle")}
            name="totalApuCycle"
            rules={[
              {
                required: !isApplicableApu,
                message: "Please input total apu cycles",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              disabled={isApplicableApu}
              maxLength={9}
              onKeyDown={(e) => {
                e.key === "." && e.preventDefault();
              }}
            />
          </Form.Item>
          <Form.Item
            label={t("planning.Aircrafts.Daily Average Apu Hours")}
            name="dailyAverageApuHours"
            rules={[
              {
                required: !isApplicableApu,
                message:
                  "Please input daily average auxiliary power unit hours",
              },
            ]}
          >
            <Input
              style={{ width: "100%" }}
              disabled={isApplicableApu}
              maxLength={9}
            />
          </Form.Item>
          <Form.Item
            label={t("planning.Aircrafts.Daily Average Apu Cycle")}
            name="dailyAverageApuCycle"
            rules={[
              {
                required: !isApplicableApu,
                message:
                  "Please input daily average auxiliary power unit cycle",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              disabled={isApplicableApu}
              maxLength={9}
              onKeyDown={(e) => {
                e.key === "." && e.preventDefault();
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row justify={"center"} gutter={10}>
        <Col className="gutter-row" lg={18} md={12} sm={14} xs={24}>
          <Form.Item>
            <Space size="small">
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

export default ARMAircraftAdd;
