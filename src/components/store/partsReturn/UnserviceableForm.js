import { Col, Form, Input, Row, Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import ARMCard from '../../common/ARMCard';
import PartReturnDebounce from './PartReturnDebounce';

const UnserviceableForm = ({
  name,
  restField,
  disabledField,
  disabledInstalledSerialField,
  partId,
  airport,
  position,
  index,
  form,
}) => {

  const removedPartId = Form.useWatch(['storeReturnPartList', index, 'partId']) || {};
  const installedPartId = Form.useWatch(['storeReturnPartList', index, 'installedPartId']) || {};

  return (
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
          md={6}
          className="parent"
        >
          <span>
            <span style={{color: 'red'}}>*</span> Installed Serial
            </span>
          <Form.Item
            {...restField}
            name={[name, 'installedPartSerialId']}
            rules={[
              {
                required: true,
                message: 'Installed Part Serial is required!',
              },
            ]}
          >
            <PartReturnDebounce
              disabled={!!disabledInstalledSerialField(name)}
              mapper={(v) => ({
                label: v.serialNo,
                value: v.serialId,
              })}
              showSearch
              allowClear
              url={`/serials/search-by-part-id?page=0&size=500`}
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
          md={6}
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
              allowClear
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
          md={6}
          className="parent"
        >
          <span>Auth Code</span>
          <Form.Item
            {...restField}
            name={[name, 'authCodeNo']}
          >
            <Input style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col
          xs={24}
          sm={24}
          md={6}
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
  );
};

export default UnserviceableForm;
