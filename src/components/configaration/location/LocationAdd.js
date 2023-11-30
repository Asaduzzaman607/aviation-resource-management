import CommonLayout from '../../layout/CommonLayout';
import {
  Breadcrumb, Modal, Space,
} from 'antd';
import ARMCard from '../../common/ARMCard';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import LocationForm from "./LocationForm";
import useLocation from "./useLocation";
import CountryAddForm from "../base/CountryAddForm";
import useCountry from "../basePlant/useCountry";
import SaveCity from "../base/SaveCity";
import {useCity} from "../base/useCity";
import Permission from "../../auth/Permission";
const LocationAdd = () => {
  const {
    onReset:countryReset,
    form:countryFrom,
  } = useCountry();


  const {
    onReset:cityReset,
    form:cityForm,
  } = useCity();

  const {
    id,
    onFinish,
    onReset,
    cities,
    selectedCountry,
    selectCountry,
    form,
    handleCountrySubmit,
    countryModal,
    setCountryModal,
    country,
    setCityModal,
    cityModal,
    handleCitySubmit,
    getAllCity,
    setVal,
    Val,
    getLocationById,
    location,
    getCountryId,
    getAllCountry
  } = useLocation(countryFrom,cityForm);




  useEffect(() => {
    id && getLocationById(id);
    location.cityId && getCountryId(location.cityId);
  }, [id, location.cityId]);

  useEffect(() => {
    (async () => {
      await getAllCountry();
    })();
  }, []);


  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {' '}
            <Link to="/configurations">
              {' '}
              <i className="fas fa-cog" /> &nbsp; Configurations
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/configurations/location">Locations</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? 'edit' : 'add'}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission={["CONFIGURATION_CONFIGURATION_LOCATION_SAVE","CONFIGURATION_CONFIGURATION_LOCATION_EDIT"]}>
      <Space
        direction="vertical"
        size="medium"
        style={{
          display: "flex",
        }}
      >
      <ARMCard title={getLinkAndTitle('Location', '/configurations/location/')}>
       <LocationForm
         selectedCountry={selectedCountry}
         selectCountry={selectCountry}
         onFinish={onFinish}
         onReset={onReset}
         countries={country}
         cities={cities}
         id={id}
         form={form}
         setCountryModal={setCountryModal}
         countryModal={countryModal}
         setCityModal={setCityModal}
         cityModal={cityModal}
         getAllCity={getAllCity}
         setVal={setVal}

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
            countryId={Val}

          />
        </Modal>
      </Space>
      </Permission>
    </CommonLayout>
  );
};

export default LocationAdd;
