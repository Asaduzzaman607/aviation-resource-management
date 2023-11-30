import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Upload,
} from 'antd';
import Permission from '../../auth/Permission';

const { Option } = Select;
const { TextArea } = Input;

const StoreDemandBasicInfo = ({
  toggleAirportModal,
  airports,
  toggleAircraftModal,
  aircrafts,
  isInternal,
  setIsInternal,
  department,
  handleFileInput,
  downloadLink,
  storeDemandId,
  form,
}) => {
  return (
    <Row>
      <Col
        sm={20}
        md={10}
      >
        <Form.Item
          name="departmentType"
          label="Select Department"
          initialValue={'INTERNAL'}
        >
          <Radio.Group
            onChange={(e) => {
              setIsInternal(e.target.value);
              form.setFieldsValue({ departmentId: null });
            }}
            disabled={!!storeDemandId}
          >
            <Radio value={'INTERNAL'}>Internal</Radio>
            <Radio value={'EXTERNAL'}>External</Radio>
            <Permission 
             permission="STORE_PARTS_DEMAND_STORE_DEMAND_REPLENISHMENT"
            >
              <Radio value={'REPLENISHMENT'}>Replenishment </Radio>
            </Permission>

          </Radio.Group>
        </Form.Item>

        {isInternal !== 'REPLENISHMENT' ? (
          <Form.Item
            name={isInternal === 'INTERNAL' ? 'departmentId' : 'vendorId'}
            label="Department Code"
            rules={[
              {
                required: true,
                message: 'Please Select Department Code!',
              },
            ]}
          >
            <Select
              allowClear
              placeholder="--Select Department Code--"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {department?.map((data, index) => (
                <Option
                  key={index}
                  value={data.id}
                >
                  {isInternal == 'INTERNAL' ? data.code : data.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        ) : null}

        <Form.Item
          name="remarks"
          label="Remarks"
        >
          <TextArea />
        </Form.Item>

        {isInternal !== 'INTERNAL' && (
          <Form.Item
            label="Valid Till"
            name="validTill"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        )}
      </Col>

      <Col
        sm={20}
        md={10}
      >
        <Form.Item
          name="airportId"
          label="Airport"
        >
          <Select
            allowClear
            placeholder="--Select Airport--"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            dropdownRender={(airport) => (
              <>
                <Button
                  size="small"
                  style={{ width: '100%' }}
                  type="primary"
                  onClick={toggleAirportModal}
                >
                  + Add Airport
                </Button>
                {airport}
              </>
            )}
          >
            {airports?.map((data, index) => (
              <Option
                key={index}
                value={data.id}
              >
                {data.airportName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="aircraftId"
          label="Aircraft"
          rules={[
            {
              required: true,
              message: 'Please Select Aircraft!',
            },
          ]}
        >
          <Select
            allowClear
            placeholder="--Select Aircraft--"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            dropdownRender={(menu) => (
              <>
                <Button
                  size="small"
                  style={{ width: '100%' }}
                  type="primary"
                  onClick={toggleAircraftModal}
                >
                  + Add Aircraft
                </Button>
                {menu}
              </>
            )}
          >
            {aircrafts?.map((data, index) => (
              <Option
                key={index}
                value={data.id}
              >
                {data.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="workOrderNo"
          label="Work Order No."
        >
          <Input />
        </Form.Item>
        {isInternal == 'EXTERNAL' && (
          <Form.Item
            label="Upload"
            name="file"
            rules={[
              {
                required: true,
                message: 'required!',
              },
            ]}
          >
            <Upload.Dragger
              multiple
              onChange={handleFileInput}
              showUploadList={true}
              type="file"
              listType="picture"
              //fileList={[...downloadLink]}
              defaultFileList={[...downloadLink]}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button> &nbsp;
            </Upload.Dragger>
          </Form.Item>
        )}
      </Col>
    </Row>
  );
};

export default StoreDemandBasicInfo;
