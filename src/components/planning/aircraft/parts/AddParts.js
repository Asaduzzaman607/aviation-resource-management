import React from "react";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import { Breadcrumb, Modal } from "antd";
import { Link } from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import { getLinkAndTitle } from "../../../../lib/common/TitleOrLink";

import AddPartsForm from "./AddPartsForm";
import AddModelForm from "../../models/AddModelForm";
import { useParts } from "../../../../lib/hooks/planning/useParts";
import { useModels } from "../../../../lib/hooks/planning/useModels";
import AddAircraftModelFamilyForm from "../../configurations/aircraftModelFamily/AddAircraftModelFamilyForm";
import { useTranslation } from "react-i18next";
import Permission from "../../../auth/Permission";

const AddParts = () => {
  const {
    onFinish,
    onReset,
    partId,
    showModal,
    setShowModal,
    setSelectedAlternatePart,
    classifications,
    form,
    TITLE,
    selectedAlternatePart,
    handleModelSubmit,
    models,
    model,
    aircraftModelFamilies,
    getAircraftModelId,
    handleAircraftModelSubmit,
    handleAircraftModelReset,
    disable,
    acTypeDisable,
    lifeLimitUnit,
    handleClassificationChange,
    consumModel,
    aircraftModelId

  } = useParts();
  const { onReset: handleModelReset, modelType, aircraft, lifeCode, form: modelForm } = useModels();
  const { t } = useTranslation()
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {" "}
            <Link to="/planning">
              {" "}
              <i className="fas fa-chart-line" />
              &nbsp; {t("planning.Planning")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/planning/parts">{t("planning.Parts.Parts")}</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{TITLE}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission={["PLANNING_AIRCRAFT_PARTS_SAVE","PLANNING_AIRCRAFT_PARTS_EDIT"]} showFallback>
        <ARMCard title={getLinkAndTitle(!partId ? `${t("planning.Parts.Part")} ${t("common.Add")}` : `${t("planning.Parts.Part")} ${t("common.Edit")}`, "/planning/parts",false,"PLANNING_AIRCRAFT_PARTS_SAVE")}>
          <AddPartsForm
            onFinish={onFinish}
            onReset={onReset}
            form={form}
            setShowModal={setShowModal}
            getAircraftModelId={getAircraftModelId}
            model={model}
            aircraftModelFamilies={aircraftModelFamilies}
            classifications={classifications}
            selectedAlternatePart={selectedAlternatePart}
            partId={partId}
            setSelectedAlternatePart={setSelectedAlternatePart}
            disable={disable}
            acTypeDisable={acTypeDisable}
            lifeLimitUnit={lifeLimitUnit}
            handleClassificationChange={handleClassificationChange}
            consumModel={consumModel}
            aircraftModelId={aircraftModelId}
          />
        </ARMCard>

        <Modal
          title={t("planning.Models.Add Model")}
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
            onFinish={handleModelSubmit}
            onReset={handleModelReset}
            modelType={modelType}
            aircraft={aircraft}
            lifeCode={lifeCode}
            form={modelForm}
          />
        </Modal>
      </Permission>
    </CommonLayout>
  );
};

export default AddParts;
