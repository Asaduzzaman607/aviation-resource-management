import React from 'react';
import {Button, Col, DatePicker, Form, Input, InputNumber, Radio, Select} from "antd";
import DebounceSelect from "../../common/DebounceSelect";

const InnerFieldSerialSave = ({restField,name,index,form,setShowModal,setIndex,serials,currencies,partClassification}) => {
  return (
    <>
      <Col
        xs={24}
        sm={24}
        md={10}
      >
        <Form.Item
          {...restField}
          name={[name, 'serialId']}
          label="Serial"
          rules={[
            {
              required: true,
              message: 'Serial No. is required!',
            },
          ]}
        >
          <Select
            showSearch
            allowClear={true}
            disabled={
              !!form.getFieldValue('serialDtoList')[index]?.id
            }
            placeholder="--Select Serial--"
            filterOption={(input, option) =>
              option.children
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            dropdownRender={(menu) => (
              <>
                <Button
                  style={{ width: '100%' }}
                  type="primary"
                  onClick={() => {
                    setShowModal(true);
                    setIndex(index);
                  }}
                >
                  + Add Serial
                </Button>
                {menu}
              </>
            )}
          >
            {serials?.map((serial) => {
              return (
                <Select.Option
                  key={serial.serialId}
                  value={serial.serialId}
                >
                  {serial.serialNo}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          {...restField}
          name={[name, 'grnNo']}
          label="Grn No"
          rules={[
            {
              required: true,
              message: 'Grn No. is required!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          {...restField}
          name={[name, 'price']}
          label="Price"
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          {...restField}
          name={[name, 'currencyId']}
          label="Currency"
        >
          <Select
            allowClear
            placeholder="--Select Currency--"
          >
            {currencies?.map((currency) => {
              return (
                <Select.Option
                  key={currency.id}
                  value={currency.id}
                >
                  {currency.code}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        {partClassification === 2 && (
          <Form.Item
            {...restField}
            name={[name, 'quantity']}
            label="Quantity"
            rules={[
              {
                required: true,
                message: 'Quantity is required!',
              },
            ]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
            />
          </Form.Item>
        )}
      </Col>

      <Col
        xs={24}
        sm={24}
        md={10}
      >
        <Form.Item
          name={[name, 'uomId']}
          {...restField}
          label="UOM"
          rules={[
            {
              required: true,
              message: 'Rack life is Required!',
            },
          ]}

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
            placeholder={"Select UOM"}
            url={`/store/unit/measurements/search?page=1&size=20`}
            selectedValue={ Form.useWatch(['serialDtoList',index,'uomId'])}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
        <Form.Item
          name={[name, 'rackLife']}
          {...restField}
          //name="rackLife"
          label="Shelf Life"
          rules={[
            {
              required: true,
              message: 'Rack life is Required!',
            },
          ]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          {...restField}
          name={[name, 'selfLife']}
          //name="selfLife"
          label="Expire Date"
          rules={[
            {
              required: true,
              message: 'Self life is Required!',
            },
          ]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          {...restField}
          name={[name, 'partStatus']}
          label="Part Status"
          rules={[
            {
              required: true,
              message: 'partStatus is required!',
            },
          ]}
        >
          <Select
            allowClear
            placeholder="--Select Part Status--"
          >
            <Select.Option value="SERVICEABLE">
              SERVICEABLE
            </Select.Option>
            <Select.Option value="UNSERVICEABLE">
              UNSERVICEABLE
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          {...restField}
          name={[name, 'issued']}
          label="Transaction Type"
          style={{ marginLeft: '40px' }}
          rules={[
            {
              required: true,
              message: 'Transaction Type is Required!',
            },
          ]}
        >
          <Radio.Group
            allowClear
            placeholder="--Select Transaction type--"
            style={{ marginLeft: '10px' }}
          >
            <Radio value={true}>Issued</Radio>
            <Radio value={false}>Received</Radio>
          </Radio.Group>
        </Form.Item>
      </Col>
    </>
  );
};

export default InnerFieldSerialSave;