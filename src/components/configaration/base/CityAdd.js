import CommonLayout from '../../layout/CommonLayout';
import {
  Breadcrumb,
  Modal,
  Space,
} from 'antd';
import ARMCard from '../../common/ARMCard';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { Link } from 'react-router-dom';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import SaveCity from "./SaveCity";
import {useTranslation} from "react-i18next";
import {useCity} from "./useCity";
import CountryAddForm from "./CountryAddForm";
import useCountry from "../basePlant/useCountry";
import {useEffect} from "react";
import Permission from "../../auth/Permission";

const CityAdd = () => {
  const { t } = useTranslation();

  const {
    form:countryFrom,
    onReset:countryReset
  }=useCountry()

  const {id,
    form:cityForm,
    onFinish,
    country,
    onReset,
    setShowModal,
    showModal,
    handleModelSubmit,
    getCityById,
    getAllCountry
  }=useCity(countryFrom)

  useEffect(() => {
    id &&  getCityById(id);
  }, [id]);


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
              <i className="fas fa-cog" /> &nbsp;Configurations
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/configurations/base">Base</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? 'edit' : 'add'}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission={["CONFIGURATION_CONFIGURATION_BASE_SAVE","CONFIGURATION_CONFIGURATION_BASE_EDIT"]}>
      <Space
        direction="vertical"
        size="medium"
        style={{
          display: "flex",
        }}
      >
      <ARMCard title={getLinkAndTitle('Base', '/configurations/base/')}>
       <SaveCity
         id={id}
         form={cityForm}
         onFinish={onFinish}
         countries={country}
         onReset={onReset}
         setShowModal={setShowModal}
         showModal={showModal}
         getAllCountry={getAllCountry}
       />
      </ARMCard>
        <Modal
          title="Add Country"
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

          <CountryAddForm
            onFinish={handleModelSubmit}
            form={countryFrom}
            onReset={countryReset}
          />
        </Modal>
      </Space>
      </Permission>
    </CommonLayout>
  );
};

export default CityAdd;
