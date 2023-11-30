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
import TextArea from 'antd/lib/input/TextArea';
import { useTranslation } from 'react-i18next';
import ARMForm from '../../../lib/common/ARMForm';
import ARMButton from '../../common/buttons/ARMButton';
import SubmitReset from '../../store/common/SubmitReset';

const ExternalDepartmentForm = ({
  form,
  onFinish,
  cities,
  onReset,
  id,
  setCountryModal,
  countries,
  setCityModal,
  handleFileInput,
  attachmentList,
  loading,
}) => {
  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };
  const { t } = useTranslation();
  const { Option } = Select;

  return (
    <ARMForm
      form={form}
      name="store"
      {...layout}
      initialValues={{}}
      autoComplete="off"
      style={{
        backgroundColor: '#ffffff',
      }}
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
            <Select
              placeholder="--Select base plant--"
              allowClear
              showSearch
              optionFilterProp="children"
              onChange={(e) => {
                //handleCountryChange(e);
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
                message: 'Base is required!',
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
                message: 'Office Phone is required!'
              },
              {
                max: 255,
                message: 'Maximum 255 character allowed'
              },
              {
                whitespace: true,
                message: 'Only space is not allowed'
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="emergencyContact"
            label="Emergency Contact"
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

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: 'Email is required!',
              },
              {
                max: 255,
                message: 'Maximum 255 character allowed',
              },
              {
                whitespace: true,
                message: 'Only space is not allowed',
              },
              {
                type: 'email',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="skype"
            label="Skype"
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
          <Form.Item
            name="website"
            label="Website"
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

          <Form.Item
             name="contactPerson"
             label="Contact Details"
             rules={[
              {
                required: true,
                message: "Contact Details is required!"
              } 
            ]}
           >
            <TextArea rows={4} />
          </Form.Item>

          {/* <Form.Item
            name="contactPerson"
            label="Contact Person"
            rules={[
              {
                required: true,
                message: 'Contact Person is required!',
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
            <Input />
          </Form.Item>

          <Form.Item
            name="contactMobile"
            label="Contact Mobile"
            rules={[
              {
                required:true,
                message:" Contact Mobile is required!"
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
            <Input />
          </Form.Item>

          <Form.Item
            name="contactPhone"
            label="Contact Phone"
            rules={[
              {
                required: true,
                message: 'Contact Phone is required!',
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
            <Input />
          </Form.Item>

          <Form.Item
            name="contactEmail"
            label="Contact Email"
            rules={[
              {
                required: true,
                message: 'Contact Email is required!',
              },
              {
                max: 255,
                message: 'Maximum 255 character allowed',
              },
              {
                whitespace: true,
                message: 'Only space is not allowed',
              },
              {
                type: 'email',
              },
            ]}
          >
            <Input />
          </Form.Item> */}
        </Col>

        <Col
          className="gutter-row"
          lg={10}
          md={24}
          sm={24}
          xs={24}
        >

          <Form.Item
            name="itemsBuild"
            label="Manufactured By"
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

          <Form.Item
            name="loadingPort"
            label="Loading Port"
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

          <Form.Item
            name="countryOriginId"
            label="Country Origin"
          >
            <Select
              placeholder="--Select origin country--"
              allowClear
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
            name="validTill"
            label="Approval Valid Till"
            rules={[
              {
                required: true,
                message: 'Validation date is required!',
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
                max: 255,
                message: 'Maximum 255 character allowed',
              },
              {
                whitespace: true,
                message: 'Only space is not allowed',
              },
            ]}
          >
            <TextArea rows={4} />
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
      <Row
        justify={'center'}
        gutter={10}
      >
        <Col
          className="gutter-row"
          xs={24}
          sm={14}
          md={12}
          lg={15}
        >
          <Form.Item>
            <Space>
              <ARMButton
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

export default ExternalDepartmentForm;
