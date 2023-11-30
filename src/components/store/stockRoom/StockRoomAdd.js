import {Breadcrumb, Modal} from 'antd';
import React from 'react';
import {Link} from 'react-router-dom';
import {getLinkAndTitle} from '../../../lib/common/TitleOrLink';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import CommonLayout from '../../layout/CommonLayout';
import {useStockRoom} from '../hooks/stockRoom';
import StockRoomForm from "./StockRoomForm";
import OfficeForm from "../technicalStore/OfficeForm";
import LocationForm from "../../configaration/location/LocationForm";
import CountryAddForm from "../../configaration/base/CountryAddForm";
import SaveCity from "../../configaration/base/SaveCity";
import useCountry from "../../configaration/basePlant/useCountry";
import {useCity} from "../../configaration/base/useCity";
import useLocation from "../../configaration/location/useLocation";
import useOffice from "../technicalStore/UseOffice";
import {useTranslation} from "react-i18next";
import Permission from "../../auth/Permission";

function StockRoomAdd() {
  const {t} = useTranslation();
  const {
    onReset: countryReset,
    form: countryForm,
  } = useCountry();


  const {
    onReset: cityReset,
    form: cityForm,
  } = useCity();


  const {
    onReset: Location_Reset,
    form: Location_Form
  } = useLocation();

  const {
    onReset: storeRest,
    form: storeForm,
  } = useOffice();


  const {
    id, form, onFinish, onReset, showModal, setShowModal, selectedLocation,
    setLocationModal,
    locationModal,
    handleLocationSubmit,
    setSelectedLocation,
    setCountryModal,
    countryModal,
    handleCountrySubmit,
    setCityModal,
    cityModal,
    handleCitySubmit,
    country,
    Val,
    getAllCity,
    cities,
    setVal,
    offices,
    setOffices,
    handleModelSubmit
  } = useStockRoom(storeForm, Location_Form, countryForm, cityForm);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {' '}
            <Link to="/store">
              {' '}
              <i className="fas fa-archive"/> &nbsp;Store
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/store/stock-room">Stock Rooms</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? 'edit' : 'add'}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
     <Permission permission={["STORE_STORE_CONFIGURATION_STOCK_ROOM_SAVE","STORE_STORE_CONFIGURATION_STOCK_ROOM_EDIT"]} showFallback>
      <ARMCard title={getLinkAndTitle(`${id ? 'update' : 'add'} Stock Room`, '/store/stock-room/')}>
        <StockRoomForm
          id={id}
          form={form}
          offices={offices}
          onFinish={onFinish}
          onReset={onReset}
          setShowModal={setShowModal}
          setOffices={setOffices}
        />
      </ARMCard>

      <Modal
        title={t("store.OfficeModal.Add Store")}
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

        <OfficeForm
          onFinish={handleModelSubmit}
          onReset={storeRest}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          setLocationModal={setLocationModal}
          form={storeForm}
        />
      </Modal>
      <Modal
        title="Add Location"
        style={{
          top: 20,
          zIndex: 9999,
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
          form={Location_Form}
          onReset={Location_Reset}
          setCountryModal={setCountryModal}
          countryModal={countryModal}
          handleCountrySubmit={handleCountrySubmit}
          setCityModal={setCityModal}
          cityModal={cityModal}
          handleCitySubmit={handleCitySubmit}
          countries={country}
          Val={Val}
          getAllCity={getAllCity}
          cities={cities}
          setVal={setVal}
        />
      </Modal>
      <Modal
        title="Add Country"
        style={{
          top: 20,
          zIndex: 9999,
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
          zIndex: 1,
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
          Val={Val}
        />
      </Modal>
     </Permission>
    </CommonLayout>
  );
}

export default StockRoomAdd;
