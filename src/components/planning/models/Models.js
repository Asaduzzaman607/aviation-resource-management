import { Breadcrumb, Modal } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";
import AddModelForm from "./AddModelForm";
import { useModels } from "../../../lib/hooks/planning/useModels";
import AddAircraftModelFamilyForm from "../configurations/aircraftModelFamily/AddAircraftModelFamilyForm";
import { useTranslation } from "react-i18next";
import Permission from "../../auth/Permission";

const Models = () => {
  const {
    onFinish,
    onReset,
    id,
    modelType,
    aircraft,
    lifeCode,
    form,
    setShowModal,
    showModal,
    handleModelSubmit,
    handleModelReset,
  } = useModels();

  const { t } = useTranslation()

  const title = id ? `${t("planning.Models.Models")} ${t("common.Edit")}` : `${t("planning.Models.Models")} ${t("common.Add")}`;

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line" />
              &nbsp; {t("planning.Planning")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/planning/models">{t("planning.Models.Models")}</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{id ? t("common.Edit") : t("common.Add")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission={["PLANNING_AIRCRAFT_MODEL_SAVE","PLANNING_AIRCRAFT_MODEL_EDIT"]} showFallback>
        <ARMCard title={getLinkAndTitle(title, "/planning/models",false,"PLANNING_AIRCRAFT_MODEL_SAVE")}>
          <AddModelForm
            onFinish={onFinish}
            onReset={onReset}
            aircraft={aircraft}
            form={form}
            modelType={modelType}
            setShowModal={setShowModal}
            lifeCode={lifeCode}
            id={id}
          />
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default Models;
