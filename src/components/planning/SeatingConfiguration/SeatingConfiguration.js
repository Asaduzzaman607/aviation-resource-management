import {
  Breadcrumb,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Divider,
  Button,
  Modal,
  InputNumber,
} from "antd";
import { Option } from "antd/lib/mentions";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ARMAircraftAdd from "../aircraft/aircraft/ARMAircraftAdd";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import {
  useAircrafts,
  useAircraftsModal,
  useSeatingConfiguration,
} from "../../../lib/hooks/planning/aircrafts";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import { PlusOutlined } from "@ant-design/icons";
import { formLayout } from "../../../lib/constants/layout";
import ARMForm from "../../../lib/common/ARMForm";
import { validateMessages } from "../../../lib/common/FormValidation";
import { useTranslation } from "react-i18next";
import ARMCabin from "../Cabin/ARMCabin";
import useCabin from "../../../lib/hooks/planning/useCabin";
import Permission from "../../auth/Permission";

const SeatingConfiguration = () => {
  const {
    onNameChange,
    addItem,
    aircraftModelFamilies,
    name,
    onReset: onAirReset,
    form: onAirForm,
    isApplicableApu,
    onApplicableApu
  } = useAircrafts();

  const {
    onReset: onCabinReset,
    form: cabinForm
  } = useCabin()
  const {
    sId,
    form,
    onFinish,
    cabin,
    aircraft,
    onReset,
    showAircraftModal,
    setShowAircraftModal,
    onAircraftFinish,
    showCabinModal,
    setShowCabinModal,
    onCabinFinished
  } = useSeatingConfiguration();

  const { t } = useTranslation();

  const title = sId ? t("planning.Seating Configurations.Seating Configuration") + t("common.Edit") : t("planning.Seating Configurations.Seating Configuration") + t("common.Add");

  return (
    <div>
      <Modal
        title={t("planning.Aircrafts.Add New Aircraft")}
        centered
        onOk={() => setShowAircraftModal(false)}
        onCancel={() => setShowAircraftModal(false)}
        visible={showAircraftModal}
        width={1600}
        footer={null}
      >
        <ARMAircraftAdd
          onReset={onAirReset}
          form={onAirForm}
          onNameChange={onNameChange}
          addItem={addItem}
          aircraftModelFamilies={aircraftModelFamilies}
          name={name}
          onFinish={onAircraftFinish}
          isApplicableApu={isApplicableApu}
          onApplicableApu={onApplicableApu}
        />
      </Modal>
      <Modal
        title="Add New Cabin"
        centered
        onOk={() => setShowCabinModal(false)}
        onCancel={() => setShowCabinModal(false)}
        visible={showCabinModal}
        width={800}
        footer={null}
      >
        <ARMCabin
          onReset={onCabinReset}
          form={cabinForm}
          addItem={addItem}
          onFinish={onCabinFinished}
        />
      </Modal>
      <CommonLayout>
        <ARMBreadCrumbs>
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              <i className="fas fa-chart-line" />
              <Link to="/planning">&nbsp; {t("planning.Planning")}</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>
              <Link to="/planning/seating-configurations">
                {t("planning.Seating Configurations.Seating Configurations")}
              </Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>{sId ? t("common.Edit") : t("common.Add")}</Breadcrumb.Item>
          </Breadcrumb>
        </ARMBreadCrumbs>
        <Permission permission={["PLANNING_AIRCRAFT_SEATING_CONFIGURATION_SAVE","PLANNING_AIRCRAFT_SEATING_CONFIGURATION_EDIT"]} showFallback>
          <ARMCard
            title={getLinkAndTitle(title, `/planning/seating-configurations`,false,"PLANNING_AIRCRAFT_SEATING_CONFIGURATION_SAVE")}
          >
            <ARMForm
              form={form}
              name="basic"
              onFinish={onFinish}
              {...formLayout}
              validateMessages={validateMessages}
            >
              <Row>
                <Col lg={12} sm={20} xs={24}>
                  <Form.Item
                    name="cabinId"
                    label={t("planning.Seating Configurations.Cabin")}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select placeholder={t("planning.Cabins.Select Cabin")}
                    dropdownRender={(menu) => (
                      <>
                      <Permission permission="PLANNING_CONFIGURATIONS_CABIN_SEAT_TYPE_SAVE">
                        <Button
                          type="primary"
                          onClick={() => {
                            setShowCabinModal(true);
                          }}
                          style={{ width: "100%" }}
                        >
                          +Add New Cabin
                        </Button>
                        </Permission>
                        {menu}
                      </>
                    )}
                    >
                      {cabin?.map((item) => (
                        <Option key={item.cabinId} value={item.cabinId}>
                          {item.codeTitle}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name={["aircraftId"]}
                    label={t("planning.Aircrafts.Aircraft")}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      placeholder={t("planning.Aircrafts.Select Aircraft")}
                      allowClear
                      dropdownRender={(menu) => (
                        <>
                          <Button
                            type="primary"
                            onClick={() => {
                              setShowAircraftModal(true);
                            }}
                            style={{ width: "100%" }}
                          >
                            +Add New Aircraft
                          </Button>
                          {menu}
                        </>
                      )}
                    >
                      {aircraft?.map((item,index) => {
                        return (
                          <Option key={index} value={item.aircraftId}>
                            {item.aircraftName}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="noOfSeats"
                    label={t("planning.Seating Configurations.Number of Seat")}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      maxLength={9}
                      onKeyDown={(e) => {
                        e.key === "." && e.preventDefault();
                      }}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col sm={24} md={12}>
                  <Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}>
                    <Space size="small">
                      <ARMButton size="medium" type="primary" htmlType="submit">
                        {sId ? t("common.Update") : t("common.Submit")}
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
          </ARMCard>
        </Permission>
      </CommonLayout>
    </div>
  );
};

export default SeatingConfiguration;
