import { Breadcrumb, Modal, Space } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import CommonLayout from '../../layout/CommonLayout';
import CountryAddForm from '../base/CountryAddForm';
import SaveCity from '../base/SaveCity';
import { useCity } from '../base/useCity';
import useCountry from '../basePlant/useCountry';
import ExternalDepartmentForm from './ExternalDepartmentForm';
import useExternalDepartment from './useExternalDepartment';

const ExternalDepartment = () => {
  const { t } = useTranslation();
  const { onReset: countryReset, form: countryFrom } = useCountry();

  const { onReset: cityReset, form: cityForm } = useCity();

  const {
    onFinish,
    onReset,
    country,
    setCountry,
    cities,
    setCities,
    countryModal,
    setCountryModal,
    cityModal,
    setCityModal,
    id,
    form,
    handleCountrySubmit,
    handleCitySubmit,
    getAllCountry,
    countryId,
    handleFileInput,
    attachmentList,
    loading
  } = useExternalDepartment(countryFrom, cityForm);

  // const {currency} = UseCurrency()

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
            <Link to="/configurations/">
              {' '}
              <i className="fas fa-cog" /> &nbsp; Configurations
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {' '}
            <Link to="/configurations/operator">Contracted Operator</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item> {id ? 'Edit' : 'Add'}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission={[
          'CONFIGURATION_CONFIGURATION_EXTERNAL_COMPANY_SAVE',
          'CONFIGURATION_CONFIGURATION_EXTERNAL_COMPANY_EDIT',
        ]}
      >
        <Space
          direction="vertical"
          size="middle"
          style={{
            display: 'flex',
          }}
        >
          <ARMCard
            title={getLinkAndTitle(
              id ? 'Update Contracted  Operator' : 'Add Contracted  Operator',
              '/configurations/operator'
            )}
          >
            <ExternalDepartmentForm
              onFinish={onFinish}
              onReset={onReset}
              cities={cities}
              countries={country}
              setCities={setCities}
              setCountry={setCountry}
              form={form}
              countryModal={countryModal}
              setCountryModal={setCountryModal}
              cityModal={cityModal}
              setCityModal={setCityModal}
              id={id}
              handleFileInput = {handleFileInput}
              attachmentList = {attachmentList}
              loading = {loading}
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

export default ExternalDepartment;
