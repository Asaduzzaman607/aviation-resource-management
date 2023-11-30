import CommonLayout from "../../../layout/CommonLayout";
import { Breadcrumb, Col, Form, Input, notification, Row, Space } from "antd";
import ARMButton from "../../../common/buttons/ARMButton";
import ARMCard from "../../../common/ARMCard";
import { getLinkAndTitle } from "../../../../lib/common/TitleOrLink";
import AircraftModelFamilyService from "../../../../service/AircraftModelFamilyService";
import { getErrorMessage } from "../../../../lib/common/helpers";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ARMForm from "../../../../lib/common/ARMForm";
import AddAircraftModelFamilyForm from "./AddAircraftModelFamilyForm";
import useAircraftFamily from "../../../../lib/hooks/planning/useAircraftFamily";
import { useTranslation } from "react-i18next";
import Permission from "../../../auth/Permission";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const AircraftModelFamilyAdd = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { onFinish, onReset, amId, aircraftModelName, acheckTime, timeUnit, description, formData } = useAircraftFamily();
  const { t } = useTranslation()
  const title = amId ? `${t("planning.A/C Type.A/C Type")} ${t("common.Edit")}` : `${t("planning.A/C Type.A/C Type")} ${t("common.Add")}`;
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
            <Link to="/planning/aircraft-model-family">{t("planning.A/C Type.A/C Type")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{params.amId ? t("common.Edit") : t("common.Add")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
    <Permission permission={["PLANNING_CONFIGURATIONS_AC_TYPE_SAVE","PLANNING_CONFIGURATIONS_AC_TYPE_EDIT"]} showFallback>
      <ARMCard title={getLinkAndTitle(title, "/planning/aircraft-model-family/",false,"PLANNING_CONFIGURATIONS_AC_TYPE_SAVE")}>
        <AddAircraftModelFamilyForm
          onFinish={onFinish}
          onReset={onReset}
          formData={formData}
          aircraftModelName={aircraftModelName}
          acheckTime={acheckTime}
          timeUnit={timeUnit}
          description={description}
          id={amId}
        />
      </ARMCard>
    </Permission>
    </CommonLayout>
  );
};

export default AircraftModelFamilyAdd;
