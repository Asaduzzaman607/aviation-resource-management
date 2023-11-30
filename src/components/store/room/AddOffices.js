import React from 'react';
import {Button, Form, Input, Space} from "antd";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
import PropTypes from "prop-types";
import DebounceSelect from "../../common/DebounceSelect";
import TextArea from "antd/es/input/TextArea";
import {useTranslation} from "react-i18next";

const layout = {
  labelCol: {
    span: 3,
  }, wrapperCol: {
    span: 12,
  },
};

const AddOffices = ({form, onFinish, onReset, id, selectedLocation, setSelectedLocation, setLocationModal}) => {
  const {t} = useTranslation();
  return (<div>
    <ARMForm
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
    >
      <Form.Item
        name="code"
        label="Code"
        rules={[{
          required: true, message: t("store.OfficeModal.Please input Code !"),
        }, {
          max: t("common.max"), message: t("common.Maximum 255 characters allowed"),
        }, {
          whitespace: true, message: t("common.Only space is not allowed"),
        },]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        name="locationId"
        label="Location"
        rules={[{
          required: true, message: 'Location is required!',
        },]}
      >
        <DebounceSelect
          debounceTimeout={1000}
          mapper={(v) => ({
            value: v.id, label: v.code,
          })}
          showSearch
          value={selectedLocation}
          placeholder="---Select Location---"
          url="/store/locations/search"
          selectedValue={selectedLocation}
          onChange={(newValue) => {
            setSelectedLocation(newValue);
          }}
          dropdownRender={(menu) => (<>
            <Button
              style={{width: "100%"}}
              type="primary"
              onClick={() => setLocationModal(true)}
            >
              + Add Location
            </Button>
            {menu}
          </>)}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>
      <Form.Item name="address" label={t("store.OfficeModal.Address")}>
        <TextArea rows={4}/>
      </Form.Item>
      <Form.Item wrapperCol={{...layout.wrapperCol, offset: 3}}>
        <Space size="small">
          <ARMButton type="primary" htmlType="submit">
            {id ? t("common.Update") : t("common.Submit")}
          </ARMButton>
          <ARMButton onClick={onReset} type="primary" danger>
            {t("common.Reset")}
          </ARMButton>
        </Space>
      </Form.Item>
    </ARMForm>
  </div>);
};
AddOffices.propTypes = {
  form: PropTypes.object.isRequired, onFinish: PropTypes.func.isRequired, id: PropTypes.number,
};

export default AddOffices;