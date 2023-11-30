import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Upload,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslation } from 'react-i18next';
import ARMForm from '../../../lib/common/ARMForm';
import DebounceSelect from '../../common/DebounceSelect';
import ARMButton from '../../common/buttons/ARMButton';
import PartReturnDetails from './PartReturnDetails';

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const PartReturnForm = ({
  form,
  onFinish,
  handleDepartmentChange,
  id,
  department,
  isInternal,
  issue,
  onReset,
  selectedLocation,
  setSelectedLocation,
  setLocationModal,
  setShowModal,
  offices,
  handleFileInput,
  downloadLink,
  partId,
  selectedPartId,
  filestatus,
  setCAABForm,
  cAABForm,
}) => {
  const serviceable = Form.useWatch('isServiceable', form);
  const storeStockRoom = Form.useWatch('storeStockRoomId', form);
  const partClassification = Form.useWatch('partClassification', form);

  const onSearch = (value) => {
    console.log(value);
  };
  const { t } = useTranslation();
  return (
    <ARMForm
      {...layout}
      form={form}
      initialValues={{
        partClassification: 1,
        isServiceable: true,
        storeReturnPartList: [
          {
            id: null,
          },
        ],
      }}
      name="basic"
      onFinish={onFinish}
      autoComplete="off"
      style={{
        backgroundColor: '#ffffff',
      }}
    >
      <Row>
        <Col
          sm={20}
          md={10}
        >
          <Form.Item
            name="isInternalDept"
            label="Select Department"
            initialValue={true}
          >
            <Radio.Group
              onChange={handleDepartmentChange}
              disabled={!!id}
            >
              <Radio value={true}>Internal</Radio>
              <Radio value={false}>External</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="voucherNo"
            label="Voucher No"
            hidden={!id}
          >
            <Input
              disabled
              style={{ backgroundColor: '#fff', color: '#000' }}
            />
          </Form.Item>

          <Form.Item
            name={'departmentId'}
            label="Department"
            rules={[
              {
                required: true,
                message: 'Department is required!',
              },
            ]}
          >
            <Select
              allowClear
              placeholder="--Select Department--"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {department?.map((data) => (
                <Option
                  key={data.id}
                  value={data.id}
                >
                  {data.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="locationId"
            label="Location"
            rules={[
              {
                required: true,
                message: 'Location is required!',
              },
            ]}
          >
            <DebounceSelect
              debounceTimeout={1000}
              mapper={(v) => ({
                value: v.id,
                label: v.name,
              })}
              searchParam="name"
              showSearch
              value={selectedLocation}
              placeholder="---Select Location---"
              url="/aircraft-location/search"
              selectedValue={selectedLocation}
              onChange={(newValue) => {
                setSelectedLocation(newValue);
              }}
              dropdownRender={(menu) => (
                <>
                  <Button
                    style={{ width: '100%' }}
                    type="primary"
                    onClick={() => setLocationModal(true)}
                  >
                    + Add Location
                  </Button>
                  {menu}
                </>
              )}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>

          <Form.Item
            name="storeIssueId"
            label="Issue Demand No."
          >
            <Select
              allowClear
              placeholder="--Select Issue--"
            >
              {issue?.map((data) => (
                <Option
                  key={data.id}
                  value={data.id}
                >
                  {data.voucherNo}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Type"
            name="isServiceable"
            // shouldUpdate={true}
            rules={[
              {
                required: true,
                message: 'Type is required!',
              },
            ]}
          >
            <Select
              disabled={!!id}
              placeholder="Please Select Type"
            >
              <Option value={true}>Serviceable</Option>
              <Option value={false}>Unserviceable</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="unserviceableStatus"
            label="Status"
            hidden={serviceable}
            rules={[
              {
                required: !serviceable,
                message: "This field is required",
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
              name="storeLocation"
              label="Store Location"
              hidden={serviceable}
              rules={[
                {
                  required: false,
                  message: "This field is not required",
                }
              ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="remarks"
            label="Remarks"
          >
            <TextArea rows={3} />
          </Form.Item>
        </Col>
        <Col
          sm={20}
          md={10}
        >
          <Form.Item
            name="storeStockRoomId"
            label="Stock Room"
            rules={[
              {
                required: false,
                message: 'Stock Room is required!',
              },
            ]}
          >
            <DebounceSelect
              disabled={!!id}
              debounceTimeout={1000}
              mapper={(v) => ({
                value: v.stockRoomId,
                label: v.stockRoomNo,
              })}
              showSearch
              placeholder="--- Select Stock Room ---"
              url="store-management/store-stock-rooms/search"
              selectedValue={storeStockRoom}
            />
          </Form.Item>

          <Form.Item
            name="workOrderNumber"
            label="Work Order Number"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="workOrderSerial"
            label="Work Order Serial"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="aircraftRegistration"
            label="Aircraft Reg. No."
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="officeId"
            label={t('store.Racks.Store')}
          >
            <Select
              placeholder={'Select Store'}
              showSearch
              optionFilterProp="children"
              onSearch={onSearch}
              onChange={(e) => {
                form.setFieldsValue({ ...form, roomId: null });
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
              dropdownRender={(menu) => (
                <>
                  <Button
                    style={{ width: '100%' }}
                    type="primary"
                    onClick={() => setShowModal(true)}
                  >
                    + Add Store
                  </Button>
                  {menu}
                </>
              )}
            >
              {offices.map((store, index) => (
                <Option
                  key={index}
                  value={store.id}
                >
                  {store.code}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="partClassification"
            label="Part Type"
            rules={[
              {
                required: true,
                message: 'Part Type. is required!',
              },
            ]}
          >
            <Select
              allowClear
              placeholder="--- Select Part Type ---"
            >
              <Option value={1}>ROTABLE</Option>
              <Option value={2}>CONSUMABLE</Option>
              <Option value={3}>EXPENDABLE</Option>
            </Select>
          </Form.Item>
          {!filestatus && (
            <Form.Item
              label="Upload"
              render
            >
              <Upload.Dragger
                multiple
                onChange={handleFileInput}
                showUploadList={true}
                type="file"
                listType="picture"
                defaultFileList={[...downloadLink]}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Click to upload</Button>{' '}
                &nbsp;
              </Upload.Dragger>
            </Form.Item>
          )}
        </Col>
      </Row>

      <PartReturnDetails
        partId={partId}
        partClassification={partClassification}
        selectedPartId={selectedPartId}
        form={form}
        serviceable={serviceable}
        setCAABForm={setCAABForm}
        cAABForm={cAABForm}
      />

      <Row>
        <Col
          sm={20}
          md={10}
        >
          <Form.Item
            style={{ marginTop: '10px' }}
            wrapperCol={{ ...layout.wrapperCol }}
          >
            <Space size="small">
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

export default PartReturnForm;
