import React from 'react';
import ARMForm from "../../../lib/common/ARMForm";
import {Button, Checkbox, Col, DatePicker, Form, Input, Row, Select, Space} from "antd";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";

const SupplierForm = ({
                        form,
                        onFinish,
                        countries,
                        cities,
                        capability,
                        onReset,
                        id,
                        setCountryModal,
                        setCityModal,
                        dialingCodes,
                        handleCountryChange
                      }) => {
  const {Option} = Select;
  const {TextArea} = Input;

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };

  const layout = {
    labelCol: {
      span: 6,
    }, wrapperCol: {
      span: 16,
    },
  };

  return (
    <ARMForm
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
    >
      <Row justify="center" gutter={10}>
        <Col className="gutter-row" lg={12} md={24} sm={24} xs={24}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: 'Field should not be empty',
              },
              {
                max: 255,
                message: 'Maximum 255 character allowed',
              },
              {
                whitespace: true,
                message: 'Only space is not allowed',
              },
            ]}
          >
            <Input/>
          </Form.Item>


          <Form.Item
            label="Country"
            name="countryId"
            rules={[{
              required: true, message: 'Please select an option',
            },]}
          >
            <Select placeholder="Select Country" allowClear
                    showSearch
                    optionFilterProp="children"
                    onChange={(e) => {
                      handleCountryChange(e)
                      form.setFieldsValue({
                        cityId:''
                      })
                    }}
                    onSearch={onSearch}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    dropdownRender={(menu) => (<>
                      <Button
                        style={{width: "100%"}}
                        type="primary"
                        onClick={() => setCountryModal(true)}
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
            label="City"
            name="cityId"
            tooltip={!id && 'Please select basePlant first'}
            rules={[{
              required: true, message: 'Please select an option',
            },]}
          >
            <Select placeholder="Select City" allowClear
                    showSearch
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    dropdownRender={(menu) => (<>
                      <Button
                        style={{width: "100%"}}
                        type="primary"
                        onClick={() => setCityModal(true)}
                      >
                        + Add City
                      </Button>
                      {menu}
                    </>)}
            >
              {cities?.map((city) =>

                <Option key={city.id} value={city.id}>
                  {city.name}
                </Option>)}
            </Select>
          </Form.Item>


          <Form.Item
            name="officePhone"
            label="Office Phone"
            initialValue={""}
            rules={[
              {
                max: 255,
                message: 'Maximum 255 character allowed',
              },
              {
                whitespace: true,
                message: 'Only space is not allowed',
              },
            ]}
          >
            <Input addonBefore={dialingCodes}/>
          </Form.Item>

          <Form.Item name="emergencyContact" label="Emergency Contact"
                     rules={[{
                       max: 255,
                       message: 'Maximum 255 character allowed',
                     },
                       {
                         whitespace: true,
                         message: 'Only space is not allowed',
                       },]}
          >
            <Input/>
          </Form.Item>

          <Form.Item name="email" label="Email"
                     rules={[{
                       max: 255,
                       message: 'Maximum 255 character allowed',
                     },
                       {
                         whitespace: true,
                         message: 'Only space is not allowed',
                       },
                       {type: "email"}
                     ]}>
            <Input/>
          </Form.Item>

          <Form.Item name="skype" label="Skype"
                     rules={[{
                       max: 255,
                       message: 'Maximum 255 character allowed',
                     },

                       {
                         whitespace: true,
                         message: 'Only space is not allowed',
                       },]}>
            <Input/>
          </Form.Item>
          <Form.Item name="website" label="Website"
                     rules={[{
                       max: 255,
                       message: 'Maximum 255 character allowed',
                     },
                       {
                         whitespace: true,
                         message: 'Only space is not allowed',
                       },]}>
            <Input/>
          </Form.Item>
        </Col>

        <Col className="gutter-row" lg={10} md={24} sm={24} xs={24}>


          <Form.Item name="clientList" label="Client List"
                     rules={[{
                       max: 255,
                       message: 'Maximum 255 character allowed',
                     },]}>
            <Input/>
          </Form.Item>

          <Form.Item name="itemsBuild" label="Items Build"
                     rules={[{
                       max: 255,
                       message: 'Maximum 255 character allowed',
                     },
                       {
                         whitespace: true,
                         message: 'Only space is not allowed',
                       },

                     ]}>
            <Input/>
          </Form.Item>

          <Form.Item name="loadingPort" label="Loading Port"
                     rules={[{
                       max: 255,
                       message: 'Maximum 255 character allowed',
                     },
                       {
                         whitespace: true,
                         message: 'Only space is not allowed',
                       },

                     ]}


          >
            <Input/>
          </Form.Item>

          <Form.Item name="countryOriginId" label="Country Origin"
          >
            <Select placeholder="Select origin country" allowClear>
              {countries.map((country) => (
                <Option key={country.id} value={country.id}>
                  {country.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="validTill" label="Valid Till"
                     rules={[
                       {
                         required: true,
                         message: 'Select validity date!',
                       },
                     ]}

          >
            <DatePicker style={{width: '100%'}} size='medium'/>
          </Form.Item>
          <Form.Item name="address" label="Address"
                     rules={[{
                       max: 255,
                       message: 'Maximum 255 character allowed',
                     },
                       {
                         whitespace: true,
                         message: 'Only space is not allowed',
                       },

                     ]}>
            <TextArea rows={4}/>
          </Form.Item>
        </Col>
      </Row>
      <ARMCard
        title={"Capabilities"}
      >

        <Form.Item
          name="vendorCapabilityLogRequestDtoList"
          label=""
        >
          <Checkbox.Group
            style={{
              width: '100%',
            }}
          >
            <Row>
              {
                capability?.map((data) => (


                  <Col lg={8} xs={24}>
                    <Checkbox key={data.id} value={data.id}>{data.name}</Checkbox>
                  </Col>

                ))
              }
            </Row>
          </Checkbox.Group>
        </Form.Item>

      </ARMCard>
      <Row gutter={10}>
        <Col className="gutter-row" lg={16} md={12} sm={14} xs={24}>
          <Form.Item>
            <Space size="medium">
              <ARMButton
                style={{marginRight: '5px'}}
                type="primary"
                htmlType="submit"
              >
                {id ? 'Update' : 'Submit'}
              </ARMButton>
              <ARMButton onClick={onReset} type="primary" danger>
                Reset
              </ARMButton>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </ARMForm>
  );
};

export default SupplierForm;