import { Breadcrumb, Modal, Space } from 'antd';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import CommonLayout from '../../layout/CommonLayout';
import CountryAddForm from '../../configaration/base/CountryAddForm';
import SaveCity from '../../configaration/base/SaveCity';
import { useCity } from '../../configaration/base/useCity';
import useCountry from '../../configaration/basePlant/useCountry';
import LocationForm from '../../configaration/location/LocationForm';
import useLocation from '../../configaration/location/useLocation';
import OfficeForm from './OfficeForm';
import useOffice from './UseOffice';
import React from "react";

const OfficeAdd = () => {
  const {
    onReset:countryReset,
    form:countryForm,
  } = useCountry();


  const {
    onReset:cityReset,
    form:cityForm,
  } = useCity();


  const {
    onReset:officeReset,
    form:officeForm,
  } = useLocation();

  const {id,
    form,
    onFinish,
    onReset,
    selectedLocation,
    setSelectedLocation,
    setLocationModal,
    locationModal,
    handleLocationSubmit,
    setCountryModal,
    countryModal,
    handleCountrySubmit,
    setCityModal,
    cityModal,
    handleCitySubmit,
    country,
    cities,
    getAllCountry,
    countryId,
    getStoreById
  }=useOffice(officeForm,countryForm,cityForm)

  useEffect(() => {
    (async () => {
      await getAllCountry();

    })();
  }, []);

  useEffect(() => {
    if(!id){
      return
    }
    (async () => {
      await getStoreById(id);
    })();

  }, [id]);






  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {' '}
            <Link to="/configurations">
              {' '}
              <i className="fas fa-cog" /> &nbsp;Store
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/store/technical-store">Technical Stores</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? 'edit' : 'add'}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>


      <Space
        direction="vertical"
        size="medium"
        style={{
          display: "flex",
        }}
      >
     <Permission permission={['STORE_STORE_CONFIGURATION_TECHNICAL_STORE_SAVE','STORE_STORE_CONFIGURATION_TECHNICAL_STORE_EDIT']} showFallback>
       <ARMCard title={getLinkAndTitle(id?' Update Technical Store':' Add Technical Store', '/store/technical-store')}>
         <OfficeForm
             form={form}
             id={id}
             onFinish={onFinish}
             onReset={onReset}
             selectedLocation={selectedLocation}
             setSelectedLocation={setSelectedLocation}
             setLocationModal={setLocationModal}
             setCountryModal={setCountryModal}
             countryModal={countryModal}
             handleCountrySubmit={handleCountrySubmit}
             setCityModal={setCityModal}
             cityModal={cityModal}
             handleCitySubmit={handleCitySubmit}
             country={country}
             cities={cities}
         />
       </ARMCard>
     </Permission>

        <Modal
          title="Add Location"
          style={{
            top: 20,
            zIndex:9999,
          }}
          onOk={() => setLocationModal(false)}
          onCancel={() => setLocationModal(false)}
          centered
          visible={locationModal}
          width={1080}
          footer={null}
        >

          <LocationForm
            onFinish={handleLocationSubmit}
            form={officeForm}
            onReset={officeReset}
            setCountryModal={setCountryModal}
            countryModal={countryModal}
            handleCountrySubmit={handleCountrySubmit}
            setCityModal={setCityModal}
            cityModal={cityModal}
            handleCitySubmit={handleCitySubmit}
            countries={country}
            cities={cities}
          />
        </Modal>

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
            form={countryForm}
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
    </CommonLayout>
  );
};

export default OfficeAdd;