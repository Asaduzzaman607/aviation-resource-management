import { ProfileOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Input, InputNumber,
  Row,
  Select,
  Space,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { notifyResponseError } from "../../../lib/common/notifications";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import { formLayout } from "../../../lib/constants/layout";
import { useIncident } from "../../../lib/hooks/planning/useIncident";
import AircraftService from "../../../service/AircraftService";
import Permission from "../../auth/Permission";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";

const sequences = [
  {value: 'A'},
  {value: 'B'},
]

const AddIncident = () => {
  const { onFinish, onReset, incidentType, classification, form,pageNoAlphabets } =
    useIncident();
  const incidentTypeValue = Form.useWatch('incidentTypeEnum', form)
  const classificationValue = Form.useWatch('classificationTypeEnum', form)
  let { id } = useParams();
  const [aircrafts, setAircrafts] = useState([]);

  const getAllAircraft = async () => {
    try {
      const { data } = await AircraftService.getAllAircraftList();
      setAircrafts(data);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  useEffect(() => {
    getAllAircraft();
  }, []);

  const { t } = useTranslation();
  const title = id
    ? `Incident ${t("common.Edit")}`
    : `Incident ${t("common.Add")}`;

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/reliability">
              <ProfileOutlined />
              &nbsp; Reliability
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/reliability/incident">Incidents</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            {id ? t("common.Edit") : t("common.Add")}
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission={[""]} showFallback>
        <ARMCard
          title={getLinkAndTitle(title, "/reliability/Incident", false, "")}
        >
          <div>
            <Form
              {...formLayout}
              form={form}
              name="incidentForm"
              onFinish={onFinish}
              scrollToFirstError
              initialValues={{
                aircraftId: null,
                incidentTypeEnum: null,
                classificationTypeEnum: null,
                incidentDesc: null,
                actionDesc: null,
                referenceAtl: null,
              }}
            >
              <Row>
                <Col sm={20} md={10}>
                  <Form.Item
                    name="aircraftId"
                    label={"Aircraft"}
                    rules={[
                      {
                        required: true,
                        message: "Aircraft is required",
                      },
                    ]}
                  >
                    <Select placeholder="Please Select Aircraft">
                      {aircrafts?.map((item, index) => {
                        return (
                          <Select.Option key={index} value={item.aircraftId}>
                            {item?.aircraftName}{" "}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                      name="referenceAtl"
                      label="Reference Atl"
                      style={{ marginBottom: "12px" }}
                      rules={[
                        {
                          required: true,
                          message: "Ref atl is required",
                        },
                      ]}
                  >
                    <Select
                        onChange={(e) => {form.setFieldsValue({seqNo: ""})}}
                        allowClear
                        placeholder="Please Select Ref ATL"
                    >
                      {pageNoAlphabets?.map((item) => {
                        return (
                            <Select.Option key={item.referenceAtl} value={item.referenceAtl}>
                              {item?.referenceAtl}
                            </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="date"
                    label="Date"
                    style={{
                      marginBottom: "16px",
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Date is required",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{
                        width: "100%",
                      }}
                      format="DD-MM-YYYY"
                    />
                  </Form.Item>
                  <Form.Item
                    name="incidentTypeEnum"
                    label={"Incident Type"}
                    rules={[
                      {
                        required: true,
                        message: "Incident type is required",
                      },
                    ]}
                  >
                    <Select
                        allowClear
                      placeholder="Please Select Incident Type"
                      onChange={() =>
                        form.setFieldsValue({ classificationTypeEnum: null })
                      }
                    >
                      {incidentType?.map((item, index) => {
                        return (
                          <Select.Option key={index} value={item.id}>
                            {item?.name}{" "}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="classificationTypeEnum"
                    label={"Classification"}
                    rules={[
                      {
                        required: true,
                        message: "Classification is required",
                      },
                    ]}
                  >
                    <Select placeholder="Please Select Classification">
                      {classification?.map((item, index) => {
                        return (
                          <Select.Option key={index} value={item.id}>
                            {item?.name}{" "}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>

                  {
                    (incidentTypeValue === 0 && classificationValue=== 6) ||  (incidentTypeValue === 1 && classificationValue=== 12) ?
                        <Form.Item
                            name="remarks"
                            label="Remarks"
                            rules={[
                              {
                                required: false,
                              },
                              {
                                max: 500,
                                message: "Maximum 500 character is allowed",
                              },
                            ]}
                            style={{ marginBottom: "12px" }}
                        >
                          <TextArea autoSize/>
                        </Form.Item>
                        : null
                  }

                  <Form.Item
                      name="seqNo"
                      label={'Seq'}
                      rules={[
                        {
                          required: true,
                          message: "Seq  is required",
                        },
                      ]}
                  >
                    <Select
                        onChange={(e) => {form.setFieldsValue({defectDescription: "", rectDescription : ""})}}
                        placeholder="Please Select Seq"
                        allowClear
                    >
                      {sequences?.map((item) => {
                        return (
                            <Select.Option key={item.value} value={item.value}>
                              {item?.value}
                            </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="incidentDesc"
                    label="Incident Description"
                    rules={[
                      {
                        required: true,
                      },
                      {
                        max: 500,
                        message: "Maximum 500 character is allowed",
                      },
                    ]}
                    style={{ marginBottom: "12px" }}
                  >
                    <TextArea />
                  </Form.Item>
                  <Form.Item
                    name="actionDesc"
                    label="Action Description"
                    rules={[
                      {
                        required: true,
                      },
                      {
                        max: 500,
                        message: "Maximum 500 character is allowed",
                      },
                    ]}
                    style={{ marginBottom: 12 }}
                  >
                    <TextArea />
                  </Form.Item>
                </Col>
                <Col sm={20} md={10}></Col>
              </Row>
              <Row>
                <Col sm={20} md={10}>
                  <Form.Item
                    wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}
                  >
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
                        {t("common.Reset")}
                      </ARMButton>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default AddIncident;
