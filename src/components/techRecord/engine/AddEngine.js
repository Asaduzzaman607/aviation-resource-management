import { ProfileOutlined } from "@ant-design/icons";
import { Breadcrumb, Col, DatePicker, Form, Row, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { notifyResponseError } from "../../../lib/common/notifications";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import { formLayout } from "../../../lib/constants/layout";
import { useEngineIncident } from "../../../lib/hooks/planning/useEngineIncident";
import AircraftModelFamilyService from "../../../service/AircraftModelFamilyService";
import Permission from "../../auth/Permission";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";

const AddEngine = () => {
  const { onFinish, onReset, engineEnum, form } = useEngineIncident();
  const [aircraftModel, setAircraftModel] = useState([]);

  const getAllAircraftModel = async () => {
    try {
      const { data } =
        await AircraftModelFamilyService.getAllAircraftModelFamily();
      setAircraftModel(data.model);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  useEffect(() => {
    getAllAircraftModel();
  }, []);

  let { id } = useParams();
  const { t } = useTranslation();
  const title = id
    ? `Engine Incident ${t("common.Edit")}`
    : `Engine Incident ${t("common.Add")}`;

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
            <Link to="/reliability/engine-incidents">Engine Incidents</Link>
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
              name="engineIncidentForm"
              onFinish={onFinish}
              scrollToFirstError
              initialValues={{
                aircraftModelId: null,
                engineIncidentsEnum: null,
              }}
            >
              <Row>
                <Col sm={20} md={10}>
                  <Form.Item
                    name="aircraftModelId"
                    label={"Aircraft Model"}
                    rules={[
                      {
                        required: true,
                        message: "Aircraft model is required",
                      },
                    ]}
                  >
                    <Select placeholder="Please Select Aircraft">
                      {aircraftModel?.map((item, index) => {
                        return (
                          <Select.Option key={index} value={item.id}>
                            {item?.aircraftModelName}{" "}
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
                    name="engineIncidentsEnum"
                    label={"Engine Incident Type"}
                    rules={[
                      {
                        required: true,
                        message: "Incident type is required",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Please Select Engine Incident Type"
                      // onChange={() =>
                      //   form.setFieldsValue({ classificationTypeEnum: null })
                      // }
                    >
                      {engineEnum?.map((item, index) => {
                        return (
                          <Select.Option key={index} value={item.id}>
                            {item?.name}{" "}
                          </Select.Option>
                        );
                      })}
                    </Select>
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

export default AddEngine;
