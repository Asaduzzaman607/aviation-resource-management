import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import { usePositions } from "../../../lib/hooks/planning/usePositions";
import AddPositionForm from "./AddPositionForm";
import { useTranslation } from "react-i18next";
import Permission from "../../auth/Permission";

export default function AddPositions() {
  const { id, onFinish, form, handleReset } = usePositions();
  const { t } = useTranslation()
  const PAGE_TITLE = id ? `${t('planning.Positions.Position')} ${t('common.Edit')}` : `${t('planning.Positions.Position')} ${t('common.Add')}`
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
            <Link to="/planning/positions">{t("planning.Positions.Positions")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? t("common.Edit") : t("common.Add")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission={["PLANNING_AIRCRAFT_POSITION_SAVE","PLANNING_AIRCRAFT_POSITION_EDIT"]} showFallback>
        <ARMCard title={getLinkAndTitle(PAGE_TITLE, "/planning/positions", false,"PLANNING_AIRCRAFT_POSITION_SAVE")}>
          <AddPositionForm id={id} onFinish={onFinish} form={form} handleReset={handleReset} />
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
}
