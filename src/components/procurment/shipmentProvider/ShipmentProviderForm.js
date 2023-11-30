import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Upload,
} from 'antd';
import ARMForm from '../../../lib/common/ARMForm';
import ClientSelect from '../../common/ClientSelect';
import ARMButton from '../../common/buttons/ARMButton';

const ShipmentProviderForm = ({
  form,
  onFinish,
  countries,
  cities,
  onReset,
  id,
  setCountryModal,
  setCityModal,
  dialingCodes,
  handleCountryChange,
  handleFileInput,
  attachmentList,
  loading,
}) => {
  const { Option } = Select;
  const { TextArea } = Input;

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value) => {
    console.log('search:', value);
  };

  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
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
      <Row
        justify="center"
        gutter={10}
      >
        <Col
          className="gutter-row"
          lg={12}
          md={24}
          sm={24}
          xs={24}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: 'Name is required!',
              },
              {
                whitespace: true,
                message: 'only space is not allowed!',
              },
              {
                max: 100,
                message: 'max 100 character allowed',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Base Plant"
            name="countryId"
            rules={[
              {
                required: true,
                message: 'Please select an Base Plant',
              },
            ]}
          >
            <Select
              placeholder="--Select Base Plant--"
              allowClear
              showSearch
              optionFilterProp="children"
              onChange={(e) => {
                handleCountryChange(e);
                form.setFieldsValue({
                  cityId: '',
                });
              }}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              dropdownRender={(menu) => (
                <>
                  <Button
                    style={{ width: '100%' }}
                    type="primary"
                    onClick={() => setCountryModal(true)}
                  >
                    + Add Country
                  </Button>
                  {menu}
                </>
              )}
            >
              {countries?.map((country) => (
                <Option
                  key={country.id}
                  value={country.id}
                >
                  {country.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Base"
            name="cityId"
            tooltip={!id && 'Please select basePlant first'}
            rules={[
              {
                required: true,
                message: 'Please select a Base',
              },
            ]}
          >
            <Select
              placeholder="--Select Base--"
              allowClear
              showSearch
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              dropdownRender={(menu) => (
                <>
                  <Button
                    style={{ width: '100%' }}
                    type="primary"
                    onClick={() => setCityModal(true)}
                  >
                    + Add City
                  </Button>
                  {menu}
                </>
              )}
            >
              {cities?.map((city) => (
                <Option
                  key={city.id}
                  value={city.id}
                >
                  {city.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="officePhone"
            label="Office Phone"
            initialValue={''}
            rules={[
              {
                required: true,
                message: 'Office Phone is required!',
              },
            ]}
          >
            <Input addonBefore={dialingCodes} />
          </Form.Item>

          <Form.Item
            name="emergencyContact"
            label="Emergency Contact"
            rules={[
              {
                whitespace: true,
                message: 'only space is not allowed!',
              },
              {
                max: 100,
                message: 'max 100 character allowed',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: 'Email is required!',
              },
              {
                whitespace: true,
                message: 'only space is not allowed!',
              },
              {
                max: 100,
                message: 'max 100 character allowed',
              },
              { type: 'email' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="skype"
            label="Skype"
            rules={[
              {
                whitespace: true,
                message: 'only space is not allowed!',
              },
              {
                max: 100,
                message: 'max 100 character allowed',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="website"
            label="Website"
            rules={[
              {
                whitespace: true,
                message: 'only space is not allowed!',
              },
              {
                max: 100,
                message: 'max 100 character allowed',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="contactPerson"
            label="Contact Details"
            rules={[
              {
                required: true,
                message: 'Contact Details is required!',
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Col>

        <Col
          className="gutter-row"
          lg={10}
          md={24}
          sm={24}
          xs={24}
        >
          <Form.Item
            name="clientList"
            label="Vendor Client List"
          >
            <ClientSelect
              onChange={(selectedValues) => {
                form.setFieldValue('clientList', selectedValues);
              }}
              armForm={form}
            />
          </Form.Item>

          <Form.Item
            name="itemsBuild"
            label="Manufactured By"
            rules={[
              {
                whitespace: true,
                message: 'only space is not allowed!',
              },
              {
                max: 100,
                message: 'max 100 character allowed',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="loadingPort"
            label="Loading Port"
            rules={[
              {
                whitespace: true,
                message: 'only space is not allowed!',
              },
              {
                max: 100,
                message: 'max 100 character allowed',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="countryOriginId"
            label="Country Origin"
          >
            <Select
              placeholder="--Select origin country--"
              allowClear
            >
              {countries.map((country) => (
                <Option
                  key={country.id}
                  value={country.id}
                >
                  {country.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="validTill"
            label="Approval Valid Till"
            rules={[
              {
                required: true,
                message: 'Validation Date required!',
              },
            ]}
          >
            <DatePicker
              style={{ width: '100%' }}
              size="medium"
            />
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
                message: 'only space is not allowed!',
              },
              {
                max: 100,
                message: 'max 100 character allowed',
              },
            ]}
          >
            <TextArea rows={5} />
          </Form.Item>
          <Form.Item
            name="contactSkype"
            label="Contact Skype"
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
            <Input />
          </Form.Item>

          {!loading && (
            <Form.Item label="Attachments">
              <Upload.Dragger
                multiple
                onChange={handleFileInput}
                showUploadList={true}
                type="file"
                listType="picture"
                defaultFileList={[...attachmentList]}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Click to upload</Button>{' '}
                &nbsp;
              </Upload.Dragger>
            </Form.Item>
          )}
        </Col>
      </Row>
      <Row gutter={10}>
        <Col
          className="gutter-row"
          lg={18}
          md={12}
          sm={14}
          xs={24}
          offset={4}
        >
          <Form.Item
            wrapperCol={{
              offset: 0,
              span: 20,
            }}
            labelCol={{
              offset: 5,
              span: 10,
            }}
          >
            <Space size="medium">
              <ARMButton
                style={{ marginRight: '5px' }}
                type="primary"
                htmlType="submit"
              >
                {id ? 'Update' : 'Submit'}
              </ARMButton>
              <ARMButton
                onClick={onReset}
                type="primary"
                danger
              >
                Reset
              </ARMButton>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </ARMForm>
  );
};

export default ShipmentProviderForm;
