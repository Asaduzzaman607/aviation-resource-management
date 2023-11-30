import {Breadcrumb} from "antd";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import AddSerialNoForm from "./AddSerialNoForm";
import {useSerialNo} from "../../../../lib/hooks/planning/useSerialNo";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ARMCard from "../../../common/ARMCard";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import Permission from "../../../auth/Permission";

export default function AddSerialNo() {
  const {id, onFinish, form, handleReset, onSearch, parts,getPartoOject, getHigherPartObject,type,aircraftModelFamilies,setAircraftId,higherModel,setModelId,higherPart,disable,consumParts,consumModel} = useSerialNo();
  const {t} = useTranslation()
  const PAGE_TITLE = id ? `Serial  ${t('common.Update')}` : `Serial  ${t('common.Add')}`
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
            <Link to="/planning/serials">Serial</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? t("common.Edit") : t("common.Add")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission={["PLANNING_AIRCRAFT_SERIAL_SAVE","PLANNING_AIRCRAFT_SERIAL_EDIT"]} showFallback>
      <ARMCard title={getLinkAndTitle(PAGE_TITLE, "/planning/serials", false, "PLANNING_AIRCRAFT_SERIAL_SAVE")}>
        <AddSerialNoForm id={id}
                         onFinish={onFinish}
                         form={form}
                         handleReset={handleReset}
                         onSearch={onSearch}
                         parts={parts}
                         getPartoOject={getPartoOject}
                         getHigherPartObject={getHigherPartObject}
                         aircraftModelFamilies={aircraftModelFamilies}
                         setAircraftId={setAircraftId}
                         higherModel={higherModel}
                         setModelId={setModelId}
                         higherPart={higherPart}
                         type={type}
                         disable={disable}
                         consumParts={consumParts}
                         consumModel={consumModel}
        />
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
}
