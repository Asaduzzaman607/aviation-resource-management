import { usePhaseCheck } from "../../../lib/hooks/planning/usePhaseCheck";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from "antd";
import { Link } from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import ARMForm from "../../../lib/common/ARMForm";
import { formLayout } from "../../../lib/constants/layout";
import ARMButton from "../../common/buttons/ARMButton";
import { Option } from "antd/lib/mentions";
import ARMTable from "../../common/ARMTable";
import styled from "styled-components";
import { useMWO } from "../../../lib/hooks/planning/useMWO";
import React, { useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Permission from "../../auth/Permission";

const AntdFormItem = styled(Form.Item)`
  .ant-col-16 {
    max-width: 100%;
  }
`;

export default function MWOAdd() {
  const { t } = useTranslation();

  const fields = {
    aircraftId: {
      label: t("planning.Aircrafts.Aircraft Name"),
      name: "aircraftId",
      value: "",
    },

    airframeSerial: {
      label: t("planning.Aircrafts.Aircraft Serial No"),
      name: "airframeSerial",
      value: "",
    },

    workShopMaint: {
      label: t("planning.MWO.Work Shop/Maint"),
      name: "workShopMaint",
      value: "",
    },

    woNo: {
      label: t("planning.MWO.W/O No"),
      name: "woNo",
      value: "",
    },

    date: {
      label: t("planning.MWO.Date"),
      name: "date",
      value: "",
    },

    totalAcHours: {
      label: t("planning.MWO.Total A/C HRS"),
      name: "totalAcHours",
      value: 0.0,
    },

    totalAcLanding: {
      label: t("planning.MWO.Total A/C Landing"),
      name: "totalAcLanding",
      value: "",
    },

    tsnComp: {
      label: t("planning.MWO.TSN/CSN Of The Comp"),
      name: "tsnComp",
      value: "",
    },

    tsoComp: {
      label: t("planning.MWO.TSO/CSO Of The Comp"),
      name: "tsoComp",
      value: "",
    },

    asOfDate: {
      label: t("planning.MWO.As Of (Date)"),
      name: "asOfDate",
      value: "",
    },
    woTaskList: [
      {
        name: "slNo",
        value: "",
      },
      {
        name: "description",
        value: "",
      },
      {
        name: "workCardNo",
        value: "",
      },
      {
        name: "complianceDate",
        value: "",
      },
      {
        name: "accomplishDate",
        value: "",
      },
      {
        name: "authNo",
        value: "",
      },
      {
        name: "remarks",
        value: "",
      },
    ],
  };

  const mapToKeyValue = (obj) => ({ [obj.name]: obj.value });
  const mergeObjects = (obj1, obj2) => ({ ...obj1, obj2 });

  const initialValues = Object.values(fields)
    .map(mapToKeyValue)
    .reduce(mergeObjects, {});
  const {
    form,
    onFinish,
    aircrafts,
    onReset,
    id,
    aircraftId,
    setAircraftId,
    isDisabled,
  } = useMWO();

  const TITLE = id
    ? `${t("planning.MWO.Maintenance Work Orders")} ${t("common.Edit")}`
    : `${t("planning.MWO.Maintenance Work Orders")} ${t("common.Add")}`;

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line" /> &nbsp;{t("planning.Planning")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/planning/mwos">
              {t("planning.MWO.Maintenance Work Orders")}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {id ? t("common.Edit") : t("common.Add")}
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission permission={["PLANNING_SCHEDULE_TASKS_MAINTENANCE_WORK_ORDERS_SAVE","PLANNING_SCHEDULE_TASKS_MAINTENANCE_WORK_ORDERS_EDIT"]} showFallback>

      <ARMCard title={getLinkAndTitle(`${TITLE}`, "/planning/mwos",false,"PLANNING_SCHEDULE_TASKS_MAINTENANCE_WORK_ORDERS_SAVE")}>
        <ARMForm
          form={form}
          name="basic"
          {...formLayout}
          onFinish={onFinish}
          scrollToFirstError
          initialValues={initialValues}
        >
          <Row>
            <Col sm={24} md={12} xs={24}>
              <Form.Item
                {...fields.aircraftId}
                style={{
                  marginBottom: "16px",
                }}
                rules={[
                  {
                    required: true,
                    message: "Aircraft name is required!",
                  },
                ]}
              >
                <Select onChange={setAircraftId}>
                  {aircrafts?.map((item) => {
                    return (
                      <Select.Option key={item.aircraftId} value={item.aircraftId}>
                        {item.aircraftName}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                {...fields.airframeSerial}
                style={{
                  marginBottom: "16px",
                }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                {...fields.workShopMaint}
                style={{
                  marginBottom: "16px",
                }}
                rules={[
                  {
                    max: 255,
                    message: "Maximum 255 characters is allowed!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                {...fields.woNo}
                style={{
                  marginBottom: "16px",
                }}
                rules={[
                  {
                    required: true,
                    message: "WO No is required!",
                  },
                  {
                    max: 255,
                    message: "Maximum 255 characters allowed!",
                  },
                ]}
              >
                <Input disabled={isDisabled} />
              </Form.Item>
              <Form.Item
                {...fields.date}
                style={{
                  marginBottom: "16px",
                }}
                rules={[
                  {
                    required: true,
                    message: "Date is required!",
                  },
                ]}
              >
                <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col sm={24} md={12} xs={24}>
              <Form.Item
                {...fields.totalAcHours}
                style={{
                  marginBottom: "16px",
                }}
                rules={[
                  {
                    required: true,
                    message: "Total Ac hours is required!",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  maxLength={9}
                  onKeyDown={(e) => {
                    (e.key === "e" || e.key === "-") && e.preventDefault();
                  }}
                />
              </Form.Item>

              <Form.Item
                {...fields.totalAcLanding}
                style={{
                  marginBottom: "16px",
                }}
                rules={[
                  {
                    required: true,
                    message: "Total Ac landing is required!",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  maxLength={8}
                  onKeyDown={(e) => {
                    (e.key === "e" || e.key === "-") && e.preventDefault();
                  }}
                />
              </Form.Item>

              <Form.Item
                {...fields.tsnComp}
                style={{
                  marginBottom: "16px",
                }}
                rules={[
                  {
                    max: 255,
                    message: "Maximum 255 characters allowed!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                {...fields.tsoComp}
                style={{
                  marginBottom: "16px",
                }}
                rules={[
                  {
                    max: 255,
                    message: "Maximum 255 characters allowed!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                {...fields.asOfDate}
                style={{
                  marginBottom: "16px",
                }}
                rules={[
                  {
                    required: true,
                    message: "As of date is required!",
                  },
                ]}
              >
                <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <AntdFormItem>
            <Row>
              <Form.List name="woTaskList">
                {(fields, { add, remove }) => (
                  <>
                    <ARMTable>
                      <thead>
                        <tr style={{ fontSize: "10px" }}>
                          <th style={{ width: "5%" }}>
                            SL
                            <br />
                            NO{" "}
                          </th>
                          <th>
                            BRIEF DESCRIPTION (D.I / PFI / ANY OTHER CHECK /{" "}
                            <br />
                            INSPECTION / MO / IO NO / COMPONENT CHANGE ETC.){" "}
                          </th>
                          <th>
                            Work Card No
                            <br />
                            /M.O./I./IO NO.P/N &amp; S/N ETC.
                          </th>
                          <th>
                            COMPLIANCE <br /> REQUIRED BY DT,
                            <br /> TAT, TAC ETC.
                          </th>
                          <th>
                            ACCOMPLISH-MENT <br /> DATE
                          </th>
                          <th>
                            SIG &amp; AUTH. NO.
                            <br />
                            OF SHIFT I/C OR <br />
                            SHOP I/C /AME
                          </th>
                          <th>REMARKS (IF ANY) </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fields.map(({ key, name, ...restField }, index) => (
                          <tr key={key}>
                            <td>
                              <Form.Item
                                {...restField}
                                name={[name, "slNo"]}
                                rules={[
                                  {
                                    required: true,
                                    message: t(
                                      "planning.MWO.Serial number is required"
                                    ),
                                  },
                                ]}
                                style={{ padding: "3px" }}
                                initialValue={index + 1}
                              >
                                <Input
                                  maxLength={1}
                                  onKeyDown={(e) => {
                                    e.key === "-" && e.preventDefault();
                                  }}
                                />
                              </Form.Item>
                            </td>
                            <td>
                              <Form.Item
                                {...restField}
                                name={[name, "description"]}
                                rules={[
                                  {
                                    required: true,
                                    message: t(
                                      "planning.MWO.Description is required"
                                    ),
                                  },
                                  {
                                    max: 255,
                                    message: "Maximum 255 characters allowed!",
                                  },
                                ]}
                                style={{ padding: "3px" }}
                              >
                                <Input.TextArea autoSize maxLength={255}/>
                              </Form.Item>
                            </td>
                            <td>
                              <Form.Item
                                {...restField}
                                name={[name, "workCardNo"]}
                                rules={[
                                  {
                                    required: true,
                                    message: t(
                                      "planning.MWO.Work card is required"
                                    ),
                                  },
                                  {
                                    max: 255,
                                    message: "Maximum 255 characters allowed!",
                                  },
                                ]}
                                style={{ padding: "3px" }}
                              >
                                <Input />
                              </Form.Item>
                            </td>
                            <td>
                              <Form.Item
                                {...restField}
                                name={[name, "complianceDate"]}
                                style={{ padding: "3px" }}
                              >
                                <DatePicker
                                  format="DD-MM-YYYY"
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                            </td>
                            <td>
                              <Form.Item
                                {...restField}
                                name={[name, "accomplishDate"]}
                                style={{ padding: "3px" }}
                              >
                                <DatePicker
                                  format="DD-MM-YYYY"
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                            </td>
                            <td>
                              <Form.Item
                                {...restField}
                                name={[name, "authNo"]}
                                rules={[
                                  {
                                    max: 255,
                                    message: "Maximum 255 characters allowed!",
                                  },
                                ]}
                              >
                                <Input />
                              </Form.Item>
                            </td>
                            <td>
                              <Form.Item
                                {...restField}
                                name={[name, "remarks"]}
                                style={{ padding: "3px" }}
                                rules={[
                                  {
                                    max: 255,
                                    message: "Maximum 255 characters allowed!",
                                  },
                                ]}
                              >
                                <Input />
                              </Form.Item>
                            </td>
                            <td>
                              <MinusCircleOutlined
                                onClick={() => {
                                  remove(index);
                                  const woTaskList = form
                                    .getFieldValue("woTaskList")
                                    ?.map((task, index) => ({
                                      ...task,
                                      slNo: index + 1,
                                    }));

                                  form.setFieldsValue({ woTaskList });
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </ARMTable>

                    <Form.Item style={{ marginTop: "10px" }}>
                      {fields.length != 4 && (
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          {t("planning.MWO.Add field")}
                        </Button>
                      )}
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Row>
          </AntdFormItem>

          <Row>
            <Col sm={24} md={8}>
              <Form.Item wrapperCol={{ ...formLayout.wrapperCol }}>
                <Space size="small">
                  <ARMButton size="medium" type="primary" htmlType="submit">
                    {id ? t("common.Update") : t("common.Submit")}
                  </ARMButton>
                  <ARMButton
                    onClick={onReset}
                    size="medium"
                    type="primary"
                    danger
                  >
                    Reset
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </ARMForm>
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
}
