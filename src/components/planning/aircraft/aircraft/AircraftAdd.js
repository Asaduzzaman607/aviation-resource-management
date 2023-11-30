import CommonLayout from "../../../layout/CommonLayout";
import { Breadcrumb, Modal, Space } from "antd";
import ARMCard from "../../../common/ARMCard";
import { Link } from "react-router-dom";
import { getLinkAndTitle, LinkAndTitle } from "../../../../lib/common/TitleOrLink";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import { useAircrafts } from "../../../../lib/hooks/planning/aircrafts";

import AddAircraftModelFamilyForm from "../../configurations/aircraftModelFamily/AddAircraftModelFamilyForm";
import ARMAircraftAdd from "./ARMAircraftAdd";
import { useTranslation } from "react-i18next";
import useAircraftFamily from "../../../../lib/hooks/planning/useAircraftFamily";
import Permission from "../../../auth/Permission";


const AircraftAdd = ({toggleTab}) => {
  const {
    onNameChange,
    addItem,
    id,
    cardTitle,
    aircraftModelFamilies,
    name,
    onFinish,
    setShowModal,
    showModal,
    handleModelSubmit,
    handleModelReset,
    form,
    onReset,
    isDisable,
    onApplicableApu,
    isApplicableApu
  } = useAircrafts();
  
  const { t } = useTranslation();
  const{formData}=useAircraftFamily();

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning" onClick={() => id ? toggleTab(1) : ''}>
              <i className="fas fa-chart-line" />
              &nbsp; {t("planning.Planning")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/planning/aircraft"  onClick={() => id ? toggleTab(1) : ''}>{t("planning.Aircrafts.Aircrafts")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? t("common.Edit") : t("common.Add")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

        <Space
          direction="vertical"
          size="medium"
          style={{
            display: "flex",
          }}
        >
          <Permission permission={["PLANNING_AIRCRAFT_AIRCRAFT_SAVE","PLANNING_AIRCRAFT_AIRCRAFT_EDIT"]} showFallback>
          <ARMCard title={<LinkAndTitle title={cardTitle} link="/planning/aircraft/" addBtn={false} permission="PLANNING_AIRCRAFT_AIRCRAFT_SAVE" />}>
            <ARMAircraftAdd
              onNameChange={onNameChange}
              addItem={addItem}
              id={id}
              aircraftModelFamilies={aircraftModelFamilies}
              name={name}
              onFinish={onFinish}
              setShowModal={setShowModal}
              form={form}
              onReset={onReset}
              isDisable={isDisable}
              onApplicableApu={onApplicableApu}
              isApplicableApu={isApplicableApu}
            />
          </ARMCard>
          {/* <Modal
            title={t("planning.A/C Type.Add A/C Type")}
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
            <AddAircraftModelFamilyForm onFinish={handleModelSubmit} onReset={handleModelReset}  formData={formData} />
          </Modal> */}
          </Permission>
        </Space>
    </CommonLayout>
  );
};

export default AircraftAdd;
