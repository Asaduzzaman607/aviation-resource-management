import { React, useEffect } from "react";
import { Breadcrumb, Modal, Space } from "antd";
import { Link } from "react-router-dom";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import CommonLayout from "../../layout/CommonLayout";
import SaveRackRow from "./SaveRackRow";
import { useRooms } from "../room/Room";
import { useRacks } from "../rack/Racks";
import { useRackRow } from "./RackRow";
import AddRoomModal from "../rack/AddRoomModal";
import AddRackModal from "./AddRackModal";
import { useTranslation } from "react-i18next";
import Permission from "../../auth/Permission";
import useCountry from "../../configaration/basePlant/useCountry";
import { useCity } from "../../configaration/base/useCity";
import useLocation from "../../configaration/location/useLocation";
import useOffice from "../technicalStore/UseOffice";
import OfficeForm from "../technicalStore/OfficeForm";
import LocationForm from "../../configaration/location/LocationForm";
import CountryAddForm from "../../configaration/base/CountryAddForm";
import SaveCity from "../../configaration/base/SaveCity";

const RackRowView = () => {
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const { onReset: countryReset, form: countryForm } = useCountry();

  const { onReset: cityReset, form: cityForm } = useCity();

  const { onReset: Location_Reset, form: Location_Form } = useLocation();

  const { onReset: storeReset, form: storeForm } = useOffice();

  const { form: roomForm, onReset: roomReset } = useRooms();

  const { form: rackForm, onReset: rackReset } = useRacks();

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
    setIsRoomDisabled,
    setRoomModal,
    roomModal,
    isRackDisabled,
    handleOfficeSubmit,
    setShowModal,
    showModal,
    rackModal,
    setRackModal,
    handleModelRackSubmit,
    getAllRacks,
    getAllRoom,
    setRooms,
    setRacks,
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
    getAllOffices,
    getAllCountry,
    officeId,
    roomId,
    rackId,
    countryId,
    getRackRowById,
  } = useRackRow(
    rackForm,
    roomForm,
    storeForm,
    Location_Form,
    countryForm,
    cityForm
  );
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      await getAllCountry();
      await getAllOffices();
      id && getRackRowById(id);
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
              <i className="fas fa-archive" /> &nbsp;{t("store.Rack Row.Store")}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {" "}
            <Link to="/store/rack-row"> {t("store.Rack Row.Rack Rows")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {" "}
            {id ? t("common.Edit") : t("common.Add")}
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission={[
          "STORE_STORE_CONFIGURATION_RACK_ROW_SAVE",
          "STORE_STORE_CONFIGURATION_RACK_ROW_EDIT",
        ]}
        showFallback
      >
        <Space
          direction="vertical"
          size="medium"
          style={{
            display: "flex",
          }}
        >
          <ARMCard
            title={getLinkAndTitle(
              id
                ? t("store.Rack Row.Update Rack Row")
                : t("store.Rack Row.Add Rack Row"),
              "/store/rack-row"
            )}
          >
            <SaveRackRow
              layout={layout}
              offices={offices}
              rooms={rooms}
              setIsRoomDisabled={setIsRoomDisabled}
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
              getAllRacks={getAllRacks}
              getAllRoom={getAllRoom}
              setRooms={setRooms}
              setRacks={setRacks}
              id={id}
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
            title={t("store.Racks.Add Rack")}
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
              setIsRoomDisabled={setIsRoomDisabled}
              offices={offices}
              isRoomDisabled={isRoomDisabled}
              rooms={rooms}
              id={id}
              onReset={rackReset}
              officeId={officeId}
              roomId={roomId}
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

export default RackRowView;
