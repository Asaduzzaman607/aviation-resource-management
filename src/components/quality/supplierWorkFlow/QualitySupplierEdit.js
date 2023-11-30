import {Link, useNavigate, useParams} from "react-router-dom";
import {Breadcrumb, Checkbox, Col, DatePicker, Form, Input, Modal, notification, Row, Select, Space} from "antd";
import React, {useEffect, useState} from "react";
import moment from "moment";

import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import Permission from "../../auth/Permission";
import useCountry from "../../configaration/basePlant/useCountry";
import {useCity} from "../../configaration/base/useCity";
import useSupplier from "./useSupplier";
import SupplierForm from "./SupplierForm";
import CountryAddForm from "../../configaration/base/CountryAddForm";
import SaveCity from "../../configaration/base/SaveCity";


const {Option} = Select;
const {TextArea} = Input;

const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 16,
    },
};

const QualitySupplierEdit = () => {
    const {
        onReset:countryReset,
        form:countryFrom,
    } = useCountry();


    const {
        onReset:cityReset,
        form:cityForm,
    } = useCity();
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
      countryId,
      getAllCountry
    } = useSupplier(countryFrom,cityForm)
  useEffect(() => {
    (async () => {
      await getAllCountry()
    })();
  }, []);
    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                <Breadcrumb.Item>
            {' '}
            <Link to="/quality">
              {' '}
              <i className="fas fa-clipboard-check" />
              &nbsp; Quality
            </Link>
          </Breadcrumb.Item>

                    <Breadcrumb.Item>
                    <Link to='/quality/pending-suppliers'>Quality Pending Supplier List</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>edit</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
          <Permission permission={["QUALITY_QUALITY_SUPPLIER_QUALITY_SUPPLIER_PENDING_LIST_SAVE","QUALITY_QUALITY_SUPPLIER_QUALITY_SUPPLIER_PENDING_LIST_EDIT"]}>
          <Space
            direction="vertical"
            size="medium"
            style={{
              display: "flex",
            }}
          >

            <ARMCard title={cardTitle}>
              <SupplierForm
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
              />
            </ARMCard>
            <Modal
              title="Add Country"
              style={{
                top: 20,
                zIndex:9999,
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
                zIndex:1,
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

export default QualitySupplierEdit;
