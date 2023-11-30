import { Breadcrumb, Col, Form, Input, Row, Select, Space } from "antd";
import React, { useEffect, useState, useTransition } from "react";
import { Link, useParams } from "react-router-dom";
import ARMForm from "../../../lib/common/ARMForm";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";
import { formLayout } from "../../../lib/constants/form";
import ARMButton from "../../common/buttons/ARMButton";
import ShopVisitTmm from "./ShopVisitTmm";
import ShopVisitRGB from "./ShopVisitRGB";
import EngineTimesTMM from "./EngineTimesTMM";
import EngineTimesRGB from "./EngineTimesRGB";
import { useEngineTimesAdd } from "../../../lib/hooks/planning/useEngineTimesAdd";
import styled from "styled-components";
import EngineTimesNameExtension from "./EngineTimesNameExtension";
import Permission from "../../auth/Permission";

const AntdFormItem = styled(Form.Item)`
  .ant-col-16 {
    max-width: 100%;
  }
`;

const CustomDiv = styled.div`

  @media (max-width: 992px) {
    margin-top: 136px;
  }
`;

export default function EngineTimes() {
  const {
    aircrafts,
    setAircraftId,
    engines,
    getAllEngineByAircraftId,
    onFinish,
    onReset,
    form,
    aircraftBuildId,
  } = useEngineTimesAdd();

  let TITLE = aircraftBuildId ? "Engine Information Edit" : "Engine Information Add";

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {" "}
            <Link to="/planning">
              {" "}
              <i className="fas fa-chart-line" />
              &nbsp; Planning
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/planning/engine/times">Engine Information</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{aircraftBuildId ? "edit" : "add"}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission={["PLANNING_ENGINE_PROPELLER_LANDING_GEAR_ENGINE_INFORMATION_SAVE","PLANNING_ENGINE_PROPELLER_LANDING_GEAR_ENGINE_INFORMATION_EDIT"]} showFallback>
      <ARMCard title={getLinkAndTitle(TITLE, "/planning/engine/times",false,"PLANNING_ENGINE_PROPELLER_LANDING_GEAR_ENGINE_INFORMATION_SAVE")}>
        <ARMForm
          {...formLayout}
          form={form}
          name="aml"
          initialValues={{}}
          onFinish={onFinish}
          scrollToFirstError
        >
          <AntdFormItem>
            <Row gutter={10}>
              <Col xs={24} md={6}>
                <Form.Item
                  name="aircraftId"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Aircraft",
                    },
                  ]}
                >
                  <Select
                    placeholder="Please Select Aircraft"
                    onChange={setAircraftId}
                  >
                    {aircrafts?.map((item) => {
                      return (
                        <Select.Option key={item.id} value={item.aircraftId}>
                          {item?.aircraftName}{" "}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={6}>
                <Form.Item
                  name="aircraftBuildId"
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
                >
                  <Select placeholder="Select Engine Position">
                    {engines?.map((item) => {
                      return (
                        <Select.Option
                          key={item.aircraftBuildId}
                          value={item.aircraftBuildId}
                        >
                          {item?.position}{" "}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </AntdFormItem>

          <Row gutter={[12, 12]}>
            <Col sm={24} md={12}>
              <ShopVisitTmm />
              <EngineTimesNameExtension />
              <EngineTimesTMM />
            </Col>

            <Col sm={24} md={12}>
              <ShopVisitRGB />
              <CustomDiv style={{ marginTop: "136px" }}></CustomDiv>
              <EngineTimesRGB />
            </Col>
          </Row>

          <Row>
            <Col sm={24} md={12}>
              <Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}>
                <Space>
                  <ARMButton size="medium" type="primary" htmlType="submit">
                    {"Submit"}
                  </ARMButton>
                  <ARMButton
                    size="medium"
                    type="primary"
                    danger
                    onClick={onReset}
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
