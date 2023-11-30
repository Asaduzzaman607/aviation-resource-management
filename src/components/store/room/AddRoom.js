import React, {useEffect} from 'react';
import {useRooms} from "./Room";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Modal, Space} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import CommonLayout from "../../layout/CommonLayout";
import SaveRoom from "./SaveRoom";
import {useTranslation} from "react-i18next";
import Permission from "../../auth/Permission";
import OfficeForm from "../technicalStore/OfficeForm";
import LocationForm from "../../configaration/location/LocationForm";
import CountryAddForm from "../../configaration/base/CountryAddForm";
import SaveCity from "../../configaration/base/SaveCity";
import useCountry from "../../configaration/basePlant/useCountry";
import {useCity} from "../../configaration/base/useCity";
import useLocation from "../../configaration/location/useLocation";
import useOffice from "../technicalStore/UseOffice";


const AddRoom = () => {
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
    onNameChange,
    addItem,
    id,
    cardTitle,
    name,
    onFinish,
    setShowModal,
    showModal,
    handleModelSubmit,
    handleModelReset,
    offices,
    form,
    onReset,
    store,
    setStore,
    debounceVal,
    selectedLocation,
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
    getAllCity,
    cities,
    getAllOffices,
    getAllCountry,
    countryId,
    getRoomById
  } = useRooms(storeForm, Location_Form, countryForm, cityForm);

  useEffect(() => {
    (async () => {
      await getAllCountry()
      await getAllOffices()
    })();
  }, []);

  useEffect(() => {
    if (id) {
      (async () => {
        await getRoomById(id);
      })();
    }
  }, [id])



  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {" "}
            <Link to="/store/">
              {" "}
              <i className="fas fa-archive"/> &nbsp;{t("store.Store")}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {" "}
            <Link to="/store/room">
              {" "}
              {t("store.Rooms.Rooms")}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {" "}
            {id ? t("common.Edit") : t("common.Add")}
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
    <Permission permission={["STORE_STORE_CONFIGURATION_ROOM_SAVE","STORE_STORE_CONFIGURATION_ROOM_EDIT"]}>
      <Space
        direction="vertical"
        size="medium"
        style={{
          display: "flex",
        }}
      >
        <ARMCard title={getLinkAndTitle(cardTitle, "/store/room/")}>
          <SaveRoom
            onNameChange={onNameChange}
            addItem={addItem}
            id={id}
            offices={offices}
            name={name}
            onFinish={onFinish}
            setShowModal={setShowModal}
            form={form}
            onReset={onReset}
            store={store}
            setStore={setStore}
            debounceVal={debounceVal}
            selectedLocation={selectedLocation}
            setLocationModal={setLocationModal}
            locationModal={locationModal}
            handleLocationSubmit={handleLocationSubmit}
            setSelectedLocation={setSelectedLocation}
            setCountryModal={setCountryModal}
            countryModal={countryModal}
            handleCountrySubmit={handleCountrySubmit}
            setCityModal={setCityModal}
            cityModal={cityModal}
            handleCitySubmit={handleCitySubmit}
            country={country}
            getAllCity={getAllCity}
            cities={cities}

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
            getAllCity={getAllCity}
            cities={cities}
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
            countryId={countryId}
          />
        </Modal>
      </Space>
   </Permission>
    </CommonLayout>
  );
};

export default AddRoom;