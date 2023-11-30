import {Breadcrumb} from "antd";
import {Link} from "react-router-dom";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import {useLocations} from "../../../lib/hooks/planning/useLocations";
import AddLocationForm from "./AddLocationForm";
import { useTranslation } from "react-i18next";
import Permission from "../../auth/Permission";

export default function AddLocations() {
  const { id, onFinish, form, handleReset } = useLocations();
  const { t } = useTranslation()
  const PAGE_TITLE = id ? t('planning.Locations.Location') + ' ' + t('common.Edit') : t('planning.Locations.Location') + ' ' + t('common.Add')

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line"/> &nbsp;{t("planning.Planning")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/planning/locations">{t("planning.Locations.Locations")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? t("common.Edit") : t("common.Add")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission={["PLANNING_AIRCRAFT_AIRCRAFT_LOCATION_SAVE","PLANNING_AIRCRAFT_AIRCRAFT_LOCATION_EDIT"]} showFallback>
        <ARMCard title={getLinkAndTitle(PAGE_TITLE, "/planning/locations", false,"PLANNING_AIRCRAFT_AIRCRAFT_LOCATION_SAVE")}>
          <AddLocationForm id={id} onFinish={onFinish} form={form} handleReset={handleReset}/>
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
}
