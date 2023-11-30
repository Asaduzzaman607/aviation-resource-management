import CommonLayout from '../../layout/CommonLayout';
import { Breadcrumb } from 'antd';
import ARMCard from '../../common/ARMCard';
import { Link } from 'react-router-dom';
import React,{useEffect}  from 'react';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import CountryAddForm from "../base/CountryAddForm";
import {useTranslation} from "react-i18next";
import useCountry from "./useCountry";
import Permission from "../../auth/Permission";

const Country = () => {
  const { t } = useTranslation();
  const {
    id,
    onFinish,
    form,
    onReset,
    getCountryById

  } = useCountry();

  useEffect(() => {
    if (!id) {
      return;
    }
    getCountryById().catch(console.error);
  }, [id]);


  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-cog" />
            <Link to="/configurations">&nbsp; Configurations</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/configurations/base-plant">Base-Plant</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? 'edit' : 'add'}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
    <Permission permission={["CONFIGURATION_CONFIGURATION_BASE_PLANT_SAVE","CONFIGURATION_CONFIGURATION_BASE_PLANT_EDIT"]}>
      <ARMCard title={getLinkAndTitle('Base Plant', '/configurations/base-plant')}>
        <CountryAddForm
          onFinish={onFinish}
          form={form}
          id={id}
          onReset={onReset}
        />
      </ARMCard>
     </Permission>
    </CommonLayout>
  );
};
export default Country;
