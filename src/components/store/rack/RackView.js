import {Breadcrumb, Modal, Space,} from "antd";
import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";
import SaveRack from "./SaveRack";
import {useRooms} from "../room/Room";
import {useRacks} from "./Racks";
import AddRoomModal from "./AddRoomModal";
import {useTranslation} from "react-i18next";
import Permission from "../../auth/Permission";
import OfficeForm from "../technicalStore/OfficeForm";
import useCountry from "../../configaration/basePlant/useCountry";
import {useCity} from "../../configaration/base/useCity";
import useLocation from "../../configaration/location/useLocation";
import LocationForm from "../../configaration/location/LocationForm";
import CountryAddForm from "../../configaration/base/CountryAddForm";
import SaveCity from "../../configaration/base/SaveCity";
import useOffice from "../technicalStore/UseOffice";

const RackView = () => {

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
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
    onReset:storeReset,
    form: storeForm,
  } = useOffice();

  const {
    form: roomForm,
    onReset: roomReset,
  } = useRooms();
  const {
    onNameChange,
    addItem,
    id,
    name,
    onFinish,
    rooms,
    handleModelRoomSubmit,
    handleOfficeSubmit,
    onReset,
    form,
    setShowModal,
    showModal,
    offices,
    isRoomDisabled,
    setIsRoomDisabled,
    setRoomModal,
    roomModal,
    store,
    setStore,
    setRooms,
    getAllRoom,
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
    getAllCountry,
    getAllOffices,
    officeId,
    getRackById
  } = useRacks(roomForm,storeForm,Location_Form,countryForm,cityForm);

  useEffect(() => {
    (async () => {
      await getAllCountry()
      await getAllOffices()
    })();
  }, []);

  useEffect(() => {
    if(id){
      (async () => {
        await getRackById(id);
      })();
    }
  }, [id])

  const { t } = useTranslation();

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
            <Link to="/store/rack">
              {" "}
              {t("store.Racks.Racks")}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {" "}
            {id ? t("common.Edit") : t("common.Add")}
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
    <Permission permission={["STORE_STORE_CONFIGURATION_RACK_SAVE","STORE_STORE_CONFIGURATION_RACK_EDIT"]} showFallback>
      <Space
        direction="vertical"
        size="medium"
        style={{
          display: "flex",
        }}
      >
        <ARMCard title={getLinkAndTitle(id ? t("store.Racks.Update Rack") : t("store.Racks.Add Rack"), "/store/rack")}>
          <SaveRack
            onNameChange={onNameChange}
            addItem={addItem}
            id={id}
            offices={offices}
            name={name}
            onFinish={onFinish}
            setShowModal={setShowModal}
            setRoomModal={setRoomModal}
            form={form}
            rooms={rooms}
            setRooms={setRooms}
            layout={layout}
            setIsRoomDisabled={setIsRoomDisabled}
            isRoomDisabled={isRoomDisabled}
            onReset={onReset}
            store={store}
            setStore={setStore}
            getAllRoom={getAllRoom}
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
            onFinish={handleOfficeSubmit}
            onReset={storeReset}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            setLocationModal={setLocationModal}
            form={storeForm}

          />
        </Modal>
        <Modal
          title={t("store.Rooms.Add Room")}
          style={{
            top: 20,
          }}
          onOk={() => setRoomModal(false)}
          onCancel={() => setRoomModal(false)}
          centered
          visible={roomModal}
          width={1080}
          footer={null}
        >
          <AddRoomModal
            onFinish={handleModelRoomSubmit}
            onReset={roomReset}
            offices={offices}
            form={roomForm}
            officeId={officeId}
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
          />
        </Modal>
      </Space>
    </Permission>
    </CommonLayout>
  );
};

export default RackView;
