import { Button, Form, Input, Space } from 'antd';
import ARMForm from '../../../lib/common/ARMForm';
import ARMButton from '../../common/buttons/ARMButton';
import DebounceSelect from '../../common/DebounceSelect';

const OfficeForm = ({
  form,
  id,
  onFinish,
  onReset,
  selectedLocation,
  setSelectedLocation,
  setLocationModal,
}) => {
  const { TextArea } = Input;

  const layout = {
    labelCol: {
      span: 3,
    },
    wrapperCol: {
      span: 7,
    },
  };
  return (
    <ARMForm
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
    >
      <Form.Item
        name="code"
        label="Code"
        rules={[
          {
            required: true,
            message: 'Code is required!',
          },
          {
            max: 50,
            message: 'Maximum 50 characters allowed',
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
            label: v.code,
          })}
          showSearch
          value={selectedLocation}
          placeholder="---Select Location---"
          url="/store/locations/search"
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
        name="address"
        label="Address"
        rules={[

          {
            max: 250,
            message: 'Maximum 250 characters allowed',
          },
          {
            whitespace: true,
            message: 'Only space is not allowed',
          },
        ]}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 3 }}>
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
    </ARMForm>
  );
};

export default OfficeForm;
