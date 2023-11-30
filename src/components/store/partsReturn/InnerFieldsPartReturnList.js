import { Col, Form, Input, InputNumber } from 'antd';
import DebounceSelect from '../../common/DebounceSelect';
import PartReturnDebounce from './PartReturnDebounce';

const InnerFieldsPartReturnList = ({
  form,
  restField,
  index,
  handlePartChange,
  name,
  partClassification,
  serviceable,
}) => {
  return (
    <>
      <Col
        xs={24}
        sm={24}
        md={4}
        className="parent"
      >
        <label>
         {!serviceable && <span style={{color: 'red'}}>*</span>} Installed Part No
        </label>
        <Form.Item
          {...restField}
          name={[name, 'installedPartId']}
          rules={[
            {
              required: serviceable ? false : true,
              message: 'Installed Part No. is required!',
            },
          ]}
        >
          <PartReturnDebounce
            mapper={(v) => ({
              label: v.partNo,
              value: v.id,
            })}
            allowClear
            searchParam="partNo"
            showSearch
            url={`/part/search?page=1&size=20`}
            params={{
              partClassification: partClassification,
            }}
            onChange={(newValue) => {
              handlePartChange(newValue, index, 'installedPart');
            }}
            selectedValue={
              form.getFieldValue('storeReturnPartList')[index]?.installedPartId
            }
          />
        </Form.Item>
      </Col>
      <Col
        xs={24}
        sm={24}
        md={5}
        className="parent"
      >
        <label>Installed Description</label>
        <Form.Item
          {...restField}
          name={[name, 'installedPartDescription']}
        >
          <Input
            disabled
            style={{
              backgroundColor: '#fff',
              color: '#000',
            }}
          />
        </Form.Item>
      </Col>
      <Col
        xs={24}
        sm={24}
        md={4}
        className="parent"
      >
        <label>Installed UOM</label>
        <Form.Item
          {...restField}
          name={[name, 'installedPartUomId']}
        >
          <DebounceSelect
            debounceTimeout={1000}
            mapper={(v) => ({
              label: v.code,
              value: v.id,
            })}
            showArrow
            searchParam="query"
            showSearch
            url={`/store/unit/measurements/search?page=1&size=20`}
            selectedValue={Form.useWatch([
              'storeReturnPartList',
              index,
              'installedPartUomId',
            ])}
            style={{
              width: '100%',
            }}
          />
        </Form.Item>
      </Col>
      <Col
        xs={24}
        sm={24}
        md={4}
        className="parent"
      >
        <label>
          <span style={{color: 'red'}}>*</span> Removed Part No
        </label>
        <Form.Item
          {...restField}
          name={[name, 'partId']}
          rules={[
            {
              required: true,
              message: 'Part No. is required!',
            },
          ]}
        >
          <PartReturnDebounce
            mapper={(v) => ({
              label: v.partNo,
              value: v.id,
            })}
            allowClear
            searchParam="partNo"
            showSearch
            url={`/part/search?page=1&size=20`}
            params={{
              partClassification: partClassification,
            }}
            onChange={(newValue) => {
              handlePartChange(newValue, index, 'removedPart');
            }}
            selectedValue={
              Form.useWatch(['storeReturnPartList', index, 'partId'])
            }
          />
        </Form.Item>
      </Col>
      <Col
        xs={24}
        sm={24}
        md={5}
        className="parent"
      >
        <label>Removed Description</label>
        <Form.Item
          {...restField}
          name={[name, 'partDescription']}
        >
          <Input
            disabled
            style={{
              backgroundColor: '#fff',
              color: '#000',
            }}
          />
        </Form.Item>
      </Col>
      <Col
        xs={24}
        sm={24}
        md={4}
        className="parent"
      >
        <label>Removed UOM</label>
        <Form.Item
          {...restField}
          name={[name, 'removedPartUomId']}
        >
          <DebounceSelect
            debounceTimeout={1000}
            mapper={(v) => ({
              label: v.code,
              value: v.id,
            })}
            showArrow
            searchParam="query"
            showSearch
            url={`/store/unit/measurements/search?page=1&size=20`}
            selectedValue={Form.useWatch([
              'storeReturnPartList',
              index,
              'removedPartUomId',
            ])}
            style={{
              width: '100%',
            }}
          />
        </Form.Item>
      </Col>
      <Col
        xs={24}
        sm={24}
        md={5}
        className="parent"
      >
        <label>QTY.</label>
        <Form.Item
          {...restField}
          name={[name, 'quantityReturn']}
          rules={[
            {
              required: true,
              message: 'Qty. is required!',
            },
          ]}
          initialValue={1}
        >
          <InputNumber
            min={1}
            style={{ width: '100%' }}
            disabled={form.getFieldValue('partClassification') === 1}
          />
        </Form.Item>
      </Col>

      <Col
        xs={24}
        sm={24}
        md={4}
        className="parent"
      >
        <label>Release No.</label>
        <Form.Item
          {...restField}
          name={[name, 'releaseNo']}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col
        xs={24}
        sm={24}
        md={4}
        className="parent"
      >
        <label>Card Line No.</label>
        <Form.Item
          {...restField}
          name={[name, 'cardLineNo']}
        >
          <Input />
        </Form.Item>
      </Col>
    </>
  );
};

export default InnerFieldsPartReturnList;
