import { Breadcrumb, Input, Modal, Select, Space } from 'antd';
import { useEffect } from "react";
import { Link } from 'react-router-dom';
import Permission from "../../auth/Permission";
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import CommonLayout from '../../layout/CommonLayout';
import CountryAddForm from "../base/CountryAddForm";
import SaveCity from "../base/SaveCity";
import { useCity } from "../base/useCity";
import useCountry from "../basePlant/useCountry";
import ManufacturerForm from "./ManufacturerForm";
import useManufacturer from "./useManufacturer";

const {Option} = Select;
const {TextArea} = Input;

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

const ManufacturerAdd = () => {

  const {
    onReset:countryReset,
    form:countryFrom,
  } = useCountry();

  const {
    onReset:cityReset,
    form:cityForm,
  } = useCity();

  const {
    cardTitle,
    onReset,
    onFinish,
    isCityDisabled,
    cities,
    form,
    capability,
    id,
    setCountryModal,
    countryModal,
    handleCountrySubmit,
    setCityModal,
    cityModal,
    handleCitySubmit,
    country,
    dialingCodes,
    getAllCountry,
    countryId,
    handleCountryChange,
    handleFileInput,
    attachmentList,
    loading,

  } = useManufacturer(countryFrom,cityForm)

  console.log({loading});

  useEffect(() => {
    (async () => {
      await getAllCountry()
    })();
  }, []);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/configurations">
              <i className="fas fa-cog"/> &nbsp;Configurations
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
           Manufacturer
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? "edit" : "add"}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

     <Permission permission={["CONFIGURATION_CONFIGURATION_MANUFACTURER_CONFIGURATION_MANUFACTURE_SAVE","CONFIGURATION_CONFIGURATION_MANUFACTURER_CONFIGURATION_MANUFACTURE_EDIT"]} showFallback>
      <Space
        direction="vertical"
        size="medium"
        style={{
          display: "flex",
        }}
      >

      <ARMCard title={cardTitle}>
        <ManufacturerForm
          form={form}
          onFinish={onFinish}
          countries={country}
          isCityDisabled={isCityDisabled}
          cities={cities}
          capability={capability}
          onReset={onReset}
          id={id}
          setCityModal={setCityModal}
          setCountryModal={setCountryModal}
          dialingCodes={dialingCodes}
          handleCountryChange={handleCountryChange}
          handleFileInput={handleFileInput}
          attachmentList={attachmentList}
          loading={loading}
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

export default ManufacturerAdd;
