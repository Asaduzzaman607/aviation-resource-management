import { Breadcrumb, Modal, Space } from 'antd';
import { useEffect } from 'react';
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
import CommonLayout from '../../layout/CommonLayout';
import ShipmentProviderForm from './ShipmentProviderForm';
import useShipmentProvider from './useShipmentProvider';

const ShipmentProvider = () => {
  const { onReset: countryReset, form: countryFrom } = useCountry();

  const { onReset: cityReset, form: cityForm } = useCity();
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
    handleCountryChange,
    getAllCountry,
    countryId,
    handleFileInput,
    attachmentList,
    loading,
  } = useShipmentProvider(countryFrom, cityForm);

  useEffect(() => {
    (async () => {
      await getAllCountry();
    })();
  }, []);

  const route = useSelector((state) => state.routeLocation.previousRoute);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/material-management">
              <i className="fa fa-shopping-basket" /> &nbsp;Material Management
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Shipment Provider</Breadcrumb.Item>
          <Breadcrumb.Item>{id ? 'edit' : 'add'}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission={[
          'MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER_MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER_SAVE',
          'MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER_MATERIAL_MANAGEMENT_SHIPMENT_PROVIDER_EDIT',
        ]}
      >
        <Space
          direction="vertical"
          size="medium"
          style={{
            display: 'flex',
          }}
        >
          <ARMCard
            title={
              route === 'list'
                ? getLinkAndTitle(
                    cardTitle,
                    '/material-management/pending-shipment-provider'
                  )
                : getLinkAndTitle(cardTitle, '/material-management')
            }
          >
            <ShipmentProviderForm
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
              form={countryFrom}
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

export default ShipmentProvider;
