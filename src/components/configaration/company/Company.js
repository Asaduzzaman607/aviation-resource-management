import {Breadcrumb, Modal, Space,} from "antd";

import CommonLayout from "../../layout/CommonLayout";
import ARMCard from "../../common/ARMCard";
import {Link} from "react-router-dom";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {useTranslation} from "react-i18next";
import useCompany from "./useCompany";
import {UseCurrency} from "../currency/UseCurrency";
import CompanyForm from "./CompanyForm";
import CountryAddForm from "../base/CountryAddForm";
import SaveCity from "../base/SaveCity";
import useCountry from "../basePlant/useCountry";
import {useCity} from "../base/useCity";
import Permission from "../../auth/Permission";

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const Company = () => {
  const {t} = useTranslation();
  const {
    onReset:countryReset,
    form:countryFrom,
  } = useCountry();


  const {
    onReset:cityReset,
    form:cityForm,
  } = useCity();


  const {
    onFinish,
    onReset,
    country,
    setCountry,
    cities,
    setCities,
    countryModal,
    setCountryModal,
    cityModal,
    setCityModal,
    id,
    form,
    handleCountrySubmit,
    handleCitySubmit,
    countryId
  } = useCompany(countryFrom,cityForm)

  const {currency} = UseCurrency()


  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {" "}
            <Link to="/configurations">
              {" "}
              <i className="fas fa-cog ant-menu-item-icon"/>{" "}
              &nbsp;{t("configuration.Configurations")}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {" "}
            <Link to="/configurations/companies"> {t("configuration.Company.Companies")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {" "}
            <Link to={id ? `/configurations/companies/add/${id}` : "/configurations/companies/add"}>
              {id ? t("common.Edit") : t("common.Add")}
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
     <Permission permission={["CONFIGURATION_CONFIGURATION_COMPANY_SAVE","CONFIGURATION_CONFIGURATION_COMPANY_EDIT"]}>
      <Space
        direction="vertical"
        size="middle"
        style={{
          display: "flex",
        }}
      >
        <ARMCard
          title={getLinkAndTitle(id ? t("configuration.Company.Update Company") : t("configuration.Company.Add Company"), "/configurations/companies")}
        >
          <CompanyForm
            onFinish={onFinish}
            onReset={onReset}
            cities={cities}
            countries={country}
            currency={currency}
            setCities={setCities}
            setCountry={setCountry}
            form={form}
            countryModal={countryModal}
            setCountryModal={setCountryModal}
            cityModal={cityModal}
            setCityModal={setCityModal}
            id={id}
          />
        </ARMCard>
        <Modal
          title="Add Country"
          style={{
            top: 20,
            zIndex:9999,
          }}
          onOk={() => setCountryModal(false)}
          onCancel={() => setCountryModal(false)}
          centered
          visible={countryModal}
          width={1080}
          footer={null}
        >

          <CountryAddForm
            onFinish={handleCountrySubmit}
            form={countryFrom}
            onReset={countryReset}
          />
        </Modal>



        <Modal
          title="Add City"
          style={{
            top: 20,
            zIndex:1,
          }}
          onOk={() => setCityModal(false)}
          onCancel={() => setCityModal(false)}
          centered
          visible={cityModal}
          width={1080}
          footer={null}
        >

          <SaveCity
            onFinish={handleCitySubmit}
            setShowModal={setCountryModal}
            countries={country}
            form={cityForm}
            onReset={cityReset}
            countryId={countryId}
          />
        </Modal>
      </Space>
      </Permission>
    </CommonLayout>
  );
};

export default Company;
