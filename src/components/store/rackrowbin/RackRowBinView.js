import {React, useEffect} from 'react';
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Modal, Space} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import CommonLayout from "../../layout/CommonLayout";
import {useRooms} from "../room/Room";
import {useRacks} from "../rack/Racks";
import {useRackRow} from "../rackrow/RackRow";
import {useRackRowBin} from "./RackRowBin";
import SaveRackRowBin from "./SaveRackRowBin";
import AddRoomModal from "../rack/AddRoomModal";
import AddRackModal from "../rackrow/AddRackModal";
import AddRackRowModal from "./AddRackRowModal";
import useCountry from "../../configaration/basePlant/useCountry";
import {useCity} from "../../configaration/base/useCity";
import useLocation from "../../configaration/location/useLocation";
import useOffice from "../technicalStore/UseOffice";
import LocationForm from "../../configaration/location/LocationForm";
import CountryAddForm from "../../configaration/base/CountryAddForm";
import SaveCity from "../../configaration/base/SaveCity";
import OfficeForm from "../technicalStore/OfficeForm";
import Permission from "../../auth/Permission";


const RackRowBinView = () => {
  const layout = {
    labelCol: {
      span: 8,
    }, wrapperCol: {
      span: 16,
    },
  };
  const {
    onReset: countryReset, form: countryForm,
  } = useCountry();


  const {
    onReset: cityReset, form: cityForm,
  } = useCity();


  const {
    onReset: Location_Reset, form: Location_Form
  } = useLocation();

  const {
    onReset: storeReset, form: storeForm,
  } = useOffice();

  const {
    form: roomForm, onReset: roomReset,
  } = useRooms();

  const {
    form: rackForm, onReset: rackReset,
  } = useRacks();


  const {
    form: rackRowForm,
    onReset: rackRowReset,
  } = useRackRow();

  const {
    id,
    onFinish,
    onReset,
    form,
    offices,
    rooms,
    racks,
    handleModelRoomSubmit,
    isRoomDisabled,
    setRoomModal,
    roomModal,
    isRackDisabled,
    handleOfficeSubmit,
    setShowModal,
    showModal,
    rackModal,
    setRackModal,
    handleModelRackSubmit,
    handleModelRackRowSubmit,
    setRackRowModal,
    rackRowModal,
    isRackRowDisabled,
    rackRows,
    setRackRows,
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
    countryVal,
    getAllCity,
    cities,
    setCountryVal,
    rackId,
    roomId,
    officeId,
    getAllCountry,
    countryId,
    getAllOffices,
  getRackRowBinById
  } = useRackRowBin(rackRowForm, rackForm, roomForm, storeForm, Location_Form, countryForm, cityForm);

  useEffect(() => {
    (async () => {
      await getAllCountry()
      await getAllOffices()
      await getRackRowBinById();
    })();
  }, []);


  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {" "}
            <Link to="/store/">
              {" "}
              <i className="fas fa-archive"/> &nbsp;Store
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {" "}
            <Link to="/store/rack-row-bin">
              {" "}
              Rack Row Bins
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {" "}
            {id ? 'Edit' : "Add"}
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission={["STORE_STORE_CONFIGURATION_RACK_ROW_BIN_SAVE","STORE_STORE_CONFIGURATION_RACK_ROW_BIN_EDIT"]} showFallback>
      <Space
        direction="vertical"
        size="medium"
        style={{
          display: "flex",
        }}
      >
        <ARMCard title={getLinkAndTitle(id ? "Update Rack Row bin" : "Add Rack Row bin", "/store/rack-row-bin")}>
          <SaveRackRowBin layout={layout}
                          offices={offices}
                          rooms={rooms}
                          isRoomDisabled={isRoomDisabled}
                          isRackDisabled={isRackDisabled}
                          form={form}
                          racks={racks}
                          onFinish={onFinish}
                          onReset={onReset}
                          setShowModal={setShowModal}
                          setRoomModal={setRoomModal}
                          roomModal={roomModal}
                          setRackModal={setRackModal}
                          rackModal={rackModal}
                          setRackRowModal={setRackRowModal}
                          rackRowModal={rackRowModal}
                          isRackRowDisabled={isRackRowDisabled}
                          rackRows={rackRows}
                          setRackRows={setRackRows}
                          id={id}
          />
        </ARMCard>
        <Modal
          title="Add Store"
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
          title="Add Room"
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
          title="Add Rack"
          style={{
            top: 20,
          }}
          onOk={() => setRackModal(false)}
          onCancel={() => setRackModal(false)}
          centered
          visible={rackModal}
          width={1080}
          footer={null}
        >
          <AddRackModal
            form={rackForm}
            layout={layout}
            onFinish={handleModelRackSubmit}
            offices={offices}
            isRoomDisabled={isRoomDisabled}
            rooms={rooms}
            id={id}
            officeId={officeId}
            roomId={roomId}
            onReset={rackReset}
          />
        </Modal>

        <Modal
          title="Add Rack Row"
          style={{
            top: 20,
          }}
          onOk={() => setRackRowModal(false)}
          onCancel={() => setRackRowModal(false)}
          centered
          visible={rackRowModal}
          width={1080}
          footer={null}
        >
          <AddRackRowModal
            form={rackRowForm}
            layout={layout}
            onFinish={handleModelRackRowSubmit}
            offices={offices}
            isRoomDisabled={isRoomDisabled}
            isRackDisabled={isRackDisabled}
            rooms={rooms}
            id={id}
            racks={racks}
            officeId={officeId}
            roomId={roomId}
            rackId={rackId}

          />
        </Modal>
        <Modal
          title="Add Location"
          style={{
            top: 20, zIndex: 9999,
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
            top: 20, zIndex: 9999,
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
            top: 20, zIndex: 1,
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

export default RackRowBinView;