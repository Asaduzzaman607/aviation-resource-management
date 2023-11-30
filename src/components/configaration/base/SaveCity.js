import React from 'react';
import {Button, Col, Form, Input, Row, Select, Space} from "antd";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";

const layout = {
  labelCol: {
    span: 8,
  }, wrapperCol: {
    span: 16,
  },
};
const {Option} = Select;
const SaveCity = ({form, onFinish, countries, id, onReset, setShowModal, countryId}) => {
  React.useEffect(() => {
    form.setFieldsValue({
      countryId: countryId
    });
  }, [countryId]);

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };
  return (<Row>
    <Col span={10}>
      <ARMForm
        {...layout}
        form={form}
        name="city"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          label="Base Plant"
          name="countryId"
          rules={[{
            required: true, message: 'Please select a Base Plant!',
          },]}
        >
          <Select placeholder="Select Base Plant" allowClear
                  showSearch
                  optionFilterProp="children"
                  onChange={onChange}
                  onSearch={onSearch}
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                  dropdownRender={(menu) => (<>
                    <Button
                      style={{width: "100%"}}
                      type="primary"
                      onClick={() => setShowModal(true)}
                    >
                      + Add Country
                    </Button>
                    {menu}
                  </>)}
          >
            {countries?.map((country) => (<Option key={country.id} value={country.id}>
              {country.name}
            </Option>))}
          </Select>
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          rules={[{
            required: true, message: 'Please input input Name!',
          }, {
            max: 255, message: 'Maximum 255 characters allowed',
          }, {
            whitespace: true, message: 'Only space is not allowed',
          },]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="zipCode"
          label="Zip Code"
          rules={[{
            required: true, message: 'Please input input Name!',
          }, {
            whitespace: true, message: 'Only space is not allowed',
          }, {
            max: 11, message: 'Maximum 11 characters allowed',
          },]}
        >
          <Input/>
        </Form.Item>

        <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
          <Space size="small">
            <ARMButton type="primary" htmlType="submit">
              {id ? 'Update' : 'Submit'}
            </ARMButton>
            <ARMButton onClick={onReset} type="primary" danger>
              Reset
            </ARMButton>
          </Space>
        </Form.Item>
      </ARMForm>
    </Col>
  </Row>);
};

export default SaveCity;