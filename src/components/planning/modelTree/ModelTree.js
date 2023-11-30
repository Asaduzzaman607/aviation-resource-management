import { Breadcrumb, Button, Col, Form, Modal, Row, Select, Space } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import { useModelTree } from "../../../lib/hooks/planning/useModelTree";
import AddLocationForm from "../configurations/AddLocationForm";
import { useLocations } from "../../../lib/hooks/planning/useLocations";
import { usePositions } from "../../../lib/hooks/planning/usePositions";
import AddPositionForm from "../configurations/AddPositionForm";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import AddModelForm from "../models/AddModelForm";
import { useModels } from "../../../lib/hooks/planning/useModels";
import { formLayout } from "../../../lib/constants/layout";
import { Option } from "antd/lib/mentions";
import { useTranslation } from "react-i18next";
import Permission from "../../auth/Permission";

const ModelTree = () => {
  const { handleReset: handleLocationReset, form: locationForm } =
    useLocations();
  const { handleReset: handlePositionReset, form: positionForm } =
    usePositions();
  const {
    onReset: handleModelReset,
    modelType,
    aircraft,
    lifeCode,
    form: modelForm,
  } = useModels();

  const { t } = useTranslation();

  const {
    onFinish,
    onReset,
    MtId,
    form,
    position,
    location,
    models,
    higherModels,
    showPositionModal,
    setShowPositionModal,
    showLocationModal,
    setShowLocationModal,
    handleLocationSubmit,
    handlePositionSubmit,
    handleModelAtModelTree,
    showModal,
    setShowModal,
    getModelField,
    MODEL,
    HIGHER_MODEL,
    modelField,
    aircraftModelFamilies,
    getAircraftModelId,
    isDisble,
  } = useModelTree(modelForm, positionForm, locationForm);

  return (
    <CommonLayout>
      <Modal
        title={
          modelField === "modelId"
            ? t("planning.Models.Add Model")
            : t("planning.Model Trees.Add Higher Model")
        }
        style={{
          top: 20,
        }}
        onOk={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
        centered
        visible={showModal}
        width={1080}
        footer={null}
      >
        <AddModelForm
          onFinish={handleModelAtModelTree}
          onReset={handleModelReset}
          modelType={modelType}
          aircraft={aircraft}
          lifeCode={lifeCode}
          form={modelForm}
        />
      </Modal>

      <Modal
        title={t("planning.Locations.Add Location")}
        style={{
          top: 20,
        }}
        onOk={() => setShowLocationModal(false)}
        onCancel={() => setShowLocationModal(false)}
        centered
        visible={showLocationModal}
        width={1080}
        footer={null}
      >
        <AddLocationForm
          onFinish={handleLocationSubmit}
          handleReset={handleLocationReset}
          form={locationForm}
        />
      </Modal>
      <Modal
        title={t("planning.Positions.Add Position")}
        style={{
          top: 20,
        }}
        onOk={() => setShowPositionModal(false)}
        onCancel={() => setShowPositionModal(false)}
        centered
        visible={showPositionModal}
        width={1080}
        footer={null}
      >
        <AddPositionForm
          onFinish={handlePositionSubmit}
          handleReset={handlePositionReset}
          form={positionForm}
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
            <Link to="/planning/model-trees">
              {t("planning.Model Trees.Model Trees")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            {MtId ? t("common.Edit") : t("common.Add")}
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission={["PLANNING_AIRCRAFT_MODEL_TREES_SAVE","PLANNING_AIRCRAFT_MODEL_TREES_EDIT"]}>
      <ARMCard
        title={getLinkAndTitle(!MtId ? `${t("planning.Model Trees.Model Tree")} ${t("common.Add")}` : `${t("planning.Model Trees.Model Tree")} ${t("common.Edit")}`,
          "/planning/model-trees",false,"PLANNING_AIRCRAFT_MODEL_TREES_SAVE"
        )}
      >
        <Form
          {...formLayout}
          form={form}
          name="modelTree"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Row>
            <Col sm={20} md={10}>
              <Form.Item
                name="aircraftModelId"
                label={t("planning.Aircrafts.A/C Type")}
                style={{ marginBottom: "12px" }}
              >
                <Select
                  disabled={isDisble}
                  placeholder={t("planning.A/C Type.Select A/C Type")}
                  onChange={(e) => getAircraftModelId(e)}
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
                label={t("planning.Models.Model")}
                style={{ marginBottom: "12px" }}
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
                  placeholder={t("planning.Models.Select a Model")}
                  dropdownRender={(menu) => (
                    <>
                    <Permission permission="PLANNING_AIRCRAFT_MODEL_SAVE">
                      <Button
                        style={{ width: "100%" }}
                        type="primary"
                        onClick={getModelField(MODEL)}
                      >
                        + {t("planning.Models.Add Model")}
                      </Button>
                    </Permission>
                      {menu}
                    </>
                  )}
                >
                  {models?.map((item) => {
                    return (
                      <Select.Option key={item.modelId} value={item.modelId}>
                        {item.modelName}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name="higherModelId"
                label={t("planning.Model Trees.Higher Model")}
                style={{ marginBottom: "12px" }}
                rules={[
                  {
                    required: true,
                    message: t(
                      "planning.Model Trees.Please select Higher Model"
                    ),
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
                  placeholder={t("planning.Model Trees.Select Higher Model")}
                  dropdownRender={(menu) => (
                    <>
                    <Permission permission="PLANNING_AIRCRAFT_MODEL_SAVE">
                      <Button
                        style={{ width: "100%" }}
                        type="primary"
                        onClick={getModelField(HIGHER_MODEL)}
                      >
                        + {t("planning.Model Trees.Add Higher Model")}
                      </Button>
                    </Permission>
                      {menu}
                    </>
                  )}
                >
                  {higherModels?.map((item) => {
                    return (
                      <Select.Option key={item.modelId} value={item.modelId}>
                        {item.modelName}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name="locationId"
                label={t("planning.Locations.Location")}
                style={{ marginBottom: "12px" }}
                rules={[
                  {
                    required: true,
                    message: t("planning.Locations.Please select Location"),
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
                  placeholder={t("planning.Locations.Select a Location")}
                  dropdownRender={(menu) => (
                    <>
                    <Permission permission="PLANNING_AIRCRAFT_AIRCRAFT_LOCATION_SAVE">
                      <Button
                        style={{ width: "100%" }}
                        type="primary"
                        onClick={() => setShowLocationModal(true)}
                      >
                        + Add Location
                      </Button>
                    </Permission>
                      {menu}
                    </>
                  )}
                >
                  {location?.map((loc) => {
                    return (
                      <Select.Option key={loc.id} value={loc.id}>
                        {loc.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name="positionId"
                label="Position"
                style={{ marginBottom: "12px" }}
                rules={[
                  {
                    required: true,
                    message: "Please select position",
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
                  placeholder={t("planning.Positions.Select a Position")}
                  dropdownRender={(menu) => (
                    <>
                    <Permission permission="PLANNING_AIRCRAFT_POSITION_SAVE">
                      <Button
                        style={{ width: "100%" }}
                        type="primary"
                        onClick={() => setShowPositionModal(true)}
                      >
                        + {t("planning.Positions.Add Position")}
                      </Button>
                    </Permission>
                      {menu}
                    </>
                  )}
                >
                  {position?.map((item) => {
                    return (
                      <Select.Option
                        key={item.positionId}
                        value={item.positionId}
                      >
                        {item.name}
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
              <Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}>
                <Space size="small">
                  <ARMButton size="medium" type="primary" htmlType="submit">
                    {MtId ? t("common.Update") : t("common.Submit")}
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
  );
};

export default ModelTree;
