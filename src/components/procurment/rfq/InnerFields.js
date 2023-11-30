import {Col, DatePicker, Form, Select, Spin} from 'antd';
import moment from 'moment';
import Input from "antd/es/input/Input";
import VendorDebounceSelect from "../../../lib/common/VendorDebounceSelect";
import React from "react";
import {getVendorStatus} from "../../../lib/common/manufacturerSupplierUtils";

const dateFormat = 'YYYY/MM/DD';
const InnerFields = ({name, restField, index, form}) => {

  const {Option} = Select;
  const handleVendorChange = async (e) => {
    form.setFieldsValue((form.getFieldValue('quoteRequestVendorModelList')[index].vendorStatus = getVendorStatus(e.title)));
  }
  const handleChange = async (value) => {
    form.setFieldsValue((form.getFieldValue('quoteRequestVendorModelList')[index].vendorId = {label: '', value: ''}));
    form.setFieldsValue((form.getFieldValue('quoteRequestVendorModelList')[index].vendorStatus = ""));
  };
  return (
    <>
      <Col
        xs={24}
        sm={24}
        md={7}
        className="parent"
      >
        <label>Vendor Type</label>
        <Form.Item
          {...restField}
          name={[name, 'vendorType']}
          rules={[{
            required: true,
            message: 'Vendor Type required'
          }]}
        >
          <Select
            onChange={handleChange}
            allowClear
          >
            <Option
              key={1}
              value={'SUPPLIER'}
            >
              SUPPLIER
            </Option>
            <Option
              key={2}
              value={'MANUFACTURER'}
            >
              MANUFACTURER
            </Option>
          </Select>
        </Form.Item>
      </Col>

      <Col
        xs={24}
        sm={24}
        md={6}
        className="parent"
      >
        <label>Request Date</label>
        <Form.Item
          {...restField}
          name={[name, 'requestDate']}
          initialValue={moment()}
          rules={[{
            required: true,
            message: 'Request Date required'
          }]}
        >
          <DatePicker
            size="medium"
            format={dateFormat}
            style={{width: '100%'}}
          ></DatePicker>
        </Form.Item>
      </Col>

      <Col
        xs={24}
        sm={24}
        md={7}
        className="parent"
      >
        <label>Vendor</label>
        <Form.Item
          {...restField}
          name={[name, 'vendorId']}
          rules={[{
            required: true,
            message: 'Vendor required'
          }]}
        >
          <VendorDebounceSelect
            mapper={(v) => ({
              label: v.name,
              value: v.id,
              title: v.workflowName
            })}
            showArrow
            searchParam="query"
            showSearch
            url={`/vendors/search?page=1&size=20`}
            params={{
              type: "ALL",
              vendorType: Form.useWatch(['quoteRequestVendorModelList', index, 'vendorType'])
            }}
            selectedValue={Form.useWatch(['quoteRequestVendorModelList', index, 'vendorId'])}
            onChange={(e)=>handleVendorChange(e)}
          />

        </Form.Item>
      </Col>
      <Col
        xs={24}
        sm={24}
        md={3}
        className="parent"
      >
        <label>Status</label>
        <Form.Item
          {...restField}
          name={[name, 'vendorStatus']}

        >
          <Input disabled style={{backgroundColor: '#fff', color: '#000'}}/>
        </Form.Item>
      </Col>
    </>
  );
};

export default InnerFields;
