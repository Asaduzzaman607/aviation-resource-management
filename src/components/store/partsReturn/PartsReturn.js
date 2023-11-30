import { Breadcrumb, Modal, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import CountryAddForm from '../../configaration/base/CountryAddForm';
import SaveCity from '../../configaration/base/SaveCity';
import { useCity } from '../../configaration/base/useCity';
import useCountry from '../../configaration/basePlant/useCountry';
import LocationForm from '../../configaration/location/LocationForm';
import useLocation from '../../configaration/location/useLocation';
import CommonLayout from '../../layout/CommonLayout';
import Loading from '../common/Loading';
import { useUnusableItemReturns } from '../hooks/partsReturn';
import AddRoomModal from '../rack/AddRoomModal';
import { useRooms } from '../room/Room';
import OfficeForm from '../technicalStore/OfficeForm';
import useOffice from '../technicalStore/UseOffice';
import PartReturnForm from './PartReturnForm';

const PartsReturn = () => {
  const { onReset: countryReset, form: countryForm } = useCountry();

  const { onReset: cityReset, form: cityForm } = useCity();

  const { onReset: Location_Reset, form: Location_Form } = useLocation();

  const { onReset: storeReset, form: storeForm } = useOffice();

  const { form: roomForm, onReset: roomReset } = useRooms();

  const {
    serial,
    department,
    room,
    issue,
    form,
    id,
    isInternal,
    technicalStore,
    airport,
    handleDepartmentChange,
    handleStoreChange,
    onReset,
    onFinish,
    selectedLocation,
    setSelectedLocation,
    setLocationModal,
    setIsRoomDisabled,
    setShowModal,
    offices,
    rooms,
    setRoomModal,
    isRoomDisabled,
    locationModal,
    handleLocationSubmit,
    setCountryModal,
    countryModal,
    handleCountrySubmit,
    setCityModal,
    cityModal,
    handleCitySubmit,
    country,
    getAllCity,
    cities,
    setCountryVal,
    handleModelRoomSubmit,
    handleOfficeSubmit,
    showModal,
    roomModal,
    officeId,
    countryId,
    handleFileInput,
    downloadLink,
    loading,
    position,
    serviceable,
    getPartById,
    selectedPartId,
    partId,
    filestatus,
    cAABForm,
    setCAABForm,
  } = useUnusableItemReturns(
    roomForm,
    storeForm,
    Location_Form,
    countryForm,
    cityForm
  );
  const { t } = useTranslation();
  const route = useSelector((state) => state.routeLocation.previousRoute);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {' '}
            <Link to="/store">
              <i className="fas fa-archive" /> &nbsp;Store
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {route === 'list' ? (
              <Link to="/store/pending-parts-return">&nbsp;Parts Returns</Link>
            ) : (
              'Parts Returns'
            )}
            {/* <Link to="/store/pending-parts-return">&nbsp;Parts Returns</Link> */}
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? 'edit' : 'add'} </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      {!loading ? (
        <Permission
          permission={[
            'STORE_PARTS_RETURN_PART_RETURN_SAVE',
            'STORE_PARTS_RETURN_PART_RETURN_EDIT',
          ]}
          showFallback
        >
          <ARMCard
            title={
              route === 'list'
                ? getLinkAndTitle('Part Return', '/store/pending-parts-return')
                : getLinkAndTitle('Part Return', '/store')
            }
          >
            <PartReturnForm
              form={form}
              onFinish={onFinish}
              handleDepartmentChange={handleDepartmentChange}
              id={id}
              department={department}
              isInternal={isInternal}
              issue={issue}
              handleStoreChange={handleStoreChange}
              technicalStore={technicalStore}
              onReset={onReset}
              room={room}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              setLocationModal={setLocationModal}
              setIsRoomDisabled={setIsRoomDisabled}
              setShowModal={setShowModal}
              offices={offices}
              rooms={rooms}
              setRoomModal={setRoomModal}
              isRoomDisabled={isRoomDisabled}
              handleFileInput={handleFileInput}
              downloadLink={downloadLink}
              serial={serial}
              airport={airport}
              position={position}
              serviceable={serviceable}
              getPartById={getPartById}
              selectedPartId={selectedPartId}
              partId={partId}
              filestatus={filestatus}
              cAABForm={cAABForm}
              setCAABForm={setCAABForm}
            />
            <Modal
              title={t('store.OfficeModal.Add Store')}
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
              title={t('store.Rooms.Add Room')}
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
                setVal={setCountryVal}
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
          </ARMCard>
        </Permission>
      ) : (
        <Loading />
      )}
    </CommonLayout>
  );
};

export default PartsReturn;
