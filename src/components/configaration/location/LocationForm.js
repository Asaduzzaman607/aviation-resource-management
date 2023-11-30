import {Button, Col, Form, Input, Row, Select, Space} from "antd";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const LocationForm = ({
                        form,
                        onFinish,
                        countries,
                        cities,
                        id,
                        onReset,
                        setCountryModal,
                        setCityModal,
                        setVal
                      }) => {
  const {Option} = Select;
  const {TextArea} = Input;
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };


  return (
    <Row>
      <Col span={10}>
        <ARMForm
          {...layout}
          form={form}
          name="location"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="code"
            label="Code"
            rules={[
              {
                required: true,
                message: 'Please input code',
              },
              {
                max: 255,
                message: 'Maximum 255 characters allowed',
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
            label="Base Plant"
            name="countryId"
            rules={[
              {
                required: true,
                message: 'Base Plant is required!',
              },
            ]}
          >
            <Select placeholder="--Select Base Plant--" allowClear
                    showSearch
                    optionFilterProp="children"
                    onChange={(e) => {
                      form.setFieldsValue({
                        cityId: ''
                      })
                      setVal(e)
                    }
            }
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
            label="Base"
            name="cityId"
            tooltip={!id && 'Please select basePlant first'}
            rules={[
              {
                required: true,
                message: 'Base is required!',
              },
            ]}
          >
            <Select placeholder="--Select Base--" allowClear
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
              {cities?.map(
                (city) =>

                  <Option key={city.id} value={city.id}>
                    {city.name}
                  </Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[
              {
                required: true,
                message: 'Address is required!',
              },
              {
                whitespace: true,
                message: 'Only space is not allowed',
              },
            ]}
          >
            <TextArea rows={4}/>
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
    </Row>
  );
};

export default LocationForm;