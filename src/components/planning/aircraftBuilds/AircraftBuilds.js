import {
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Space,
} from "antd";
import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { boolean } from "yup";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import { formLayout } from "../../../lib/constants/form";
import { useAircraftBuilds } from "../../../lib/hooks/planning/useAircraftBuilds";
import { useSerialNo } from "../../../lib/hooks/planning/useSerialNo";
import Permission from "../../auth/Permission";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import AddSerialNoForm from "../aircraft/serialNo/AddSerialNoForm";

const CustomInput = styled(Input)`
  .ant-input-group-addon {
    padding: 0px;
    border: 0px;
  }
`;
const AntdFormItem = styled(Form.Item)`
  .ant-col-16 {
    max-width: 100%;
  }
`;

const CardButton = styled(Button)`
  @media (max-width: 576px) {
    margin-left: 0px;
  }
  @media (min-width: 992px) {
    margin-left: 2px;
  }
`;

const AircraftBuilds = () => {
  const { handleReset: handleSerialReset,onSearch,parts,form:higherSerialForm,form: serialForm } =useSerialNo();
  const {
    id,
    form,
    onFinish,
    aircraft,
    getAircraftId,
    getModelId,
    getHigherModelId,
    higherModel,
    higherPart,
    model,
    part,
    getPostionIdByLocationId,
    location,
    position,
    getLocationIdByPositionId,
    onChange,
    isOver,
    isShop,
    onShopChange,
    onReset,
    status,
    getSerialNo,
    setPartId,
    findExistInactiveAircraftBuild,
    isTsnAvailable,
    onTsnAvailableChange,
    updatedAircarftDisabled,
    serialData,
    setHigherPartId,
    higherSerialData,
    setSerialId,
    showSerialModal,
    setShowSerialModal,
    handleSerialSubmit,
    getPartoOject,
    handleHigherSerialSubmit,
    showHigherSerialModal,
    setShowHigherSerialModal,
    getHigherPartObject
  } = useAircraftBuilds(parts,serialForm,higherSerialForm);
  const { t } = useTranslation();

  const today = moment(new Date(), "YYYY-MM-DD");

  let title = id
    ? `${t("planning.Aircraft Builds.Aircraft Build")} ${t("common.Edit")}`
    : `${t("planning.Aircraft Builds.Aircraft Build")} ${t("common.Add")}`;

  return (
    <>
      <CommonLayout>
      <Modal
        title="Add Serial No"
        style={{
          top: 20,
        }}
        onOk={() => setShowSerialModal(false)}
        onCancel={() => setShowSerialModal(false)}
        centered
        visible={showSerialModal}
        width={1080}
        footer={null}
      >
       <AddSerialNoForm id={id}
          onFinish={handleSerialSubmit}
          form={serialForm}
          handleReset={handleSerialReset}
          onSearch={onSearch}
          parts={parts}
          getPartoOject={getPartoOject}
          type={true}
        />
      </Modal>
      <Modal
        title="Add Higher Serial No"
        style={{
          top: 20,
        }}
        onOk={() => setShowHigherSerialModal(false)}
        onCancel={() => setShowHigherSerialModal(false)}
        centered
        visible={showHigherSerialModal}
        width={1080}
        footer={null}
      >
       <AddSerialNoForm id={id}
          onFinish={handleHigherSerialSubmit}
          form={serialForm}
          handleReset={handleSerialReset}
          onSearch={onSearch}
          parts={parts}
          getHigherPartObject={getHigherPartObject}
          type={true}
        />
      </Modal>
        <ARMBreadCrumbs>
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              <Link to="/planning">
                <i className="fas fa-chart-line" />
                &nbsp; {t("planning.Planning")}
              </Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>
              <Link to="/planning/aircraft-builds">
                {t("planning.Aircraft Builds.Aircraft Builds")}
              </Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>
              {id ? t("common.Edit") : t("common.Add")}
            </Breadcrumb.Item>
          </Breadcrumb>
        </ARMBreadCrumbs>
        <Permission permission={["PLANNING_AIRCRAFT_BUILD_AIRCRAFT_SAVE","PLANNING_AIRCRAFT_BUILD_AIRCRAFT_EDIT"]} showFallback>
        <ARMCard title={getLinkAndTitle(title, "/planning/aircraft-builds",false,"PLANNING_AIRCRAFT_BUILD_AIRCRAFT_SAVE")}>
          <Form
            {...formLayout}
            form={form}
            initialValues={{
              aircraftId: "",
              higherSerial: "",
              serial: "",
              isTsnAvailable: true,
              serialNo: "",
              attachDate:today
            }}
            name="AircraftBuilds"
            onFinish={onFinish}
            scrollToFirstError
          >
            <Row>
              <Col sm={20} md={10}>
                <Form.Item
                  name="aircraftId"
                  label={t("planning.Aircrafts.Aircraft")}
                  style={{
                    marginBottom: "16px",
                  }}
                  rules={[
                    {
                      required: true,
                      message: t(
                        "planning.Aircraft Builds.Aircraft is required"
                      ),
                    },
                  ]}
                >
                  <Select
                    disabled={updatedAircarftDisabled}
                    allowClear
                    onChange={(e) => getAircraftId(e)}
                    placeholder={t("planning.Aircrafts.Select Aircraft")}
                    showSearch
                    filterOption={(inputValue, option) =>
                      option.children
                        .toString("")
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    }
                  >
                    {aircraft?.map((item) => {
                      return (
                        <Select.Option key={item.id} value={item.aircraftId}>
                          {item.aircraftName}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="higherModelId"
                  label={t("planning.Model Trees.Higher Model")}
                  style={{
                    marginBottom: "16px",
                  }}
                  rules={[
                    {
                      required: true,
                      message: t(
                        "planning.Aircraft Builds.Higher Model is required"
                      ),
                    },
                  ]}
                >
                  <Select
                    disabled={updatedAircarftDisabled}
                    allowClear
                    showSearch
                    filterOption={(inputValue, option) =>
                      option.children
                        .toString("")
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    }
                    placeholder={t("planning.Model Trees.Select Higher Model")}
                    onChange={(e) => getHigherModelId(e)}
                  >
                    {higherModel?.map((item) => {
                      return (
                        <Select.Option key={item.modelId} value={item.modelId}>
                          {item.modelName}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="higherPartId"
                  label={t("planning.Aircraft Builds.Higher Part")}
                  style={{
                    marginBottom: "16px",
                  }}
                  rules={[
                    {
                      required: true,
                      message: t(
                        "planning.Aircraft Builds.Higher Part is required"
                      ),
                    },
                  ]}
                >
                  <Select
                    disabled={updatedAircarftDisabled}
                    onChange={setHigherPartId}
                    placeholder={t(
                      "planning.Aircraft Builds.Select Higher Part"
                    )}
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
                  name="higherSerialNo"
                  label={t("planning.Aircraft Builds.Higher Serial No")}
                  style={{
                    marginBottom: "16px",
                  }}
                  rules={[
                    {
                      required: true,
                      message: t(
                        "planning.Aircraft Builds.Higher Serial No is required"
                      ),
                    },
                  ]}
                >
                  <Input maxLength={30} />
                </Form.Item> */}
                <Form.Item
                  name="higherSerialId"
                  label={t("planning.Aircraft Builds.Higher Serial No")}
                  style={{
                    marginBottom: "16px",
                  }}
                  onChange={(e) => getSerialNo(e)}
                  rules={[
                    {
                      required: true,
                      message: t(
                        "planning.Aircraft Builds.Serial No is required"
                      ),
                    },
                  ]}
                >
                  <Select
                    disabled={updatedAircarftDisabled}
                    style={{ width: "100%" }}
                    placeholder={t("planning.Parts.Select Part")}
                    dropdownRender={(menu) => (
                      <>
                      <Permission permission="PLANNING_AIRCRAFT_SERIAL_SAVE">
                        <Button
                          style={{ width: "100%" }}
                          type="primary"
                          onClick={() => setShowHigherSerialModal(true)}
                        >
                          + Add Higher Serial No
                        </Button>
                      </Permission>
                        {menu}
                      </>
                    )}
                  >
                    {higherSerialData?.map((item) => {
                      return (
                        <Select.Option
                          key={item.higherSerialId}
                          value={item.higherSerialId}
                        >
                          {item.higherSerialNo}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="modelId"
                  label={t("planning.Models.Model")}
                  style={{
                    marginBottom: "16px",
                  }}
                  rules={[
                    {
                      required: true,
                      message: t("planning.Aircraft Builds.Model is required"),
                    },
                  ]}
                >
                  <Select
                    disabled={updatedAircarftDisabled}
                    allowClear
                    showSearch
                    filterOption={(inputValue, option) =>
                      option.children
                        .toString("")
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    }
                    placeholder={t("planning.Models.Select a Model")}
                    onChange={(e) => getModelId(e)}
                  >
                    {model?.map((item) => {
                      return (
                        <Select.Option key={item.modelId} value={item.modelId}>
                          {item.modelName}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="partId"
                  label={t("planning.Parts.Part")}
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
                    disabled={updatedAircarftDisabled}
                    placeholder={t("planning.Parts.Select Part")}
                    onChange={setPartId}
                  >
                    {part?.map((item) => {
                      return (
                        <Select.Option key={item.partId} value={item.partId}>
                          {item.partNo}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Row>
                  <Col span={22}>
                    <Form.Item
                      name="serialId"
                      label={t("planning.Aircraft Builds.Serial No")}
                      style={{
                        marginBottom: "16px",
                        marginLeft: "4%",
                      }}
                      
                      rules={[
                        {
                          required: true,
                          message: t(
                            "planning.Aircraft Builds.Serial No is required"
                          ),
                        },
                      ]}
                    >
                      <Select
                        disabled={updatedAircarftDisabled}
                        style={{ width: "100%" }}
                        placeholder={t("planning.Parts.Select Part")}
                       // onChange={setPartId}
                        onChange={setSerialId}
                        dropdownRender={(menu) => (
                          <>
                          <Permission permission="PLANNING_AIRCRAFT_SERIAL_SAVE">
                            <Button
                              style={{ width: "100%" }}
                              type="primary"
                              onClick={() => setShowSerialModal(true)}
                            >
                              + Add Serial No
                            </Button>
                          </Permission>
                            {menu}
                          </>
                        )}
                      >
                        {serialData?.map((item) => {
                          return (
                            <Select.Option
                              key={item.serialId}
                              value={item.serialId}
                            >
                              {item.serialNo}
                            </Select.Option>
                          );
                        })}
                      </Select>
                      {/* <CustomInput
                    className="searchBtn"
                    maxLength={30}
                    addonAfter={
                      <Button onClick={findExistInactiveAircraftBuild}>
                        Find
                      </Button>
                    }
                  /> */}
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Form.Item>
                      <CardButton onClick={findExistInactiveAircraftBuild}>
                        Find
                      </CardButton>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="locationId"
                  label={t("planning.Locations.Location")}
                  style={{
                    marginBottom: "16px",
                  }}
                  rules={[
                    {
                      required: true,
                      message: t(
                        "planning.Aircraft Builds.Location is required"
                      ),
                    },
                  ]}
                >
                  <Select
                   
                    placeholder={t("planning.Locations.Select a Location")}
                    onChange={getPostionIdByLocationId}
                  >
                    {location?.map((item) => {
                      return (
                        <Select.Option
                          key={item.locationId}
                          value={item.locationId}
                        >
                          {item.locationName}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="positionId"
                  label={t("planning.Positions.Position")}
                  style={{
                    marginBottom: "16px",
                  }}
                  rules={[
                    {
                      required: true,
                      message: t(
                        "planning.Aircraft Builds.Position is required"
                      ),
                    },
                  ]}
                >
                  <Select
                   
                    placeholder={t("planning.Positions.Select a Position")}
                    onChange={getLocationIdByPositionId}
                  >
                    {position?.map((item) => {
                      return (
                        <Select.Option
                          key={item.positionId}
                          value={item.positionId}
                        >
                          {item.positionName}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="isTsnAvailable"
                  label="Tsn Available"
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
                  <Checkbox onChange={onTsnAvailableChange} />
                </Form.Item>

                {isTsnAvailable === true && (
                  <>
                    <Form.Item
                      name="tsnHour"
                      label={t("planning.Aircraft Builds.TSN")}
                      style={{
                        marginBottom: "16px",
                      }}
                    >
                      <Input maxLength={9} />
                    </Form.Item>
                    <Form.Item
                      name="tsnCycle"
                      label={t("planning.Aircraft Builds.CSN")}
                      style={{
                        marginBottom: "16px",
                      }}
                    >
                      <Input
                        maxLength={9}
                        onKeyDown={(e) => {
                          e.key === "." && e.preventDefault();
                        }}
                      />
                    </Form.Item>
                  </>
                )}
              </Col>

              <Col sm={22} md={12}>
                <Row
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  <Col md={10} offset={4}>
                    <Form.Item
                      name="isOverhauled"
                      label={t("planning.Aircraft Builds.Is Overhauled")}
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
                      &nbsp; <Checkbox checked={isOver} onChange={onChange} />
                    </Form.Item>
                  </Col>
                  <Col md={10}>
                    <Form.Item
                      name="isShopVisited"
                      label={t("planning.Aircraft Builds.Is Shop Visited")}
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
                      &nbsp;{" "}
                      <Checkbox
                        checked={isShop}
                        onChange={onShopChange}
                        disabled={isOver}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {isOver === true ? (
                  <>
                    <Form.Item
                      name="tsoHour"
                      label="TSO "
                      style={{
                        marginBottom: "12px",
                      }}
                      rules={[
                        {
                          required: false,
                        },
                      ]}
                    >
                      <Input maxLength={9} />
                    </Form.Item>

                    <Form.Item
                      name="tsoCycle"
                      label="CSO"
                      style={{
                        marginBottom: "12px",
                      }}
                      rules={[
                        {
                          required: false,
                        },
                      ]}
                    >
                      <Input
                        maxLength={9}
                        onKeyDown={(e) => {
                          e.key === "." && e.preventDefault();
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="tslsvHour"
                      label="TSLSV"
                      style={{
                        marginBottom: "12px",
                      }}
                      rules={[
                        {
                          required: false,
                        },
                      ]}
                    >
                      <Input maxLength={9} />
                    </Form.Item>

                    <Form.Item
                      name="tslsvCycle"
                      label="CSLSV "
                      style={{
                        marginBottom: "16px",
                      }}
                      rules={[
                        {
                          required: false,
                        },
                      ]}
                    >
                      <Input
                        maxLength={9}
                        onKeyDown={(e) => {
                          e.key === "." && e.preventDefault();
                        }}
                      />
                    </Form.Item>
                  </>
                ) : null}

                {isShop === true && isOver === false ? (
                  <>
                    <Form.Item
                      name="tslsvHour"
                      label="TSLSV"
                      style={{
                        marginBottom: "16px",
                      }}
                      rules={[
                        {
                          required: false,
                        },
                      ]}
                    >
                      <Input maxLength={30} />
                    </Form.Item>

                    <Form.Item
                      name="tslsvCycle"
                      label="CSLSV  "
                      style={{
                        marginBottom: "16px",
                      }}
                      rules={[
                        {
                          required: false,
                        },
                      ]}
                    >
                      <Input
                        maxLength={9}
                        onKeyDown={(e) => {
                          e.key === "." && e.preventDefault();
                        }}
                      />
                    </Form.Item>
                  </>
                ) : null}

                <Form.Item
                  name="aircraftInHour"
                  label={t("planning.Aircraft Builds.Aircraft In Hour")}
                  style={{
                    marginBottom: "16px",
                  }}
                  rules={[
                    {
                      required: true,
                      message: t(
                        "planning.Aircraft Builds.Aircraft In Hour is required"
                      ),
                    },
                  ]}
                >
                  <Input maxLength={9} />
                </Form.Item>
                <Form.Item
                  name="aircraftInCycle"
                  label={t("planning.Aircraft Builds.Aircraft In Cycle")}
                  style={{
                    marginBottom: "16px",
                  }}
                  rules={[
                    {
                      required: true,
                      message: t(
                        "planning.Aircraft Builds.Aircraft In Cycle is required"
                      ),
                    },
                  ]}
                >
                  <Input
                    maxLength={9}
                    onKeyDown={(e) => {
                      e.key === "." && e.preventDefault();
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="attachDate"
                  label={t("planning.Aircraft Builds.Installation Date")}
                  style={{
                    marginBottom: "16px",
                  }}
                  rules={[
                    {
                      required: true,
                      message: t(
                        "planning.Aircraft Builds.Installation Date is required"
                      ),
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
                  name="inRefMessage"
                  label={t("planning.Aircraft Builds.Input Reference Message")}
                  style={{
                    marginBottom: "16px",
                  }}
                  rules={[
                    {
                      required: false,
                      message: t(
                        "planning.Aircraft Builds.Input Reference Message is required"
                      ),
                    },
                  ]}
                >
                  <Input maxLength={255} />
                </Form.Item>
                <Form.Item
                  name="comManufactureDate"
                  label={t("planning.Aircraft Builds.Manufacture Date")}
                  style={{
                    marginBottom: "16px",
                  }}
                  rules={[
                    {
                      required: false,
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
                  name="comCertificateDate"
                  label={t("planning.Aircraft Builds.Certificate Date")}
                  style={{
                    marginBottom: "16px",
                  }}
                  rules={[
                    {
                      required: false,
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
                    name="authNo"
                    label={"Auth No"}
                    style={{
                      marginBottom: "16px",
                    }}
                    rules={[
                      {
                        required: false,
                      },
                    ]}
                >
                  <Input maxLength={255} />
                </Form.Item>
                <Form.Item
                    name="sign"
                    label={"Sign"}
                    style={{
                      marginBottom: "16px",
                    }}
                    rules={[
                      {
                        required: false,
                      },
                    ]}
                >
                  <Input maxLength={255} />
                </Form.Item>
                {/* <Col>
                  <AntdFormItem name="countHrCycle" label="Count Hour, Cycle from :">
                    <Radio.Group
                      style={{
                        fontSize: "16px",
                      }}
                    >
                      <Radio value={1}>TSN, CSN</Radio>
                      <Radio value={2}>TSO, CSO</Radio>
                      <Radio value={3}>TSLSV, CSLSV</Radio>
                    </Radio.Group>
                  </AntdFormItem>
                </Col> */}
              </Col>
            </Row>
            <Row>
              <Col sm={20} md={10}>
                <Form.Item
                  wrapperCol={{
                    ...formLayout.wrapperCol,
                    offset: 8,
                  }}
                >
                  <Space size="small">
                    <ARMButton
                      size="medium"
                      type="primary"
                      htmlType="submit"
                      disabled={status == "false" ? true : false}
                    >
                      {id ? "Update" : "Submit"}
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
        </ARMCard>
        </Permission>
      </CommonLayout>
    </>
  );
};

export default AircraftBuilds;
