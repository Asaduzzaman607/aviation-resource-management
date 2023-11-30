import { Checkbox, Col, Form, Input, Radio, Row, Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import { useState } from 'react';
import ARMCard from '../../common/ARMCard';
import CAABForm from './CAABForm';
import PartReturnDebounce from './PartReturnDebounce';

const ServiceableForm = ({
  form,
  name,
  restField,
  disabledField,
  disabledInstalledSerialField,
  partId,
  airport,
  position,
  cAABForm,
  setCAABForm,
  index,
}) => {
  const [cAABVisiable, setCAABVisiable] = useState(false);

  const getField = () => {
    if (form.getFieldValue('storeReturnPartList')[index].caabEnabled != null) {
      if (form.getFieldValue('storeReturnPartList')[index].caabEnabled[0] === true
      ) {
        return true;
      }
    }
    return cAABVisiable === true;

  };

  const removedPartId = Form.useWatch(['storeReturnPartList', index, 'partId']) || {};
  const installedPartId = Form.useWatch(['storeReturnPartList', index, 'installedPartId']) || {};

  return (
    <>
      <ARMCard
        style={{
          backgroundColor: '#f7fbfe',
          marginBottom: '10px',
          width: '92%',
        }}
      >
        <Row gutter={[16, 16]}>
          <Col
            xs={24}
            sm={24}
            md={4}
            className="parent"
          >
            <span>Installed Serial</span>
            <Form.Item
              {...restField}
              name={[name, 'installedPartSerialId']}
            >
              <PartReturnDebounce
                disabled={!!disabledInstalledSerialField(name)}
                mapper={(v) => ({
                  label: v.serialNo,
                  value: v.serialId,
                })}
                showSearch
                url={`/serials/search-by-part-id?page=1&size=500`}
                searchParam="serialNumber"
                params={{ partId: installedPartId.value }}
                selectedValue={Form.useWatch([
                  'storeReturnPartList',
                  index,
                  'installedPartSerialId',
                ])}
              />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={4}
            className="parent"
          >
            <span>
              <span style={{color: 'red'}}>*</span> Removed Serial
             </span>
            <Form.Item
              {...restField}
              name={[name, 'removedPartSerialId']}
              rules={[
                {
                  required: true,
                  message: 'Removed Part Serial is required!',
                },
              ]}
            >
              <PartReturnDebounce
                disabled={!!disabledField(name)}
                mapper={(v) => ({
                  label: v.serialNo,
                  value: v.serialId,
                })}
                showSearch
                url={`/serials/search-by-part-id?page=1&size=500`}
                searchParam="serialNumber"
                params={{ partId: removedPartId.value }}
                selectedValue={Form.useWatch([
                  'storeReturnPartList',
                  index,
                  'removedPartSerialId',
                ])}
              />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={4}
            className="parent"
          >
            <span>
              <span style={{color: 'red'}}>*</span> Auth Code
            </span>
            <Form.Item
              {...restField}
              name={[name, 'authCodeNo']}
              rules={[
                {
                  required: true,
                  message: 'Auth Code No is required!',
                },
              ]}
            >
              <Input style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col
            xs={24}
            sm={24}
            md={4}
            className="parent"
          >
            <span>Airport</span>
            <Form.Item
              {...restField}
              name={[name, 'airportId']}
            >
              <Select allowClear>
                {airport?.map((data) => (
                  <Option
                    key={data.id}
                    value={data.id}
                  >
                    {data.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={4}
            lg={4}
          >
            <Form.Item
              {...restField}
              name={[name, 'isUsed']}
              initialValue={false}
            >
              <Radio.Group>
                <Radio value={true}>Used</Radio>
                <Radio value={false}>Not Used</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={4}
          >
            <Form.Item
              {...restField}
              name={[name, 'caabEnabled']}
            >
              <Checkbox.Group
                onChange={(e) =>
                  e.length > 0 ? setCAABVisiable(e[0]) : setCAABVisiable(false)
                }
              >
                <Checkbox value={true}>CABB From 1</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={4}
          >
            <Form.Item
              hidden
              {...restField}
              name={[name, 'id']}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </ARMCard>
      {getField() && (
        <CAABForm
          name={name}
          restField={restField}
        />
      )}
    </>
  );
};

export default ServiceableForm;
